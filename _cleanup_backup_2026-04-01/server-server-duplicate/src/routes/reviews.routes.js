const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { createReview, getAllReviews, approveReview, deleteReview } = require('../controllers/reviews.controller');

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/', authMiddleware, adminMiddleware, getAllReviews);
router.patch('/:id/approve', authMiddleware, adminMiddleware, approveReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
