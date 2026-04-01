const { prisma } = require('../config/db');

const createReview = async (req, res, next) => {
  try {
    const { bookingId, roomId, rating, title, comment } = req.body;

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        roomId,
        userId: req.user.id,
        status: 'CHECKED_OUT',
      },
    });

    if (!booking) {
      return res.status(400).json({ success: false, message: 'Review requires a completed booking' });
    }

    const review = await prisma.review.create({
      data: { bookingId, userId: req.user.id, roomId, rating, title, comment },
    });

    return res.status(201).json({ success: true, message: 'Review submitted for approval', data: review });
  } catch (error) {
    return next(error);
  }
};

const getAllReviews = async (_req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({ include: { user: true, room: true } });
    return res.json({ success: true, message: 'Reviews fetched', data: reviews });
  } catch (error) {
    return next(error);
  }
};

const approveReview = async (req, res, next) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved: true },
    });
    return res.json({ success: true, message: 'Review approved', data: review });
  } catch (error) {
    return next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (req.user.role !== 'ADMIN' && req.user.id !== review.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await prisma.review.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createReview, getAllReviews, approveReview, deleteReview };
