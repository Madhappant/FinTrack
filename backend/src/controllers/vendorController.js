import prisma from '../prisma.js';

export const getVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: { transactions: true }
        },
        transactions: {
          where: { type: 'EXPENSE' },
          select: { amount: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const vendorsWithStats = vendors.map(vendor => {
      const totalPaid = vendor.transactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        ...vendor,
        totalPaid
      };
    });

    res.json({ vendors: vendorsWithStats });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vendors', error: err.message });
  }
};

export const createVendor = async (req, res) => {
  try {
    const { name, email, phone, company, serviceType, notes } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Vendor name is required' });
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId: req.user.id,
        name,
        email,
        phone,
        company,
        serviceType,
        notes
      }
    });

    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create vendor', error: err.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, serviceType, notes } = req.body;

    const existing = await prisma.vendor.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { name, email, phone, company, serviceType, notes }
    });

    res.json({ message: 'Vendor updated successfully', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update vendor', error: err.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.vendor.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    await prisma.vendor.delete({ where: { id } });
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete vendor', error: err.message });
  }
};
