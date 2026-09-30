import prisma from '../prisma.js';

export const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: { transactions: true, invoices: true }
        },
        transactions: {
          where: { type: 'INCOME' },
          select: { amount: true }
        },
        invoices: {
          select: { total: true, status: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const clientsWithStats = clients.map(client => {
      const totalEarned = client.transactions.reduce((sum, t) => sum + t.amount, 0);
      const pendingInvoices = client.invoices
        .filter(inv => inv.status === 'PENDING' || inv.status === 'OVERDUE')
        .reduce((sum, inv) => sum + inv.total, 0);

      return {
        ...client,
        totalEarned,
        pendingAmount: pendingInvoices
      };
    });

    res.json({ clients: clientsWithStats });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching clients', error: err.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, address, gstNumber, notes } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Client name is required' });
    }

    const client = await prisma.client.create({
      data: {
        userId: req.user.id,
        name,
        email,
        phone,
        company,
        address,
        gstNumber,
        notes
      }
    });

    res.status(201).json({ message: 'Client created successfully', client });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create client', error: err.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, address, gstNumber, notes } = req.body;

    const existing = await prisma.client.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const client = await prisma.client.update({
      where: { id },
      data: { name, email, phone, company, address, gstNumber, notes }
    });

    res.json({ message: 'Client updated successfully', client });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update client', error: err.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.client.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await prisma.client.delete({ where: { id } });
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete client', error: err.message });
  }
};
