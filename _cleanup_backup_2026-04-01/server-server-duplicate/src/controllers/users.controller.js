const bcrypt = require('bcrypt');
const { prisma } = require('../config/db');

const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      nationality: true,
      avatar: true,
      newsletter: true,
      role: true,
    },
  });

  return res.json({ success: true, message: 'Profile fetched', data: user });
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.update({ where: { id: req.user.id }, data: req.body });
    return res.json({ success: true, message: 'Profile updated', data: user });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Current password is invalid' });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hash } });

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    return next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { room: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, message: 'User bookings fetched', data: bookings });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword, getMyBookings };
