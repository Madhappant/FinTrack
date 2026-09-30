import prisma from '../prisma.js';

export const getTransactions = async (req, res) => {
  try {
    const { type, categoryId, clientId, vendorId, startDate, endDate, search, limit = 50, page = 1 } = req.query;

    const where = {
      userId: req.user.id
    };

    if (type) {
      where.type = type.toUpperCase();
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { description: { contains: search } },
        { notes: { contains: search } }
      ];
    }

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: true,
          client: { select: { id: true, name: true, company: true } },
          vendor: { select: { id: true, name: true, company: true } }
        },
        orderBy: { date: 'desc' },
        skip,
        take
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(totalCount / take)
      }
    });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id },
      include: {
        category: true,
        client: true,
        vendor: true
      }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving transaction', error: err.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      date,
      description,
      categoryId,
      clientId,
      vendorId,
      paymentMethod = 'UPI',
      status = 'COMPLETED',
      taxRate = 0,
      notes,
      receiptUrl
    } = req.body;

    if (!type || amount === undefined || !description) {
      return res.status(400).json({ message: 'Type, amount, and description are required.' });
    }

    const parsedAmount = parseFloat(amount);
    const parsedTaxRate = parseFloat(taxRate) || 0;
    const taxAmount = (parsedAmount * parsedTaxRate) / 100;

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: type.toUpperCase(),
        amount: parsedAmount,
        date: date ? new Date(date) : new Date(),
        description,
        categoryId: categoryId || null,
        clientId: clientId || null,
        vendorId: vendorId || null,
        paymentMethod,
        status,
        taxRate: parsedTaxRate,
        taxAmount,
        notes,
        receiptUrl
      },
      include: {
        category: true,
        client: true,
        vendor: true
      }
    });

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ message: 'Failed to create transaction', error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const {
      type,
      amount,
      date,
      description,
      categoryId,
      clientId,
      vendorId,
      paymentMethod,
      status,
      taxRate,
      notes,
      receiptUrl
    } = req.body;

    const parsedAmount = amount !== undefined ? parseFloat(amount) : existing.amount;
    const parsedTaxRate = taxRate !== undefined ? parseFloat(taxRate) : existing.taxRate;
    const taxAmount = (parsedAmount * parsedTaxRate) / 100;

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        type: type ? type.toUpperCase() : existing.type,
        amount: parsedAmount,
        date: date ? new Date(date) : existing.date,
        description: description !== undefined ? description : existing.description,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        clientId: clientId !== undefined ? clientId : existing.clientId,
        vendorId: vendorId !== undefined ? vendorId : existing.vendorId,
        paymentMethod: paymentMethod || existing.paymentMethod,
        status: status || existing.status,
        taxRate: parsedTaxRate,
        taxAmount,
        notes: notes !== undefined ? notes : existing.notes,
        receiptUrl: receiptUrl !== undefined ? receiptUrl : existing.receiptUrl
      },
      include: {
        category: true,
        client: true,
        vendor: true
      }
    });

    res.json({ message: 'Transaction updated successfully', transaction: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update transaction', error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete transaction', error: err.message });
  }
};
