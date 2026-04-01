const { prisma } = require('../config/db');

const getAll = async (req, res) => {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    // Group by category
    const grouped = {};
    images.forEach((img) => {
      if (!grouped[img.category]) {
        grouped[img.category] = [];
      }
      grouped[img.category].push(img);
    });

    res.json({ success: true, data: grouped });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    // Group by category
    const grouped = {};
    images.forEach((img) => {
      if (!grouped[img.category]) {
        grouped[img.category] = [];
      }
      grouped[img.category].push(img);
    });

    res.json({ success: true, data: grouped });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { category, imageUrl, title, order } = req.body;

    if (!category || !imageUrl) {
      return res.status(400).json({ error: 'Category and imageUrl are required' });
    }

    const image = await prisma.galleryImage.create({
      data: {
        category,
        imageUrl,
        title: title || null,
        order: order || 0,
      },
    });

    res.status(201).json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, imageUrl, title, order, isActive } = req.body;

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(category !== undefined && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(title !== undefined && { title }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ success: true, data: image });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gallery image not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.galleryImage.delete({ where: { id } });
    res.json({ success: true, message: 'Gallery image deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gallery image not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.galleryImage.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    const categoryList = categories.map((c) => c.category);
    res.json({ success: true, data: categoryList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getAllAdmin,
  create,
  update,
  delete: deleteImage,
  getCategories,
};
