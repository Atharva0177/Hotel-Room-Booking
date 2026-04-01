const { prisma } = require('../config/db');

const getOffers = async (_req, res, next) => {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
      orderBy: { discount: 'desc' },
    });

    return res.json({ success: true, message: 'Offers fetched', data: offers });
  } catch (error) {
    return next(error);
  }
};

const validateOffer = async (req, res, next) => {
  try {
    const { code, nights = 1 } = req.body;
    const offer = await prisma.offer.findFirst({
      where: {
        code,
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });

    if (!offer || nights < offer.minNights) {
      return res.status(400).json({ success: false, message: 'Invalid promo code' });
    }

    return res.json({ success: true, message: 'Promo code valid', data: offer });
  } catch (error) {
    return next(error);
  }
};

const createOffer = async (req, res, next) => {
  try {
    const offer = await prisma.offer.create({ data: req.body });
    return res.status(201).json({ success: true, message: 'Offer created', data: offer });
  } catch (error) {
    return next(error);
  }
};

const updateOffer = async (req, res, next) => {
  try {
    const offer = await prisma.offer.update({ where: { id: req.params.id }, data: req.body });
    return res.json({ success: true, message: 'Offer updated', data: offer });
  } catch (error) {
    return next(error);
  }
};

const deleteOffer = async (req, res, next) => {
  try {
    await prisma.offer.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Offer deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getOffers, validateOffer, createOffer, updateOffer, deleteOffer };
