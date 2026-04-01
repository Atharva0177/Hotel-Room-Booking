const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { getOffers, validateOffer, createOffer, updateOffer, deleteOffer } = require('../controllers/offers.controller');

const router = express.Router();

router.get('/', getOffers);
router.post('/validate', validateOffer);
router.post('/', authMiddleware, adminMiddleware, createOffer);
router.put('/:id', authMiddleware, adminMiddleware, updateOffer);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOffer);

module.exports = router;
