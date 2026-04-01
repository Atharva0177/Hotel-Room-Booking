const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const validate = require('../middlewares/validate.middleware');
const { roomCreateSchema } = require('../schemas/room.schema');
const {
  getRooms,
  getRoomBySlug,
  getRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomReviews,
} = require('../controllers/rooms.controller');

const router = express.Router();

router.get('/', getRooms);
router.get('/:slug', getRoomBySlug);
router.get('/:id/availability', getRoomAvailability);
router.get('/:id/reviews', getRoomReviews);
router.post('/', authMiddleware, adminMiddleware, validate(roomCreateSchema), createRoom);
router.put('/:id', authMiddleware, adminMiddleware, updateRoom);
router.delete('/:id', authMiddleware, adminMiddleware, deleteRoom);

module.exports = router;
