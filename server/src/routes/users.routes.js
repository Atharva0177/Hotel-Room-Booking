const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { getProfile, updateProfile, changePassword, getMyBookings } = require('../controllers/users.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/change-password', changePassword);
router.get('/bookings', getMyBookings);

module.exports = router;
