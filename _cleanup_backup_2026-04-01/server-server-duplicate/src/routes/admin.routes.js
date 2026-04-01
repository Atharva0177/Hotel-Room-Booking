const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { getStats, getRevenue, getGuests, getOccupancy, getBookingCalendar } = require('../controllers/admin.controller');
const { getSiteSettings, updateSiteSettings } = require('../controllers/siteSettings.controller');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);
router.get('/stats', getStats);
router.get('/revenue', getRevenue);
router.get('/guests', getGuests);
router.get('/occupancy', getOccupancy);
router.get('/booking-calendar', getBookingCalendar);
router.get('/site-settings', getSiteSettings);
router.put('/site-settings', updateSiteSettings);

module.exports = router;
