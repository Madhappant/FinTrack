import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android emulator 10.0.2.2 is localhost; for Web/iOS simulator localhost works.
// Can also be updated in settings if testing on a real physical phone.
const DEFAULT_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',
  default: 'http://localhost:5000/api',
});

export const API_URL = DEFAULT_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT token if present
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@sugan_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to retrieve auth token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {
  // Auth
  login: (data: any) => apiClient.post('/auth/login', data),
  register: (data: any) => apiClient.post('/auth/register', data),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),

  // Dashboard & Reports
  getDashboard: () => apiClient.get('/reports/dashboard'),
  getTrends: (months = 6) => apiClient.get(`/reports/trends?months=${months}`),
  getExpensesByCategory: (params?: any) => apiClient.get('/reports/expenses-by-category', { params }),
  getTaxReport: (year?: number) => apiClient.get('/reports/tax', { params: { year } }),

  // Transactions
  getTransactions: (params?: any) => apiClient.get('/transactions', { params }),
  createTransaction: (data: any) => apiClient.post('/transactions', data),
  updateTransaction: (id: string, data: any) => apiClient.put(`/transactions/${id}`, data),
  deleteTransaction: (id: string) => apiClient.delete(`/transactions/${id}`),

  // Clients
  getClients: () => apiClient.get('/clients'),
  createClient: (data: any) => apiClient.post('/clients', data),
  updateClient: (id: string, data: any) => apiClient.put(`/clients/${id}`, data),
  deleteClient: (id: string) => apiClient.delete(`/clients/${id}`),

  // Vendors
  getVendors: () => apiClient.get('/vendors'),
  createVendor: (data: any) => apiClient.post('/vendors', data),
  updateVendor: (id: string, data: any) => apiClient.put(`/vendors/${id}`, data),
  deleteVendor: (id: string) => apiClient.delete(`/vendors/${id}`),

  // Invoices
  getInvoices: (params?: any) => apiClient.get('/invoices', { params }),
  createInvoice: (data: any) => apiClient.post('/invoices', data),
  updateInvoiceStatus: (id: string, status: string, recordIncome = true) =>
    apiClient.patch(`/invoices/${id}/status`, { status, recordIncome }),
  deleteInvoice: (id: string) => apiClient.delete(`/invoices/${id}`),

  // Categories
  getCategories: (type?: string) => apiClient.get('/categories', { params: { type } }),
};

export default apiClient;
