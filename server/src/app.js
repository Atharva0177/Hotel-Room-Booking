const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');

const errorHandler = require('./middlewares/errorHandler');
const { prisma } = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const roomsRoutes = require('./routes/rooms.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const usersRoutes = require('./routes/users.routes');
const paymentsRoutes = require('./routes/payments.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const adminRoutes = require('./routes/admin.routes');
const offersRoutes = require('./routes/offers.routes');
const siteSettingsRoutes = require('./routes/siteSettings.routes');
const amenitiesRoutes = require('./routes/amenities.routes');
const galleryRoutes = require('./routes/gallery.routes');
const aboutRoutes = require('./routes/about.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Aurelia backend is running',
    health: '/health',
    apiHealth: '/api/health',
  });
});

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Aurelia API is healthy' });
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Aurelia API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/amenities', amenitiesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/about', aboutRoutes);

app.post('/api/newsletter', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return res.json({ success: true, message: 'Subscribed to newsletter' });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    await prisma.contactMessage.create({ data: { name, email, subject, message } });
    return res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    return next(error);
  }
});

const swaggerDoc = {
  openapi: '3.0.0',
  info: { title: 'Aurelia Grand API', version: '1.0.0' },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
