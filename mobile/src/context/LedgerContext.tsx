import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  offlineDb,
  Transaction,
  Category,
  Budget,
  Subscription,
  Invoice,
} from '../services/offlineDb';

interface LedgerContextType {
  scope: 'ALL' | 'PERSONAL' | 'BUSINESS';
  setScope: (scope: 'ALL' | 'PERSONAL' | 'BUSINESS') => void;
  isBalanceHidden: boolean;
  toggleBalanceVisibility: () => void;
  transactions: Transaction[];
  categories: Category[];
  summary: {
    netBalance: number;
    totalIncome: number;
    totalExpense: number;
    monthIncome: number;
    monthExpense: number;
    monthSavings: number;
    count: number;
  };
  budgetStatus: {
    ceiling: number;
    spent: number;
    percentage: number;
    remainingBuffer: number;
    dailySafeSpend: number;
    daysLeft: number;
  };
  subscriptions: Subscription[];
  invoices: Invoice[];
  isLoading: boolean;
  refreshLedger: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (cat: Omit<Category, 'id' | 'isDefault'>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  setMonthlyCeiling: (limitAmount: number) => Promise<void>;
  addSubscription: (sub: Omit<Subscription, 'id'>) => Promise<Subscription>;
  toggleSubscription: (id: string) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  addInvoice: (inv: Omit<Invoice, 'id'>) => Promise<Invoice>;
  markInvoicePaid: (id: string) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  resetVault: () => Promise<void>;
}

const LedgerContext = createContext<LedgerContextType>({} as LedgerContextType);

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scope, setScope] = useState<'ALL' | 'PERSONAL' | 'BUSINESS'>('ALL');
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [summary, setSummary] = useState({
    netBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    monthIncome: 0,
    monthExpense: 0,
    monthSavings: 0,
    count: 0,
  });

  const [budgetStatus, setBudgetStatus] = useState({
    ceiling: 50000,
    spent: 0,
    percentage: 0,
    remainingBuffer: 50000,
    dailySafeSpend: 1667,
    daysLeft: 30,
  });

  const refreshLedger = useCallback(async () => {
    try {
      const [txList, catList, sumData, budData, subList, invList] = await Promise.all([
        offlineDb.getTransactions({ scope }),
        offlineDb.getCategories(),
        offlineDb.getSummary(scope),
        offlineDb.getBudgetStatus(scope === 'ALL' ? 'OVERALL' : scope),
        offlineDb.getSubscriptions(),
        offlineDb.getInvoices(),
      ]);

      setTransactions(txList);
      setCategories(catList);
      setSummary(sumData);
      setBudgetStatus(budData);
      setSubscriptions(subList);
      setInvoices(invList);
    } catch (err) {
      console.warn('Failed to refresh offline ledger', err);
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    refreshLedger();
  }, [refreshLedger]);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => !prev);
  };

  const handleAddTransaction = async (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const created = await offlineDb.addTransaction(tx);
    await refreshLedger();
    return created;
  };

  const handleDeleteTransaction = async (id: string) => {
    await offlineDb.deleteTransaction(id);
    await refreshLedger();
  };

  const handleAddCategory = async (cat: Omit<Category, 'id' | 'isDefault'>) => {
    const created = await offlineDb.addCategory(cat);
    await refreshLedger();
    return created;
  };

  const handleDeleteCategory = async (id: string) => {
    await offlineDb.deleteCategory(id);
    await refreshLedger();
  };

  const handleSetMonthlyCeiling = async (limitAmount: number) => {
    await offlineDb.setBudget(scope === 'ALL' ? 'OVERALL' : scope, limitAmount);
    await refreshLedger();
  };

  const handleAddSubscription = async (sub: Omit<Subscription, 'id'>) => {
    const created = await offlineDb.addSubscription(sub);
    await refreshLedger();
    return created;
  };

  const handleToggleSubscription = async (id: string) => {
    await offlineDb.toggleSubscription(id);
    await refreshLedger();
  };

  const handleDeleteSubscription = async (id: string) => {
    await offlineDb.deleteSubscription(id);
    await refreshLedger();
  };

  const handleAddInvoice = async (inv: Omit<Invoice, 'id'>) => {
    const created = await offlineDb.addInvoice(inv);
    await refreshLedger();
    return created;
  };

  const handleMarkInvoicePaid = async (id: string) => {
    await offlineDb.markInvoicePaid(id, true);
    await refreshLedger();
  };

  const handleDeleteInvoice = async (id: string) => {
    await offlineDb.deleteInvoice(id);
    await refreshLedger();
  };

  const handleResetVault = async () => {
    await offlineDb.resetAllData();
    await refreshLedger();
  };

  return (
    <LedgerContext.Provider
      value={{
        scope,
        setScope,
        isBalanceHidden,
        toggleBalanceVisibility,
        transactions,
        categories,
        summary,
        budgetStatus,
        subscriptions,
        invoices,
        isLoading,
        refreshLedger,
        addTransaction: handleAddTransaction,
        deleteTransaction: handleDeleteTransaction,
        addCategory: handleAddCategory,
        deleteCategory: handleDeleteCategory,
        setMonthlyCeiling: handleSetMonthlyCeiling,
        addSubscription: handleAddSubscription,
        toggleSubscription: handleToggleSubscription,
        deleteSubscription: handleDeleteSubscription,
        addInvoice: handleAddInvoice,
        markInvoicePaid: handleMarkInvoicePaid,
        deleteInvoice: handleDeleteInvoice,
        resetVault: handleResetVault,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = () => useContext(LedgerContext);
