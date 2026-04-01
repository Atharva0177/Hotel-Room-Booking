const { prisma } = require('../config/db');

const getRooms = async (req, res, next) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      guests,
      amenities,
      sort = 'newest',
      checkIn,
      checkOut,
      page = 1,
      limit = 12,
    } = req.query;

    const where = {
      ...(type ? { type: { in: type.split(',') } } : {}),
      ...(minPrice || maxPrice
        ? {
            pricePerNight: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {}),
            },
          }
        : {}),
      ...(amenities ? { amenities: { hasEvery: amenities.split(',') } } : {}),
    };

    let bookingUnitsByRoomId = new Map();
    if (checkIn && checkOut) {
      const overlaps = await prisma.booking.findMany({
        where: {
          status: { not: 'CANCELLED' },
          checkIn: { lt: new Date(checkOut) },
          checkOut: { gt: new Date(checkIn) },
        },
        select: { roomId: true, roomsBooked: true },
      });
      bookingUnitsByRoomId = overlaps.reduce((acc, booking) => {
        const used = acc.get(booking.roomId) || 0;
        acc.set(booking.roomId, used + (booking.roomsBooked || 1));
        return acc;
      }, new Map());
    }

    const orderBy =
      sort === 'price_asc'
        ? { pricePerNight: 'asc' }
        : sort === 'price_desc'
          ? { pricePerNight: 'desc' }
          : { createdAt: 'desc' };

    const rooms = await prisma.room.findMany({ where, orderBy });

    const requestedGuests = guests ? Number(guests) : null;
    const filteredRooms = rooms.filter((room) => {
      const usedUnits = bookingUnitsByRoomId.get(room.id) || 0;
      const availableUnits = Math.max(0, room.inventoryCount - usedUnits);
      if (checkIn && checkOut && availableUnits < 1) return false;
      if (!requestedGuests) return true;
      return room.maxGuests * Math.max(1, availableUnits) >= requestedGuests;
    });

    const pageNumber = Number(page);
    const pageLimit = Number(limit);
    const paginatedRooms = filteredRooms.slice((pageNumber - 1) * pageLimit, pageNumber * pageLimit);

    return res.json({
      success: true,
      message: 'Rooms fetched',
      data: {
        rooms: paginatedRooms,
        pagination: { page: pageNumber, limit: pageLimit, total: filteredRooms.length },
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getRoomBySlug = async (req, res, next) => {
  try {
    const room = await prisma.room.findUnique({
      where: { slug: req.params.slug },
      include: {
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { firstName: true, lastName: true, nationality: true } } },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    return res.json({ success: true, message: 'Room fetched', data: room });
  } catch (error) {
    return next(error);
  }
};

const getRoomAvailability = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        roomId: req.params.id,
        status: { not: 'CANCELLED' },
      },
      select: { checkIn: true, checkOut: true },
    });

    return res.json({
      success: true,
      message: 'Availability fetched',
      data: bookings.map((item) => ({ start: item.checkIn, end: item.checkOut })),
    });
  } catch (error) {
    return next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    const { name, ...rest } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const room = await prisma.room.create({ data: { name, slug, ...rest } });
    return res.status(201).json({ success: true, message: 'Room created', data: room });
  } catch (error) {
    return next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const room = await prisma.room.update({ where: { id: req.params.id }, data: req.body });
    return res.json({ success: true, message: 'Room updated', data: room });
  } catch (error) {
    return next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    await prisma.room.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Room deleted' });
  } catch (error) {
    return next(error);
  }
};

const getRoomReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { roomId: req.params.id, isApproved: true },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, message: 'Reviews fetched', data: reviews });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getRooms,
  getRoomBySlug,
  getRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomReviews,
};
