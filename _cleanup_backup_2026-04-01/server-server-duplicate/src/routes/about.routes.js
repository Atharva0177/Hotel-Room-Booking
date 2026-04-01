const express = require('express');
const { getAbout, updateAbout } = require('../controllers/about.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

// Public: Get About page content
router.get('/', getAbout);

// Admin only: Update About page content
router.put('/', authMiddleware, adminMiddleware, updateAbout);

module.exports = router;
