const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { getAll, getAllAdmin, create, update, delete: deleteAmenity } = require('../controllers/amenities.controller');

const router = express.Router();

// Public routes
router.get('/', getAll);

// Admin routes
router.use(authMiddleware, adminMiddleware);
router.get('/admin/all', getAllAdmin);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteAmenity);

module.exports = router;
