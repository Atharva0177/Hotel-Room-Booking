const express = require('express');
const rateLimit = require('express-rate-limit');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');
const {
  register,
  login,
  logout,
  refresh,
  me,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const router = express.Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true });

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh-token', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, me);

module.exports = router;
