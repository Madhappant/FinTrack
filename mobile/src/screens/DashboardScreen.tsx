import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLedger } from '../context/LedgerContext';
import { useSecurity } from '../context/SecurityContext';
import { stitchTheme } from '../theme/stitchTheme';
import { ScopeSwitcher } from '../components/ScopeSwitcher';
import { BudgetMeter } from '../components/BudgetMeter';
import { BudgetAlarmBanner } from '../components/BudgetAlarmBanner';
import { SmsDetectionBanner } from '../components/SmsDetectionBanner';
import { offlineDb } from '../services/offlineDb';

export const DashboardScreen = ({ navigation }: any) => {
  const {
    scope,
    setScope,
    isBalanceHidden,
    toggleBalanceVisibility,
    summary,
    budgetStatus,
    transactions,
    refreshLedger,
    addTransaction,
  } = useLedger();

  const { securitySettings, lockApp } = useSecurity();
  const [refreshing, setRefreshing] = useState(false);

  // SMS Scan Simulator Modal
  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const [smsInput, setSmsInput] = useState(
    'HDFC Bank: Rs. 850.00 debited from a/c **4120 at HPCL PETROL PUMP on 30-SEP-26. UPI Ref: 429182910'
  );
  const [detectedSms, setDetectedSms] = useState<any>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshLedger();
    setRefreshing(false);
  };

  const handleTestSmsScan = () => {
    const parsed = offlineDb.parseSms(smsInput);
    if (parsed) {
      setDetectedSms(parsed);
      setSmsModalVisible(false);
    } else {
      Alert.alert('Scan Failed', 'Could not extract transaction amount or merchant from text.');
    }
  };

  const confirmDetectedTransaction = async () => {
    if (!detectedSms) return;
    await addTransaction({
      type: detectedSms.type,
      scope: 'BUSINESS',
      amount: detectedSms.amount,
      description: `${detectedSms.merchant} (SMS Auto)`,
      categoryId: detectedSms.detectedCategory,
      paymentMethod: 'UPI',
      date: new Date().toISOString(),
      notes: `Imported via offline SMS parser from ${detectedSms.account}`,
    });
    setDetectedSms(null);
    Alert.alert('Success', 'Transaction saved to local offline ledger!');
  };

  const displayBalance = isBalanceHidden
    ? '••••••'
    : `₹${summary.netBalance.toLocaleString('en-IN')}`;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoSquare}>
            <Ionicons name="wallet" size={18} color="#FFFFFF" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandName}>FinTrack</Text>
              <View style={styles.offlinePill}>
                <View style={styles.offlineDot} />
                <Text style={styles.offlineText}>OFFLINE</Text>
              </View>
            </View>
            <Text style={styles.brandSub}>Sovereign Ledger</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={lockApp}>
            <Ionicons name="lock-closed-outline" size={18} color={stitchTheme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => navigation?.navigate('Settings')}
          >
            <Text style={styles.avatarText}>
              {securitySettings?.userName ? securitySettings.userName.charAt(0).toUpperCase() : 'O'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[stitchTheme.colors.primary]}
          />
        }
      >
        {/* Greeting & Security Status */}
        <View style={styles.greetingSection}>
          <View>
            <View style={styles.greetingTitleRow}>
              <Text style={styles.greetingText}>
                Good Morning, {securitySettings?.userName?.split(' ')[0] || 'Owner'}
              </Text>
              <Text style={styles.wave}>👋</Text>
            </View>
            <View style={styles.shieldRow}>
              <Ionicons name="shield-checkmark" size={13} color={stitchTheme.colors.income} />
              <Text style={styles.shieldText}>Private & Offline Mode • Stored locally</Text>
            </View>
          </View>

          <View style={styles.encryptIconBox}>
            <Ionicons name="finger-print" size={20} color={stitchTheme.colors.primary} />
          </View>
        </View>

        {/* Scope Switcher: All / Personal / Business */}
        <View style={styles.scopeRow}>
          <ScopeSwitcher currentScope={scope} onSelect={setScope} />
          <View style={styles.periodPill}>
            <Ionicons name="calendar-outline" size={13} color={stitchTheme.colors.secondary} />
            <Text style={styles.periodText}>
              {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Monthly Limit Alarm Banner (When spending breaches cap) */}
        <BudgetAlarmBanner
          spent={summary.monthExpense}
          ceiling={budgetStatus.ceiling}
          scope={scope}
          onAdjustCap={() => navigation?.navigate('Budget')}
        />

        {/* Hero Financial Balance Card (Navy Container) */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroTitleRow}>
              <Text style={styles.heroTitle}>Total Net Balance</Text>
              <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.eyeBtn}>
                <Ionicons
                  name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
                  size={16}
                  color={stitchTheme.colors.primaryFixedDim}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.vaultPill}>
              <View style={styles.vaultDot} />
              <Text style={styles.vaultText}>Encrypted Vault</Text>
            </View>
          </View>

          <Text style={styles.heroAmount}>{displayBalance}</Text>

          {/* Sub Metrics: Income, Spent, Saved */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <View style={styles.metricLabelRow}>
                <Ionicons name="arrow-down" size={12} color={stitchTheme.colors.incomeVibrant} />
                <Text style={styles.metricLabel}>Income</Text>
              </View>
              <Text style={[styles.metricVal, { color: stitchTheme.colors.incomeVibrant }]}>
                {isBalanceHidden ? '•••' : `+₹${summary.monthIncome.toLocaleString('en-IN')}`}
              </Text>
            </View>

            <View style={styles.metricBox}>
              <View style={styles.metricLabelRow}>
                <Ionicons name="arrow-up" size={12} color="#F87171" />
                <Text style={styles.metricLabel}>Spent</Text>
              </View>
              <Text style={[styles.metricVal, { color: '#F87171' }]}>
                {isBalanceHidden ? '•••' : `−₹${summary.monthExpense.toLocaleString('en-IN')}`}
              </Text>
            </View>

            <View style={styles.metricBox}>
              <View style={styles.metricLabelRow}>
                <Ionicons name="wallet-outline" size={12} color={stitchTheme.colors.secondaryLight} />
                <Text style={styles.metricLabel}>Saved</Text>
              </View>
              <Text style={[styles.metricVal, { color: stitchTheme.colors.secondaryLight }]}>
                {isBalanceHidden ? '•••' : `+₹${summary.monthSavings.toLocaleString('en-IN')}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Action Row */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation?.navigate('AddTransaction', { initialType: 'INCOME' })}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconSquare, { backgroundColor: stitchTheme.colors.incomeContainer }]}>
              <Ionicons name="add-circle" size={24} color={stitchTheme.colors.income} />
            </View>
            <Text style={styles.actionLabel}>Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation?.navigate('AddTransaction', { initialType: 'EXPENSE' })}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconSquare, { backgroundColor: stitchTheme.colors.expenseContainer }]}>
              <Ionicons name="remove-circle" size={24} color={stitchTheme.colors.expense} />
            </View>
            <Text style={styles.actionLabel}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation?.navigate('Reports')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconSquare, { backgroundColor: stitchTheme.colors.surfaceContainer }]}>
              <Ionicons name="bar-chart" size={22} color={stitchTheme.colors.secondary} />
            </View>
            <Text style={styles.actionLabel}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setSmsModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconSquare, { backgroundColor: stitchTheme.colors.surfaceContainerHigh }]}>
              <Ionicons name="chatbox-ellipses" size={22} color={stitchTheme.colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Scan SMS</Text>
          </TouchableOpacity>
        </View>

        {/* Offline SMS Detected Banner if triggered */}
        {detectedSms && (
          <SmsDetectionBanner
            detected={detectedSms}
            onConfirm={confirmDetectedTransaction}
            onDismiss={() => setDetectedSms(null)}
          />
        )}

        {/* Monthly Budget Limits & Meter */}
        <BudgetMeter
          spent={budgetStatus.spent}
          ceiling={budgetStatus.ceiling}
          percentage={budgetStatus.percentage}
          remainingBuffer={budgetStatus.remainingBuffer}
          dailySafeSpend={budgetStatus.dailySafeSpend}
        />

        {/* Recent Ledger Feed */}
        <View style={styles.feedHeader}>
          <Text style={styles.feedTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('Transactions')}>
            <Text style={styles.seeAllText}>View Ledger →</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="reader-outline" size={36} color={stitchTheme.colors.textMuted} />
            <Text style={styles.emptyTitle}>Zero Ledger Entries</Text>
            <Text style={styles.emptySub}>
              Clean slate. Tap "Income" or "Expense" above to record your real-world financial transactions.
            </Text>
          </View>
        ) : (
          recentTransactions.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            return (
              <View key={tx.id} style={styles.txRow}>
                <View
                  style={[
                    styles.txIconBox,
                    {
                      backgroundColor: isIncome
                        ? stitchTheme.colors.incomeContainer
                        : stitchTheme.colors.expenseContainer,
                    },
                  ]}
                >
                  <Ionicons
                    name={isIncome ? 'arrow-down' : 'arrow-up'}
                    size={18}
                    color={isIncome ? stitchTheme.colors.income : stitchTheme.colors.expense}
                  />
                </View>

                <View style={styles.txDetails}>
                  <Text style={styles.txDesc} numberOfLines={1}>
                    {tx.description}
                  </Text>
                  <View style={styles.txMetaRow}>
                    <Text style={styles.txScopeTag}>{tx.scope}</Text>
                    <Text style={styles.txDot}>•</Text>
                    <Text style={styles.txDate}>
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    { color: isIncome ? stitchTheme.colors.income : stitchTheme.colors.expense },
                  ]}
                >
                  {isIncome ? '+₹' : '−₹'}
                  {tx.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* SMS Scan Simulator Modal */}
      <Modal visible={smsModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Offline SMS Parser</Text>
              <TouchableOpacity onPress={() => setSmsModalVisible(false)}>
                <Ionicons name="close" size={22} color={stitchTheme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              FinTrack scans bank/UPI SMS texts 100% locally on your device without sending any data to the cloud.
            </Text>

            <TextInput
              style={styles.smsInput}
              value={smsInput}
              onChangeText={setSmsInput}
              multiline
              numberOfLines={4}
              placeholder="Paste Indian Bank SMS alert here..."
            />

            <TouchableOpacity style={styles.scanBtn} onPress={handleTestSmsScan}>
              <Ionicons name="scan-outline" size={18} color="#FFFFFF" />
              <Text style={styles.scanBtnText}>Scan & Auto-Extract</Text>
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: stitchTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    color: stitchTheme.colors.textPrimary,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    gap: 4,
  },
  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: stitchTheme.colors.income,
  },
  offlineText: {
    fontSize: 9,
    fontWeight: '800',
    color: stitchTheme.colors.incomeText,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: stitchTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  greetingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  wave: {
    fontSize: 18,
  },
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  shieldText: {
    fontSize: 11,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  encryptIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scopeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textPrimary,
  },
  heroCard: {
    backgroundColor: stitchTheme.colors.primary,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: stitchTheme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: stitchTheme.colors.primaryFixed,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eyeBtn: {
    padding: 2,
  },
  vaultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  vaultDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: stitchTheme.colors.incomeVibrant,
  },
  vaultText: {
    fontSize: 10,
    fontWeight: '700',
    color: stitchTheme.colors.incomeVibrant,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 12,
    letterSpacing: -0.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 8,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: stitchTheme.colors.primaryFixedDim,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: stitchTheme.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  actionIconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: stitchTheme.colors.secondary,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
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
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: stitchTheme.colors.borderLight,
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  txDetails: {
    flex: 1,
  },
  txDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: stitchTheme.colors.textPrimary,
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  txScopeTag: {
    fontSize: 10,
    fontWeight: '700',
    color: stitchTheme.colors.secondary,
  },
  txDot: {
    fontSize: 10,
    color: stitchTheme.colors.textMuted,
  },
  txDate: {
    fontSize: 11,
    color: stitchTheme.colors.textMuted,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
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
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: stitchTheme.colors.textSecondary,
    marginVertical: 10,
    lineHeight: 16,
  },
  smsInput: {
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: stitchTheme.colors.textPrimary,
    textAlignVertical: 'top',
    height: 90,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchTheme.colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 14,
    gap: 6,
  },
  scanBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
