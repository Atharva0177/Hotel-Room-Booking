const PDFDocument = require('pdfkit');
const https = require('https');
const http = require('http');
const { prisma } = require('../config/db');

const formatINR = (value) => `INR ${Math.round(Number(value || 0)).toLocaleString('en-IN')}`;

const fetchImageBuffer = (url) =>
  new Promise((resolve) => {
    if (!url || typeof url !== 'string') {
      resolve(null);
      return;
    }

    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          resolve(null);
          return;
        }

        const data = [];
        res.on('data', (chunk) => data.push(chunk));
        res.on('end', () => resolve(Buffer.concat(data)));
      })
      .on('error', () => resolve(null));
  });

const INVOICE_SETTING_KEYS = ['invoiceHotelName', 'invoiceTitle', 'invoiceFooterNote', 'invoiceIssuer'];

const getInvoiceSettings = async () => {
  const defaults = {
    invoiceHotelName: 'Aurelia Grand Hotel',
    invoiceTitle: 'LUXURY HOSPITALITY INVOICE',
    invoiceFooterNote: 'Thank you for choosing Aurelia Grand Hotel. We look forward to hosting you again.',
    invoiceIssuer: 'Accounts Department, Aurelia Grand Hotel',
  };

  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: INVOICE_SETTING_KEYS } } });
    const saved = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    return { ...defaults, ...saved };
  } catch (_error) {
    return defaults;
  }
};

const drawHeader = (doc, booking, banner, settings) => {
  const pageWidth = doc.page.width;
  const contentX = 40;
  const contentWidth = pageWidth - 80;

  doc.roundedRect(contentX, 30, contentWidth, 118, 8).fill('#1A1410');

  if (banner) {
    doc.save();
    doc.opacity(0.28).image(banner, contentX, 30, { width: contentWidth, height: 118 });
    doc.opacity(1);
    doc.restore();
  }

  doc.fillColor('#D4B071').fontSize(12).text(settings.invoiceTitle, contentX + 16, 44, {
    width: contentWidth - 32,
    align: 'left',
  });

  doc.fillColor('#F8EFE0').fontSize(30).text(settings.invoiceHotelName, contentX + 16, 58, {
    width: contentWidth - 32,
    align: 'left',
  });

  doc.fillColor('#E8D7BA').fontSize(10).text('Aurora Bay Road, Goa, India | +91 98765 43210 | stay@aureliagrand.com', contentX + 16, 98, {
    width: contentWidth - 32,
    align: 'left',
  });

  doc.fillColor('#4B3A1E').fontSize(11).text(`Invoice #: ${booking.bookingCode}`, contentX, 164, { continued: true });
  doc.text(`Issue Date: ${new Date().toDateString()}`, { align: 'right' });
};

const drawStatusStamp = (doc, booking) => {
  const status = booking.status || 'PENDING';
  let color = '#B68D43';
  if (status === 'CONFIRMED' || booking.paymentStatus === 'PAID') color = '#1B8A5A';
  if (status === 'CANCELLED') color = '#B42318';

  doc.save();
  doc.rotate(-18, { origin: [472, 212] });
  doc.roundedRect(392, 188, 160, 44, 6).lineWidth(2).stroke(color);
  doc.fillColor(color).fontSize(18).text(status, 392, 200, { width: 160, align: 'center' });
  doc.restore();
};

const drawMetaBlocks = (doc, booking) => {
  doc.roundedRect(40, 200, 255, 122, 6).stroke('#E7CFA4');
  doc.roundedRect(310, 200, 245, 122, 6).stroke('#E7CFA4');

  doc.fillColor('#A17835').fontSize(12).text('Bill To', 54, 214);
  doc.fillColor('#20170E').fontSize(12).text(booking.guestName || 'Guest', 54, 236);
  doc.fillColor('#4B3A1E').fontSize(10).text(booking.guestEmail || '-', 54, 255);
  doc.text(booking.guestPhone || '-', 54, 271);

  doc.fillColor('#A17835').fontSize(12).text('Booking Details', 324, 214);
  doc.fillColor('#4B3A1E').fontSize(10);
  doc.text(`Room: ${booking.room?.name || 'Luxury Suite'}`, 324, 236);
  doc.text(`Check-in: ${new Date(booking.checkIn).toDateString()}`, 324, 252);
  doc.text(`Check-out: ${new Date(booking.checkOut).toDateString()}`, 324, 268);
  doc.text(`Guests: ${booking.adults || 1} Adults, ${booking.children || 0} Children`, 324, 284);
};

const drawChargesTable = (doc, booking) => {
  const tableX = 40;
  const tableWidth = 515;
  const headY = 346;

  doc.roundedRect(tableX, headY, tableWidth, 28, 4).fill('#2A1D12');
  doc.fillColor('#F5E7CB').fontSize(11);
  doc.text('Description', tableX + 12, headY + 9);
  doc.text('Nights', tableX + 290, headY + 9, { width: 80, align: 'center' });
  doc.text('Amount', tableX + 380, headY + 9, { width: 120, align: 'right' });

  const rowY = headY + 28;
  doc.rect(tableX, rowY, tableWidth, 30).stroke('#E7CFA4');
  doc.fillColor('#2A1D12').fontSize(10);
  doc.text(`${booking.room?.name || 'Room Stay'} @ ${formatINR(booking.totalPrice / Math.max(1, booking.nights || 1))}/night`, tableX + 12, rowY + 10);
  doc.text(String(booking.nights || 1), tableX + 290, rowY + 10, { width: 80, align: 'center' });
  doc.text(formatINR(booking.totalPrice), tableX + 380, rowY + 10, { width: 120, align: 'right' });

  const summaryY = rowY + 48;
  doc.fillColor('#4B3A1E').fontSize(10);
  doc.text('Subtotal', tableX + 340, summaryY, { width: 90, align: 'right' });
  doc.text(formatINR(booking.totalPrice), tableX + 430, summaryY, { width: 110, align: 'right' });

  doc.text('Tax (18%)', tableX + 340, summaryY + 18, { width: 90, align: 'right' });
  doc.text(formatINR(booking.taxAmount), tableX + 430, summaryY + 18, { width: 110, align: 'right' });

  doc.moveTo(tableX + 340, summaryY + 40).lineTo(tableX + 540, summaryY + 40).stroke('#D0A763');
  doc.fillColor('#8C6A2E').fontSize(13).text('Total Paid', tableX + 340, summaryY + 46, { width: 90, align: 'right' });
  doc.fillColor('#8C6A2E').fontSize(13).text(formatINR(booking.finalPrice), tableX + 430, summaryY + 46, { width: 110, align: 'right' });
};

const drawFooter = (doc, booking, settings) => {
  const y = 728;
  doc.moveTo(40, y).lineTo(555, y).stroke('#E7CFA4');
  doc.fillColor('#4B3A1E').fontSize(9);
  doc.text(`Payment Status: ${booking.paymentStatus || 'UNPAID'}`, 40, y + 8);
  doc.text(settings.invoiceFooterNote, 40, y + 22, {
    width: 360,
  });

  doc.fillColor('#A17835').fontSize(10).text(settings.invoiceIssuer, 360, y + 38, { width: 195, align: 'right' });
};

const buildInvoiceBuffer = async (booking) =>
  new Promise(async (resolve) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const banner = await fetchImageBuffer(booking.room?.images?.[0]);
    const invoiceSettings = await getInvoiceSettings();

    drawHeader(doc, booking, banner, invoiceSettings);
    drawStatusStamp(doc, booking);
    drawMetaBlocks(doc, booking);
    drawChargesTable(doc, booking);
    drawFooter(doc, booking, invoiceSettings);

    doc.end();
  });

module.exports = { buildInvoiceBuffer };
