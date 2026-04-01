const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { createIntent, webhook } = require('../controllers/payments.controller');

const router = express.Router();

router.post('/create-intent', authMiddleware, createIntent);
router.post('/webhook', webhook);

module.exports = router;
