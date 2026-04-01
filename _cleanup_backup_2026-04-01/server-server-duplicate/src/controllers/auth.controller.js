const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

const persistRefreshToken = async ({ userId, expiresAt, maxAttempts = 3 }) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const token = signRefreshToken({ id: userId });
    try {
      await prisma.refreshToken.create({
        data: { token, userId, expiresAt },
      });
      return token;
    } catch (error) {
      const isUniqueCollision = error?.code === 'P2002';
      if (!isUniqueCollision || attempt === maxAttempts) throw error;
    }
  }

  throw new Error('Unable to generate refresh token');
};

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword, phone },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const refreshToken = await persistRefreshToken({ userId: user.id, expiresAt: refreshExpiresAt });

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshDuration = rememberMe ? 30 : 7;
    const refreshExpiresAt = new Date(Date.now() + refreshDuration * 24 * 60 * 60 * 1000);
    const refreshToken = await persistRefreshToken({ userId: user.id, expiresAt: refreshExpiresAt });

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: refreshDuration * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

    return res.json({ success: true, message: 'Token refreshed', data: { accessToken } });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) =>
  res.json({
    success: true,
    message: 'Current user fetched',
    data: {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      nationality: req.user.nationality,
      avatar: req.user.avatar,
    },
  });

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ success: true, message: 'If this email exists, a reset link has been sent' });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    return res.json({
      success: true,
      message: 'Reset link generated (mail transport can be wired in env setup)',
      data: { resetUrl: `${process.env.CLIENT_URL}/reset-password?token=${resetToken}` },
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const hash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: payload.id }, data: { password: hash } });
    return res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  me,
  forgotPassword,
  resetPassword,
};
