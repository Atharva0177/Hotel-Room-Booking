const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { getAll, getAllAdmin, create, update, delete: deleteImage, getCategories } = require('../controllers/gallery.controller');

const router = express.Router();

// Public routes
router.get('/', getAll);
router.get('/categories', getCategories);

// Admin routes
router.use(authMiddleware, adminMiddleware);
router.get('/admin/all', getAllAdmin);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteImage);

module.exports = router;
