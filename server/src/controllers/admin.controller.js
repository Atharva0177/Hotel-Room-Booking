const { prisma } = require('../config/db');

const getStats = async (_req, res, next) => {
  try {
    const [totalBookings, revenueAgg, totalGuests, totalRooms] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.aggregate({ _sum: { finalPrice: true } }),
      prisma.user.count({ where: { role: 'GUEST' } }),
      prisma.room.count(),
    ]);

    return res.json({
      success: true,
      message: 'Stats fetched',
      data: {
        totalBookings,
        totalRevenue: revenueAgg._sum.finalPrice || 0,
        totalGuests,
        occupancyRate: totalRooms ? Math.min(100, (totalBookings / totalRooms) * 100) : 0,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getRevenue = async (_req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: { not: 'CANCELLED' } },
      select: { createdAt: true, finalPrice: true, paymentStatus: true },
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ success: true, message: 'Revenue data fetched', data: bookings });
  } catch (error) {
    return next(error);
  }
};

const getGuests = async (_req, res, next) => {
  try {
    const guests = await prisma.user.findMany({
      where: { role: 'GUEST' },
      include: { bookings: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, message: 'Guests fetched', data: guests });
  } catch (error) {
    return next(error);
  }
};

const getOccupancy = async (_req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({ include: { bookings: true } });
    const data = rooms.map((room) => ({
      roomId: room.id,
      roomName: room.name,
      occupied: room.bookings.some((booking) => booking.status !== 'CANCELLED'),
    }));

    return res.json({ success: true, message: 'Occupancy fetched', data });
  } catch (error) {
    return next(error);
  }
};

const getBookingCalendar = async (req, res, next) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date();
    const to = req.query.to
      ? new Date(req.query.to)
      : new Date(from.getTime() + 13 * 24 * 60 * 60 * 1000);

    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    const rooms = await prisma.room.findMany({
      include: {
        bookings: {
          where: {
            status: { not: 'CANCELLED' },
            checkIn: { lte: to },
            checkOut: { gte: from },
          },
          orderBy: { checkIn: 'asc' },
          select: {
            id: true,
            bookingCode: true,
            checkIn: true,
            checkOut: true,
            status: true,
            guestName: true,
            guestEmail: true,
            guestPhone: true,
            adults: true,
            children: true,
            finalPrice: true,
            roomsBooked: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const conflicts = [];
    for (const room of rooms) {
      for (let i = 0; i < room.bookings.length; i += 1) {
        const current = room.bookings[i];
        let concurrentUnits = current.roomsBooked || 1;

        for (let j = 0; j < room.bookings.length; j += 1) {
          if (i === j) continue;
          const other = room.bookings[j];
          const overlaps =
            new Date(current.checkIn) < new Date(other.checkOut) &&
            new Date(current.checkOut) > new Date(other.checkIn);
          if (overlaps) {
            concurrentUnits += other.roomsBooked || 1;
          }
        }

        if (concurrentUnits > (room.inventoryCount || 1)) {
          conflicts.push({
            roomId: room.id,
            roomName: room.name,
            bookingA: current.bookingCode,
            bookingB: 'Capacity exceeded',
          });
        }
      }
    }

    return res.json({
      success: true,
      message: 'Booking calendar fetched',
      data: {
        from,
        to,
        rooms,
        conflicts,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getStats, getRevenue, getGuests, getOccupancy, getBookingCalendar };
