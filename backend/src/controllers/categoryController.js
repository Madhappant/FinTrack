import prisma from '../prisma.js';

export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const where = {
      OR: [
        { userId: req.user.id },
        { isDefault: true }
      ]
    };

    if (type) {
      where.type = type.toUpperCase();
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, type, color = '#3B82F6', icon = 'tag' } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type (INCOME/EXPENSE) are required.' });
    }

    const category = await prisma.category.create({
      data: {
        userId: req.user.id,
        name,
        type: type.toUpperCase(),
        color,
        icon,
        isDefault: false
      }
    });

    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Category not found or cannot delete default categories.' });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
};
