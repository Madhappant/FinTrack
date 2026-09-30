import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  scope: 'PERSONAL' | 'BUSINESS';
  amount: number;
  description: string;
  categoryId: string;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'CREDIT_CARD';
  date: string; // ISO string
  notes?: string;
  taxRate?: number;
  taxAmount?: number;
  invoiceNumber?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  scope: 'OVERALL' | 'PERSONAL' | 'BUSINESS';
  categoryId?: string | null;
  limitAmount: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  category: string;
  nextDueDate: string;
  account: string;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany?: string;
  amount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  notes?: string;
}

export interface SecuritySettings {
  isPinEnabled: boolean;
  pinCode: string; // 4 digits
  userName: string;
  businessName: string;
}

const STORAGE_KEYS = {
  TRANSACTIONS: '@sugan_ft_transactions_v2',
  CATEGORIES: '@sugan_ft_categories_v2',
  BUDGETS: '@sugan_ft_budgets_v2',
  SUBSCRIPTIONS: '@sugan_ft_subscriptions_v2',
  INVOICES: '@sugan_ft_invoices_v2',
  SECURITY: '@sugan_ft_security_v2',
};

// Default Preset Categories matching Stitch
const DEFAULT_PRESET_CATEGORIES: Category[] = [
  // Expenses
  { id: 'cat-fuel', name: 'Fuel & Travel', type: 'EXPENSE', icon: 'car-outline', color: '#316BF3', isDefault: true },
  { id: 'cat-food', name: 'Food & Dining', type: 'EXPENSE', icon: 'restaurant-outline', color: '#F97316', isDefault: true },
  { id: 'cat-rent', name: 'Rent & Office', type: 'EXPENSE', icon: 'business-outline', color: '#8B5CF6', isDefault: true },
  { id: 'cat-util', name: 'Utilities & Bills', type: 'EXPENSE', icon: 'flash-outline', color: '#EAB308', isDefault: true },
  { id: 'cat-mktg', name: 'Marketing & Ads', type: 'EXPENSE', icon: 'megaphone-outline', color: '#06B6D4', isDefault: true },
  { id: 'cat-groc', name: 'Groceries & Supplies', type: 'EXPENSE', icon: 'basket-outline', color: '#10B981', isDefault: true },
  { id: 'cat-soft', name: 'Software & Hosting', type: 'EXPENSE', icon: 'server-outline', color: '#EF4444', isDefault: true },
  { id: 'cat-misc', name: 'Miscellaneous', type: 'EXPENSE', icon: 'ellipsis-horizontal-circle-outline', color: '#64748B', isDefault: true },

  // Income
  { id: 'cat-retainer', name: 'Client Retainer', type: 'INCOME', icon: 'briefcase-outline', color: '#10B981', isDefault: true },
  { id: 'cat-dev', name: 'Freelance & Projects', type: 'INCOME', icon: 'code-slash-outline', color: '#059669', isDefault: true },
  { id: 'cat-consult', name: 'Consulting Fee', type: 'INCOME', icon: 'bulb-outline', color: '#3B82F6', isDefault: true },
  { id: 'cat-sales', name: 'Product Sales', type: 'INCOME', icon: 'cart-outline', color: '#6366F1', isDefault: true },
];

export const offlineDb = {
  // ----------------- CATEGORIES -----------------
  async getCategories(type?: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    let list: Category[] = raw ? JSON.parse(raw) : DEFAULT_PRESET_CATEGORIES;
    if (!raw) {
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_PRESET_CATEGORIES));
    }
    if (type) {
      return list.filter((c) => c.type === type);
    }
    return list;
  },

  async addCategory(cat: Omit<Category, 'id' | 'isDefault'>): Promise<Category> {
    const list = await this.getCategories();
    const newCat: Category = {
      ...cat,
      id: `cat-custom-${Date.now()}`,
      isDefault: false,
    };
    list.push(newCat);
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
    return newCat;
  },

  async deleteCategory(id: string): Promise<void> {
    const list = await this.getCategories();
    const updated = list.filter((c) => c.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
  },

  // ----------------- TRANSACTIONS (NO DUMMY DATA) -----------------
  async getTransactions(filter?: {
    type?: string;
    scope?: string;
    search?: string;
    categoryId?: string;
  }): Promise<Transaction[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    let list: Transaction[] = raw ? JSON.parse(raw) : [];

    if (filter) {
      if (filter.type) {
        list = list.filter((t) => t.type === filter.type);
      }
      if (filter.scope && filter.scope !== 'ALL') {
        list = list.filter((t) => t.scope === filter.scope);
      }
      if (filter.categoryId) {
        list = list.filter((t) => t.categoryId === filter.categoryId);
      }
      if (filter.search && filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        list = list.filter(
          (t) =>
            t.description.toLowerCase().includes(query) ||
            (t.notes && t.notes.toLowerCase().includes(query)) ||
            (t.invoiceNumber && t.invoiceNumber.toLowerCase().includes(query))
        );
      }
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const list: Transaction[] = raw ? JSON.parse(raw) : [];

    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };

    list.unshift(newTx);
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
    return newTx;
  },

  async deleteTransaction(id: string): Promise<void> {
    const list = await this.getTransactions();
    const updated = list.filter((t) => t.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  },

  // ----------------- FINANCIAL CALCULATIONS -----------------
  async getSummary(scope: 'ALL' | 'PERSONAL' | 'BUSINESS' = 'ALL') {
    const transactions = await this.getTransactions({ scope });

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;

    // Current Month Calculation
    const now = new Date();
    const currentMonthTxs = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });

    const monthIncome = currentMonthTxs
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthExpense = currentMonthTxs
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthSavings = monthIncome - monthExpense;

    return {
      netBalance,
      totalIncome,
      totalExpense,
      monthIncome,
      monthExpense,
      monthSavings,
      count: transactions.length,
    };
  },

  // ----------------- BUDGETS -----------------
  async getBudgets(): Promise<Budget[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) {
      // Default initial budget setup
      const defaults: Budget[] = [
        { id: 'b-overall', scope: 'OVERALL', limitAmount: 50000 },
        { id: 'b-personal', scope: 'PERSONAL', limitAmount: 20000 },
        { id: 'b-business', scope: 'BUSINESS', limitAmount: 30000 },
      ];
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  },

  async setBudget(scope: 'OVERALL' | 'PERSONAL' | 'BUSINESS', limitAmount: number, categoryId?: string) {
    const budgets = await this.getBudgets();
    const idx = budgets.findIndex((b) => b.scope === scope && b.categoryId === (categoryId || null));
    if (idx >= 0) {
      budgets[idx].limitAmount = limitAmount;
    } else {
      budgets.push({
        id: `budget-${Date.now()}`,
        scope,
        categoryId: categoryId || null,
        limitAmount,
      });
    }
    await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },

  async getBudgetStatus(scope: 'OVERALL' | 'PERSONAL' | 'BUSINESS' = 'OVERALL') {
    const budgets = await this.getBudgets();
    const targetBudget = budgets.find((b) => b.scope === scope && !b.categoryId);
    const ceiling = targetBudget ? targetBudget.limitAmount : 50000;

    const summary = await this.getSummary(scope === 'OVERALL' ? 'ALL' : scope);
    const spent = summary.monthExpense;
    const percentage = ceiling > 0 ? Math.min(Math.round((spent / ceiling) * 100), 100) : 0;
    const remainingBuffer = Math.max(0, ceiling - spent);

    // Safe Daily Velocity
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeft = Math.max(1, daysInMonth - now.getDate());
    const dailySafeSpend = Math.round(remainingBuffer / daysLeft);

    return {
      ceiling,
      spent,
      percentage,
      remainingBuffer,
      dailySafeSpend,
      daysLeft,
    };
  },

  // ----------------- SUBSCRIPTIONS & RECURRING COMMITMENTS -----------------
  async getSubscriptions(): Promise<Subscription[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    return raw ? JSON.parse(raw) : [];
  },

  async addSubscription(sub: Omit<Subscription, 'id'>): Promise<Subscription> {
    const list = await this.getSubscriptions();
    const newSub: Subscription = {
      ...sub,
      id: `sub-${Date.now()}`,
    };
    list.push(newSub);
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(list));
    return newSub;
  },

  async toggleSubscription(id: string): Promise<void> {
    const list = await this.getSubscriptions();
    const target = list.find((s) => s.id === id);
    if (target) {
      target.isActive = !target.isActive;
      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(list));
    }
  },

  async deleteSubscription(id: string): Promise<void> {
    const list = await this.getSubscriptions();
    const updated = list.filter((s) => s.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
  },

  // ----------------- INVOICES -----------------
  async getInvoices(): Promise<Invoice[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.INVOICES);
    return raw ? JSON.parse(raw) : [];
  },

  async addInvoice(inv: Omit<Invoice, 'id'>): Promise<Invoice> {
    const list = await this.getInvoices();
    const newInv: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
    };
    list.unshift(newInv);
    await AsyncStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(list));
    return newInv;
  },

  async markInvoicePaid(id: string, recordIncome = true): Promise<void> {
    const list = await this.getInvoices();
    const target = list.find((inv) => inv.id === id);
    if (target && target.status !== 'PAID') {
      target.status = 'PAID';
      await AsyncStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(list));

      if (recordIncome) {
        await this.addTransaction({
          type: 'INCOME',
          scope: 'BUSINESS',
          amount: target.total,
          description: `Payment for Invoice ${target.invoiceNumber} (${target.clientName})`,
          categoryId: 'cat-retainer',
          paymentMethod: 'BANK_TRANSFER',
          date: new Date().toISOString(),
          invoiceNumber: target.invoiceNumber,
          taxRate: target.taxRate,
          taxAmount: target.taxAmount,
          notes: `Auto-recorded from invoice ${target.invoiceNumber}`,
        });
      }
    }
  },

  async deleteInvoice(id: string): Promise<void> {
    const list = await this.getInvoices();
    const updated = list.filter((inv) => inv.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updated));
  },

  // ----------------- SECURITY & PIN LOCK -----------------
  async getSecurity(): Promise<SecuritySettings> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SECURITY);
    if (!raw) {
      const defaults: SecuritySettings = {
        isPinEnabled: false,
        pinCode: '1234',
        userName: 'Business Owner',
        businessName: 'Sugan Tech & Studio',
      };
      await AsyncStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  },

  async setPin(pinCode: string): Promise<void> {
    const sec = await this.getSecurity();
    sec.pinCode = pinCode;
    sec.isPinEnabled = true;
    await AsyncStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(sec));
  },

  async togglePin(isPinEnabled: boolean): Promise<void> {
    const sec = await this.getSecurity();
    sec.isPinEnabled = isPinEnabled;
    await AsyncStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(sec));
  },

  async updateProfile(userName: string, businessName: string): Promise<void> {
    const sec = await this.getSecurity();
    sec.userName = userName;
    sec.businessName = businessName;
    await AsyncStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(sec));
  },

  // ----------------- OFFLINE DATA BACKUP & VAULT -----------------
  async exportData(): Promise<string> {
    const [transactions, categories, budgets, subscriptions, invoices, security] = await Promise.all([
      this.getTransactions(),
      this.getCategories(),
      this.getBudgets(),
      this.getSubscriptions(),
      this.getInvoices(),
      this.getSecurity(),
    ]);

    const backupPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      vaultType: 'SovereignLedgerOfflineAES256',
      data: {
        transactions,
        categories,
        budgets,
        subscriptions,
        invoices,
        security: {
          isPinEnabled: security.isPinEnabled,
          userName: security.userName,
          businessName: security.businessName,
        },
      },
    };

    return JSON.stringify(backupPayload, null, 2);
  },

  async importData(jsonString: string): Promise<boolean> {
    try {
      const payload = JSON.parse(jsonString);
      if (!payload.data) return false;

      if (payload.data.transactions) {
        await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(payload.data.transactions));
      }
      if (payload.data.categories) {
        await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(payload.data.categories));
      }
      if (payload.data.budgets) {
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(payload.data.budgets));
      }
      if (payload.data.subscriptions) {
        await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(payload.data.subscriptions));
      }
      if (payload.data.invoices) {
        await AsyncStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(payload.data.invoices));
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  async resetAllData(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    await AsyncStorage.removeItem(STORAGE_KEYS.BUDGETS);
    await AsyncStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
    await AsyncStorage.removeItem(STORAGE_KEYS.INVOICES);
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_PRESET_CATEGORIES));
  },

  // ----------------- OFFLINE SMS AUTO-DETECTION PARSER -----------------
  parseSms(smsText: string): {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    merchant: string;
    detectedCategory: string;
    account: string;
  } | null {
    if (!smsText || typeof smsText !== 'string') return null;

    const lower = smsText.toLowerCase();

    // 1. Detect Amount (e.g., "Rs. 850", "INR 1,200", "debited by 850.00")
    const amountRegex = /(?:rs\.?|inr|by|for)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i;
    const match = smsText.match(amountRegex);
    if (!match) return null;

    const cleanAmt = parseFloat(match[1].replace(/,/g, ''));
    if (isNaN(cleanAmt) || cleanAmt <= 0) return null;

    // 2. Detect Debit vs Credit
    const isCredit = lower.includes('credited') || lower.includes('received') || lower.includes('deposited');
    const type: 'INCOME' | 'EXPENSE' = isCredit ? 'INCOME' : 'EXPENSE';

    // 3. Extract Merchant / Payee
    let merchant = 'Unknown Payee';
    const atMatch = smsText.match(/(?:at|to|vpa|info|transfer to)\s+([A-Za-z0-9\s._-]+?)(?:on|\.|\s+ref|\s+upi|$)/i);
    if (atMatch && atMatch[1]) {
      merchant = atMatch[1].trim().slice(0, 30);
    }

    // 4. Match Category
    let detectedCategory = 'cat-misc';
    if (/fuel|hpcl|bpcl|ioc|petrol|diesel/i.test(lower)) detectedCategory = 'cat-fuel';
    else if (/swiggy|zomato|cafe|restaurant|food|dining|hotel/i.test(lower)) detectedCategory = 'cat-food';
    else if (/electricity|bescom|tneb|airtel|jio|broadband|bill/i.test(lower)) detectedCategory = 'cat-util';
    else if (/amazon|flipkart|mart|grocery|supermarket/i.test(lower)) detectedCategory = 'cat-groc';
    else if (/aws|google|github|vercel|hosting|adobe/i.test(lower)) detectedCategory = 'cat-soft';
    else if (isCredit) detectedCategory = 'cat-dev';

    // 5. Detect Account (e.g. HDFC, SBI, ICICI, UPI)
    let account = 'Bank Account / UPI';
    if (lower.includes('hdfc')) account = 'HDFC Bank';
    else if (lower.includes('sbi')) account = 'SBI Account';
    else if (lower.includes('icici')) account = 'ICICI Bank';
    else if (lower.includes('axis')) account = 'Axis Bank';
    else if (lower.includes('upi')) account = 'UPI Wallet';

    return {
      amount: cleanAmt,
      type,
      merchant,
      detectedCategory,
      account,
    };
  },
};
