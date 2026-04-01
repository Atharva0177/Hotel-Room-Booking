const { prisma } = require('../config/db');
const { BookingStatus } = require('@prisma/client');
const { buildInvoiceBuffer } = require('../services/pdf.service');
const { sendEmail } = require('../services/email.service');

const sendBookingNotification = async ({ booking, subject, title, note }) => {
  try {
    const roomName = booking.room?.name || 'Aurelia Room';
    await sendEmail({
      to: booking.guestEmail,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1f2937;line-height:1.5">
          <h2 style="color:#8a6b2f;margin-bottom:8px">${title}</h2>
          <p>Dear ${booking.guestName},</p>
          <p>${note}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #e5e7eb">
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Booking Code</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${booking.bookingCode}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Room</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${roomName}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Check-in</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${new Date(booking.checkIn).toDateString()}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Check-out</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${new Date(booking.checkOut).toDateString()}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Units Booked</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${booking.roomsBooked || 1}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Status</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${booking.status}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Payment</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${booking.paymentStatus}</td></tr>
          </table>
          <p>Thank you for choosing Aurelia Grand Hotel.</p>
        </div>
      `,
    });
  } catch (error) {
    // Do not fail booking workflows because of SMTP issues.
    console.error('Email notification failed:', error.message);
  }
};

const sendAdminNewBookingAlert = async (booking) => {
  const adminRecipient = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminRecipient) return;

  try {
    await sendEmail({
      to: adminRecipient,
      subject: `New Booking Received - ${booking.bookingCode}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1f2937;line-height:1.5">
          <h2 style="color:#8a6b2f;margin-bottom:8px">New Booking Alert</h2>
          <p>A new booking request has been submitted and is currently pending approval.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #e5e7eb">
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Booking Code</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${booking.bookingCode}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Guest</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${booking.guestName}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Email</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${booking.guestEmail}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Room</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${booking.room?.name || 'Aurelia Room'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Units Required</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${booking.roomsBooked || 1}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Check-in</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${new Date(booking.checkIn).toDateString()}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Check-out</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${new Date(booking.checkOut).toDateString()}</td></tr>
          </table>
        </div>
      `,
    });
  } catch (error) {
    console.error('Admin email notification failed:', error.message);
  }
};

const generateBookingCode = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(10000 + Math.random() * 90000);
  return `AUR-${y}${m}${d}-${random}`;
};

const calculatePricing = (checkIn, checkOut, rate, discount = 0) => {
  const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
  const subtotal = nights * rate;
  const discountAmount = subtotal * (discount / 100);
  const totalAfterDiscount = subtotal - discountAmount;
  const tax = totalAfterDiscount * 0.18;
  return {
    nights,
    totalPrice: subtotal,
    taxAmount: tax,
    finalPrice: totalAfterDiscount + tax,
    discountAmount,
  };
};

const getBookings = async (req, res, next) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
    const bookings = await prisma.booking.findMany({
      where,
      include: { room: true, user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, message: 'Bookings fetched', data: bookings });
  } catch (error) {
    return next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { room: true, user: true },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return res.json({ success: true, message: 'Booking fetched', data: booking });
  } catch (error) {
    return next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      promoCode,
    } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ success: false, message: 'Invalid check-in/check-out dates' });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const totalGuests = Number(adults || 0) + Number(children || 0);
    const roomsNeeded = Math.max(1, Math.ceil(totalGuests / Math.max(1, room.maxGuests)));

    const overlap = await prisma.booking.findMany({
      where: {
        roomId,
        status: { not: 'CANCELLED' },
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
      select: { roomsBooked: true },
    });

    const unitsAlreadyBooked = overlap.reduce((sum, item) => sum + (item.roomsBooked || 1), 0);
    const availableUnits = Math.max(0, (room.inventoryCount || 1) - unitsAlreadyBooked);

    if (availableUnits < roomsNeeded) {
      return res.status(409).json({
        success: false,
        message: `Only ${availableUnits} unit(s) are available for selected dates. ${roomsNeeded} required for ${totalGuests} guests.`,
      });
    }

    let discount = 0;
    if (promoCode) {
      const offer = await prisma.offer.findFirst({
        where: {
          code: promoCode,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      });
      if (offer) discount = offer.discount;
    }

    const price = calculatePricing(checkInDate, checkOutDate, room.pricePerNight, discount, roomsNeeded);

    const booking = await prisma.booking.create({
      data: {
        bookingCode: generateBookingCode(),
        userId: req.user.id,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights: price.nights,
        adults,
        children,
        roomsBooked: roomsNeeded,
        totalPrice: price.totalPrice,
        taxAmount: price.taxAmount,
        finalPrice: price.finalPrice,
        paymentStatus: 'UNPAID',
        status: 'PENDING',
        specialRequests,
        guestName,
        guestEmail,
        guestPhone,
      },
      include: { room: true },
    });

    await sendBookingNotification({
      booking,
      subject: `Booking Pending Approval - ${booking.bookingCode}`,
      title: 'Booking Request Received',
      note:
        'Your booking request is now pending approval. Our team will review availability and confirm shortly.',
    });

    await sendAdminNewBookingAlert(booking);

    return res.status(201).json({ success: true, message: 'Booking created', data: booking });
  } catch (error) {
    return next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const paymentStatus =
      status === 'CHECKED_IN'
        ? 'PAID'
        : status === 'CANCELLED'
          ? 'REFUNDED'
          : undefined;

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
      },
      include: { room: true },
    });

    if (status === 'CONFIRMED') {
      await sendBookingNotification({
        booking,
        subject: `Booking Confirmed - ${booking.bookingCode}`,
        title: 'Your Booking Is Confirmed',
        note:
          'Your reservation has been approved by the hotel and is now confirmed. Payment will be collected at the hotel front desk during check-in.',
      });
    } else if (status === 'PENDING') {
      await sendBookingNotification({
        booking,
        subject: `Booking Pending Approval - ${booking.bookingCode}`,
        title: 'Booking Set To Pending',
        note: 'Your reservation is currently pending review by the hotel team.',
      });
    } else if (status === 'CANCELLED') {
      await sendBookingNotification({
        booking,
        subject: `Booking Cancelled - ${booking.bookingCode}`,
        title: 'Booking Cancelled',
        note: 'Your booking has been cancelled. Please contact support if you need further assistance.',
      });
    }

    return res.json({ success: true, message: 'Booking status updated', data: booking });
  } catch (error) {
    return next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const checkInTime = new Date(booking.checkIn).getTime();
    const now = Date.now();
    const hoursDiff = (checkInTime - now) / (1000 * 60 * 60);

    const paymentStatus = hoursDiff > 48 ? 'REFUNDED' : booking.paymentStatus;

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED', paymentStatus },
      include: { room: true },
    });

    await sendBookingNotification({
      booking: updated,
      subject: `Booking Cancelled - ${updated.bookingCode}`,
      title: 'Booking Cancelled',
      note:
        paymentStatus === 'REFUNDED'
          ? 'Your booking has been cancelled and marked as refunded as per policy.'
          : 'Your booking has been cancelled.',
    });

    return res.json({
      success: true,
      message: hoursDiff > 48 ? 'Booking cancelled and marked refunded' : 'Booking cancelled',
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { room: true, user: true },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const invoiceBuffer = await buildInvoiceBuffer(booking);
    const filename = `invoice-${booking.bookingCode}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(invoiceBuffer);
  } catch (error) {
    return next(error);
  }
};

const hardDeleteBooking = async (req, res, next) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Booking permanently deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  hardDeleteBooking,
  getInvoice,
};
