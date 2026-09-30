import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLedger } from '../context/LedgerContext';
import { stitchTheme } from '../theme/stitchTheme';

export const SubscriptionsScreen = () => {
  const {
    subscriptions,
    invoices,
    addSubscription,
    toggleSubscription,
    deleteSubscription,
    addInvoice,
    markInvoicePaid,
    deleteInvoice,
  } = useLedger();

  const [activeTab, setActiveTab] = useState<'SUBSCRIPTIONS' | 'INVOICES'>('SUBSCRIPTIONS');
  const [modalVisible, setModalVisible] = useState(false);

  // Add form fields
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState<'MONTHLY' | 'QUARTERLY' | 'ANNUAL'>('MONTHLY');
  const [extra, setExtra] = useState(''); // Category for sub, Client Company for invoice

  const monthlyBurn = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => {
      if (s.cycle === 'ANNUAL') return sum + s.amount / 12;
      if (s.cycle === 'QUARTERLY') return sum + s.amount / 3;
      return sum + s.amount;
    }, 0);

  const annualProjected = monthlyBurn * 12;

  const handleSave = async () => {
    const val = parseFloat(amount);
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a name / title.');
      return;
    }
    if (isNaN(val) || val <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    if (activeTab === 'SUBSCRIPTIONS') {
      await addSubscription({
        name: name.trim(),
        amount: val,
        cycle,
        category: extra.trim() || 'Software & Tools',
        nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        account: 'Bank Account / UPI',
        isActive: true,
      });
    } else {
      await addInvoice({
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
        clientName: name.trim(),
        clientCompany: extra.trim() || undefined,
        amount: val,
        taxRate: 18,
        taxAmount: (val * 18) / 100,
        total: val + (val * 18) / 100,
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
        status: 'PENDING',
      });
    }

    setName('');
    setAmount('');
    setExtra('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Commitments</Text>
          <View style={styles.engineRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.engineText}>Local Cron Engine • Zero Telemetry</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Burn Card (Navy) */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.burnLabel}>Monthly Recurring Burn</Text>
              <Text style={styles.burnAmount}>
                ₹{Math.round(monthlyBurn).toLocaleString('en-IN')}{' '}
                <Text style={styles.burnUnit}>/mo</Text>
              </Text>
            </View>

            <View style={styles.annualBox}>
              <Text style={styles.annualLabel}>Projected Annual</Text>
              <Text style={styles.annualVal}>
                ₹{Math.round(annualProjected).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Switcher: Subscriptions vs Invoices */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'SUBSCRIPTIONS' && styles.tabBtnActive]}
            onPress={() => setActiveTab('SUBSCRIPTIONS')}
          >
            <Ionicons
              name="repeat"
              size={16}
              color={activeTab === 'SUBSCRIPTIONS' ? '#FFFFFF' : stitchTheme.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'SUBSCRIPTIONS' && styles.tabBtnTextActive,
              ]}
            >
              Subscriptions ({subscriptions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'INVOICES' && styles.tabBtnActive]}
            onPress={() => setActiveTab('INVOICES')}
          >
            <Ionicons
              name="document-text"
              size={16}
              color={activeTab === 'INVOICES' ? '#FFFFFF' : stitchTheme.colors.textSecondary}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'INVOICES' && styles.tabBtnTextActive,
              ]}
            >
              Client Invoices ({invoices.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* List Content */}
        {activeTab === 'SUBSCRIPTIONS' ? (
          subscriptions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="repeat-outline" size={44} color={stitchTheme.colors.textMuted} />
              <Text style={styles.emptyTitle}>Zero Active Subscriptions</Text>
              <Text style={styles.emptySub}>
                Add recurring tools (AWS, Adobe, Broadband, Coworking) to track your monthly burn rate.
              </Text>
            </View>
          ) : (
            subscriptions.map((sub) => (
              <View key={sub.id} style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View style={styles.itemIconSquare}>
                    <Ionicons name="refresh" size={18} color={stitchTheme.colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.itemTitle}>{sub.name}</Text>
                    <Text style={styles.itemSub}>
                      {sub.cycle} • {sub.category}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemRight}>
                  <Text style={styles.itemAmount}>₹{sub.amount.toLocaleString('en-IN')}</Text>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      onPress={() => toggleSubscription(sub.id)}
                      style={[
                        styles.togglePill,
                        sub.isActive ? styles.toggleActive : styles.toggleInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          sub.isActive ? styles.toggleTextActive : styles.toggleTextInactive,
                        ]}
                      >
                        {sub.isActive ? 'Active' : 'Paused'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteSubscription(sub.id)}
                      style={styles.delBtn}
                    >
                      <Ionicons name="trash-outline" size={14} color={stitchTheme.colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )
        ) : invoices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={44} color={stitchTheme.colors.textMuted} />
            <Text style={styles.emptyTitle}>Zero Outstanding Invoices</Text>
            <Text style={styles.emptySub}>
              Tap "+ New" above to bill a client with itemized GST calculations.
            </Text>
          </View>
        ) : (
          invoices.map((inv) => (
            <View key={inv.id} style={styles.itemCard}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIconSquare}>
                  <Ionicons name="document-text-outline" size={18} color={stitchTheme.colors.secondary} />
                </View>
                <View>
                  <Text style={styles.itemTitle}>{inv.invoiceNumber}</Text>
                  <Text style={styles.itemSub}>
                    {inv.clientName} {inv.clientCompany ? `(${inv.clientCompany})` : ''}
                  </Text>
                </View>
              </View>

              <View style={styles.itemRight}>
                <Text style={styles.itemAmount}>₹{inv.total.toLocaleString('en-IN')}</Text>
                <View style={styles.actionRow}>
                  {inv.status !== 'PAID' ? (
                    <TouchableOpacity
                      style={styles.markPaidBtn}
                      onPress={() => markInvoicePaid(inv.id)}
                    >
                      <Ionicons name="checkmark-done" size={12} color={stitchTheme.colors.income} />
                      <Text style={styles.markPaidText}>Mark Paid</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.paidBadge}>
                      <Text style={styles.paidBadgeText}>PAID</Text>
                    </View>
                  )}

                  <TouchableOpacity onPress={() => deleteInvoice(inv.id)} style={styles.delBtn}>
                    <Ionicons name="trash-outline" size={14} color={stitchTheme.colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* New Commitment Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add {activeTab === 'SUBSCRIPTIONS' ? 'Recurring Subscription' : 'Client Invoice'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={stitchTheme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>
              {activeTab === 'SUBSCRIPTIONS' ? 'Subscription / Tool Name *' : 'Client Name *'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={activeTab === 'SUBSCRIPTIONS' ? 'e.g. AWS Cloud Servers' : 'e.g. Rajesh Sharma'}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>
              {activeTab === 'SUBSCRIPTIONS' ? 'Recurring Amount (₹) *' : 'Invoice Amount (₹) *'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            {activeTab === 'SUBSCRIPTIONS' ? (
              <>
                <Text style={styles.inputLabel}>Billing Cycle</Text>
                <View style={styles.cycleRow}>
                  {(['MONTHLY', 'QUARTERLY', 'ANNUAL'] as const).map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.cycleBtn, cycle === c && styles.cycleBtnActive]}
                      onPress={() => setCycle(c)}
                    >
                      <Text style={[styles.cycleText, cycle === c && styles.cycleTextActive]}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Company / Organisation (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. TechCorp India Pvt Ltd"
                  value={extra}
                  onChangeText={setExtra}
                />
              </>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Commitment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: stitchTheme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: stitchTheme.colors.textPrimary,
  },
  engineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: stitchTheme.colors.income,
  },
  engineText: {
    fontSize: 10,
    fontWeight: '700',
    color: stitchTheme.colors.incomeText,
    textTransform: 'uppercase',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: stitchTheme.colors.primary,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: stitchTheme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  burnLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: stitchTheme.colors.primaryFixedDim,
    textTransform: 'uppercase',
  },
  burnAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  burnUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: stitchTheme.colors.primaryFixedDim,
  },
  annualBox: {
    alignItems: 'flex-end',
  },
  annualLabel: {
    fontSize: 11,
    color: stitchTheme.colors.primaryFixedDim,
  },
  annualVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: stitchTheme.colors.primary,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  itemIconSquare: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  itemSub: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    marginTop: 1,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: stitchTheme.colors.textPrimary,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  togglePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: stitchTheme.colors.incomeContainer,
  },
  toggleInactive: {
    backgroundColor: stitchTheme.colors.surfaceContainer,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: stitchTheme.colors.income,
  },
  toggleTextInactive: {
    color: stitchTheme.colors.textMuted,
  },
  markPaidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.incomeContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  markPaidText: {
    fontSize: 10,
    fontWeight: '700',
    color: stitchTheme.colors.income,
  },
  paidBadge: {
    backgroundColor: stitchTheme.colors.incomeContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paidBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: stitchTheme.colors.income,
  },
  delBtn: {
    padding: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: stitchTheme.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: stitchTheme.colors.textPrimary,
  },
  cycleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  cycleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cycleBtnActive: {
    backgroundColor: stitchTheme.colors.primary,
    borderColor: stitchTheme.colors.primary,
  },
  cycleText: {
    fontSize: 11,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  cycleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: stitchTheme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
