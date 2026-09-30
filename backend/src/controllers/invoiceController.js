import prisma from '../prisma.js';

export const getInvoices = async (req, res) => {
  try {
    const { status, clientId } = req.query;
    const where = { userId: req.user.id };

    if (status) where.status = status.toUpperCase();
    if (clientId) where.clientId = clientId;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        client: true,
        items: true
      },
      orderBy: { issueDate: 'desc' }
    });

    res.json({ invoices });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoices', error: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: req.user.id },
      include: {
        client: true,
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            businessName: true,
            gstNumber: true,
            phone: true
          }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ invoice });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving invoice', error: err.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const {
      clientId,
      invoiceNumber,
      issueDate,
      dueDate,
      items = [],
      notes,
      paymentTerms
    } = req.body;

    if (!clientId || !items.length) {
      return res.status(400).json({ message: 'Client ID and at least one item are required.' });
    }

    // Auto-generate invoice number if not provided: e.g. INV-2026-001
    let invNum = invoiceNumber;
    if (!invNum) {
      const count = await prisma.invoice.count({ where: { userId: req.user.id } });
      const year = new Date().getFullYear();
      invNum = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
    }

    let subtotal = 0;
    let taxTotal = 0;

    const computedItems = items.map(item => {
      const qty = parseFloat(item.quantity) || 1;
      const price = parseFloat(item.unitPrice) || 0;
      const taxRate = parseFloat(item.taxRate) || 0;
      const baseAmount = qty * price;
      const taxAmount = (baseAmount * taxRate) / 100;

      subtotal += baseAmount;
      taxTotal += taxAmount;

      return {
        description: item.description,
        quantity: qty,
        unitPrice: price,
        taxRate,
        amount: baseAmount + taxAmount
      };
    });

    const total = subtotal + taxTotal;

    const invoice = await prisma.invoice.create({
      data: {
        userId: req.user.id,
        clientId,
        invoiceNumber: invNum,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 15 * 86400000), // 15 days default
        status: 'PENDING',
        subtotal,
        taxTotal,
        total,
        notes,
        paymentTerms: paymentTerms || 'Payment due within 15 days',
        items: {
          create: computedItems
        }
      },
      include: {
        client: true,
        items: true
      }
    });

    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (err) {
    console.error('Invoice creation error:', err);
    res.status(500).json({ message: 'Failed to create invoice', error: err.message });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, recordIncome = true } = req.body;

    const existing = await prisma.invoice.findFirst({
      where: { id, userId: req.user.id },
      include: { client: true }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: { status: status.toUpperCase() },
      include: { client: true, items: true }
    });

    // If status transitioned to PAID and recordIncome is requested, auto-record an income transaction!
    if (status.toUpperCase() === 'PAID' && recordIncome && existing.status !== 'PAID') {
      await prisma.transaction.create({
        data: {
          userId: req.user.id,
          type: 'INCOME',
          amount: existing.total,
          date: new Date(),
          description: `Payment for Invoice ${existing.invoiceNumber} (${existing.client.name})`,
          clientId: existing.clientId,
          paymentMethod: 'BANK_TRANSFER',
          status: 'COMPLETED',
          taxRate: existing.subtotal > 0 ? (existing.taxTotal / existing.subtotal) * 100 : 0,
          taxAmount: existing.taxTotal,
          notes: `Auto-generated from Invoice ${existing.invoiceNumber}`
        }
      });
    }

    res.json({ message: 'Invoice status updated', invoice: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update invoice status', error: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.invoice.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await prisma.invoice.delete({ where: { id } });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete invoice', error: err.message });
  }
};
