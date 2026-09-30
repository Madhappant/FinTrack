import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { InvoiceCard } from '../components/InvoiceCard';
import { ModalAddInvoice } from '../components/ModalAddInvoice';

export const InvoicesScreen = () => {
  const [filterStatus, setFilterStatus] = useState(''); // '' = All, 'PENDING', 'PAID', 'OVERDUE'
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchInvoices = useCallback(async () => {
    try {
      const params: any = {};
      if (filterStatus) params.status = filterStatus;

      const [invRes, clientsRes] = await Promise.all([
        api.getInvoices(params),
        api.getClients(),
      ]);

      setInvoices(invRes.data.invoices || []);
      setClients(clientsRes.data.clients || []);
    } catch (err) {
      console.warn('Failed to load invoices', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvoices();
  };

  const handleMarkPaid = async (id: string) => {
    Alert.alert(
      'Mark as Received',
      'Would you like to mark this invoice as PAID and automatically record the payment in your income transactions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Record Income',
          onPress: async () => {
            try {
              await api.updateInvoiceStatus(id, 'PAID', true);
              fetchInvoices();
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to update invoice');
            }
          },
        },
      ]
    );
  };

  const pendingTotal = invoices
    .filter((inv) => inv.status === 'PENDING' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Invoices</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>New Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Outstanding Banner */}
      <View style={styles.outstandingBanner}>
        <View>
          <Text style={styles.outstandingLabel}>Total Unpaid Receivables</Text>
          <Text style={styles.outstandingAmount}>
            ₹{pendingTotal.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={styles.taxBadge}>
          <Text style={styles.taxBadgeText}>GST Ready</Text>
        </View>
      </View>

      {/* Status Filter Tabs */}
      <View style={styles.filterRow}>
        {[
          { key: '', label: 'All' },
          { key: 'PENDING', label: 'Pending' },
          { key: 'OVERDUE', label: 'Overdue' },
          { key: 'PAID', label: 'Paid' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, filterStatus === tab.key && styles.filterTabActive]}
            onPress={() => setFilterStatus(tab.key)}
          >
            <Text style={[styles.filterText, filterStatus === tab.key && styles.filterTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Invoices List */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InvoiceCard invoice={item} onMarkPaid={handleMarkPaid} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No invoices found</Text>
              <Text style={styles.emptySub}>
                Tap "+ New Invoice" to bill your clients with itemized breakdowns and tax rates.
              </Text>
            </View>
          }
        />
      )}

      {/* Add Invoice Modal */}
      <ModalAddInvoice
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={fetchInvoices}
        clients={clients}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 4,
  },
  outstandingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    padding: 16,
  },
  outstandingLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  outstandingAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FBBF24',
    marginTop: 4,
  },
  taxBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  taxBadgeText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
