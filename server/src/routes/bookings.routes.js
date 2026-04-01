const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const validate = require('../middlewares/validate.middleware');
const { bookingCreateSchema } = require('../schemas/booking.schema');
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  hardDeleteBooking,
  getInvoice,
} = require('../controllers/bookings.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/', validate(bookingCreateSchema), createBooking);
router.patch('/:id/status', adminMiddleware, updateBookingStatus);
router.delete('/:id', cancelBooking);
router.delete('/:id/hard', adminMiddleware, hardDeleteBooking);
router.get('/:id/invoice', getInvoice);

module.exports = router;
