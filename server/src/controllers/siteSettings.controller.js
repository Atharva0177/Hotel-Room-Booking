const { prisma } = require('../config/db');

const DEFAULT_SETTINGS = {
  navbarBrand: 'Aurelia Grand',
  heroTitle: 'Aurelia Grand Hotel',
  heroSubtitle: 'A five-star editorial luxury escape where gold-lit interiors meet ocean winds.',
  footerBrand: 'AURELIA GRAND HOTEL',
  footerContact: 'Aurora Bay Road, Goa, India | +91 98765 43210 | stay@aureliagrand.com',
  invoiceHotelName: 'Aurelia Grand Hotel',
  invoiceTitle: 'LUXURY HOSPITALITY INVOICE',
  invoiceFooterNote: 'Thank you for choosing Aurelia Grand Hotel. We look forward to hosting you again.',
  invoiceIssuer: 'Accounts Department, Aurelia Grand Hotel',
  adminMapPinLat: '15.54',
  adminMapPinLng: '73.82',
  adminMapZoom: '12',
  adminMapEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=73.75%2C15.45%2C73.95%2C15.65&layer=mapnik&marker=15.54%2C73.82',
};

const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS);

const fetchSettingsMap = async () => {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: SETTINGS_KEYS } },
  });

  const saved = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return { ...DEFAULT_SETTINGS, ...saved };
};

const getSiteSettings = async (_req, res, next) => {
  try {
    const settings = await fetchSettingsMap();
    return res.json({ success: true, message: 'Site settings fetched', data: settings });
  } catch (error) {
    return next(error);
  }
};

const updateSiteSettings = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const updates = SETTINGS_KEYS.filter((key) => typeof payload[key] === 'string').map((key) => ({
      key,
      value: payload[key].trim(),
    }));

    if (!updates.length) {
      return res.status(400).json({ success: false, message: 'No valid settings provided' });
    }

    await prisma.$transaction(
      updates.map((item) =>
        prisma.siteSetting.upsert({
          where: { key: item.key },
          create: item,
          update: { value: item.value },
        }),
      ),
    );

    const settings = await fetchSettingsMap();
    return res.json({ success: true, message: 'Site settings updated', data: settings });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getSiteSettings, updateSiteSettings };
