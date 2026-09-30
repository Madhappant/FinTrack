import prisma from '../prisma.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Start of previous month
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Fetch transactions
    const [allTransactions, currentMonthTransactions, prevMonthTransactions, pendingInvoices] = await Promise.all([
      prisma.transaction.findMany({ where: { userId } }),
      prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: startOfMonth, lte: endOfMonth }
        }
      }),
      prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: startOfPrevMonth, lte: endOfPrevMonth }
        }
      }),
      prisma.invoice.findMany({
        where: {
          userId,
          status: { in: ['PENDING', 'OVERDUE'] }
        }
      })
    ]);

    // All-time totals
    const totalIncome = allTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = allTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpense;

    // Current month totals
    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentMonthExpense = currentMonthTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentMonthNet = currentMonthIncome - currentMonthExpense;

    // Previous month totals
    const prevMonthIncome = prevMonthTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevMonthExpense = prevMonthTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    // Outstanding invoices
    const totalReceivables = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);

    // Recent 5 transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
        client: { select: { name: true } },
        vendor: { select: { name: true } }
      },
      orderBy: { date: 'desc' },
      take: 5
    });

    res.json({
      summary: {
        totalIncome,
        totalExpense,
        netProfit,
        currentMonth: {
          income: currentMonthIncome,
          expense: currentMonthExpense,
          net: currentMonthNet
        },
        prevMonth: {
          income: prevMonthIncome,
          expense: prevMonthExpense
        },
        receivables: {
          total: totalReceivables,
          count: pendingInvoices.length
        }
      },
      recentTransactions
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ message: 'Failed to generate dashboard summary', error: err.message });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    const count = parseInt(months);
    const result = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const year = now.getFullYear();
      const month = now.getMonth() - i;
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const monthName = startDate.toLocaleString('default', { month: 'short', year: '2-digit' });

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: startDate, lte: endDate }
        }
      });

      const income = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
      const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

      result.push({
        month: monthName,
        income,
        expense,
        profit: income - expense
      });
    }

    res.json({ trends: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute monthly trends', error: err.message });
  }
};

export const getExpenseByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const where = {
      userId,
      type: 'EXPENSE'
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const expenses = await prisma.transaction.findMany({
      where,
      include: { category: true }
    });

    const categoryMap = {};
    let totalExpense = 0;

    expenses.forEach(tx => {
      const catName = tx.category ? tx.category.name : 'Uncategorized';
      const catColor = tx.category ? tx.category.color : '#94A3B8';

      if (!categoryMap[catName]) {
        categoryMap[catName] = {
          name: catName,
          color: catColor,
          amount: 0,
          count: 0
        };
      }
      categoryMap[catName].amount += tx.amount;
      categoryMap[catName].count += 1;
      totalExpense += tx.amount;
    });

    const breakdown = Object.values(categoryMap).map(cat => ({
      ...cat,
      percentage: totalExpense > 0 ? parseFloat(((cat.amount / totalExpense) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.amount - a.amount);

    res.json({ totalExpense, breakdown });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating category breakdown', error: err.message });
  }
};

export const getTaxReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year = new Date().getFullYear() } = req.query;

    const startOfYear = new Date(parseInt(year), 0, 1);
    const endOfYear = new Date(parseInt(year), 11, 31, 23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startOfYear, lte: endOfYear }
      }
    });

    const incomeTxs = transactions.filter(t => t.type === 'INCOME');
    const expenseTxs = transactions.filter(t => t.type === 'EXPENSE');

    const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amount, 0);

    // Tax collected on Income (Output Tax / GST)
    const taxCollected = incomeTxs.reduce((sum, t) => sum + t.taxAmount, 0);

    // Tax paid on Expenses (Input Tax Credit / ITC)
    const taxPaid = expenseTxs.reduce((sum, t) => sum + t.taxAmount, 0);

    // Net Tax Liability
    const netTaxPayable = Math.max(0, taxCollected - taxPaid);

    res.json({
      year: parseInt(year),
      totalRevenue: totalIncome,
      deductibleExpenses: totalExpense,
      taxableProfit: Math.max(0, totalIncome - totalExpense),
      taxCollected,
      taxPaid,
      netTaxPayable
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating tax report', error: err.message });
  }
};
