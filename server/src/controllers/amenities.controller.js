const { prisma } = require('../config/db');

const getAll = async (req, res) => {
  try {
    const amenities = await prisma.amenity.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: amenities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const amenities = await prisma.amenity.findMany({
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: amenities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, hours, imageUrl, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const amenity = await prisma.amenity.create({
      data: {
        title,
        description,
        hours: hours || '',
        imageUrl: imageUrl || null,
        order: order || 0,
      },
    });

    res.status(201).json({ success: true, data: amenity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, hours, imageUrl, order, isActive } = req.body;

    const amenity = await prisma.amenity.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(hours !== undefined && { hours }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ success: true, data: amenity });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Amenity not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.amenity.delete({ where: { id } });
    res.json({ success: true, message: 'Amenity deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Amenity not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getAllAdmin,
  create,
  update,
  delete: deleteAmenity,
};
