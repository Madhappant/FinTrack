import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLedger } from '../context/LedgerContext';
import { useSecurity } from '../context/SecurityContext';
import { stitchTheme } from '../theme/stitchTheme';
import { generateFinancialPdf } from '../services/pdfGenerator';

export const ReportsScreen = ({ navigation }: any) => {
  const { transactions, categories } = useLedger();
  const { securitySettings } = useSecurity();

  const [periodType, setPeriodType] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  // Filter transactions by selected Period
  const periodTxs = transactions.filter((t) => {
    const d = new Date(t.date);
    if (periodType === 'YEARLY') {
      return d.getFullYear() === selectedYear;
    } else {
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    }
  });

  const incomeTxs = periodTxs.filter((t) => t.type === 'INCOME');
  const expenseTxs = periodTxs.filter((t) => t.type === 'EXPENSE');

  const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : '0';

  // Category breakdown for this period
  const catMap: Record<string, { name: string; color: string; amount: number }> = {};
  expenseTxs.forEach((tx) => {
    const cat = categories.find((c) => c.id === tx.categoryId);
    const catName = cat ? cat.name : 'General';
    const catColor = cat ? cat.color : stitchTheme.colors.secondary;

    if (!catMap[catName]) {
      catMap[catName] = { name: catName, color: catColor, amount: 0 };
    }
    catMap[catName].amount += tx.amount;
  });

  const catBreakdown = Object.values(catMap).map((c) => ({
    ...c,
    percentage: totalExpense > 0 ? parseFloat(((c.amount / totalExpense) * 100).toFixed(1)) : 0,
  })).sort((a, b) => b.amount - a.amount);

  // GST for this period
  const outputGst = incomeTxs.reduce((sum, t) => sum + (t.taxAmount || 0), 0);
  const inputGst = expenseTxs.reduce((sum, t) => sum + (t.taxAmount || 0), 0);
  const netGstPayable = Math.max(0, outputGst - inputGst);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const periodLabel = periodType === 'MONTHLY'
    ? `${monthNames[selectedMonth]} ${selectedYear}`
    : `Year ${selectedYear}`;

  const handleExportPdf = async () => {
    try {
      await generateFinancialPdf({
        title: `${periodType === 'MONTHLY' ? 'Monthly' : 'Annual'} Financial Statement`,
        period: periodLabel,
        userName: securitySettings?.userName || 'Solo Proprietor',
        businessName: securitySettings?.businessName || 'Sovereign Ledger',
        summary: {
          totalIncome,
          totalExpense,
          netBalance,
        },
        transactions: periodTxs,
        catBreakdown,
      });
    } catch (err: any) {
      Alert.alert('PDF Export Error', 'Failed to generate PDF statement.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Financial Reports</Text>
          <Text style={styles.headerSub}>Monthly & Annual Statement Engine</Text>
        </View>

        <TouchableOpacity style={styles.pdfBtn} onPress={handleExportPdf}>
          <Ionicons name="document-text-outline" size={16} color="#FFFFFF" />
          <Text style={styles.pdfBtnText}>Export PDF</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Period Selector Tabs: Monthly vs Yearly */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, periodType === 'MONTHLY' && styles.tabBtnActive]}
            onPress={() => setPeriodType('MONTHLY')}
          >
            <Ionicons
              name="calendar"
              size={14}
              color={periodType === 'MONTHLY' ? '#FFFFFF' : stitchTheme.colors.textSecondary}
            />
            <Text style={[styles.tabBtnText, periodType === 'MONTHLY' && styles.tabBtnTextActive]}>
              Monthly Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, periodType === 'YEARLY' && styles.tabBtnActive]}
            onPress={() => setPeriodType('YEARLY')}
          >
            <Ionicons
              name="bar-chart"
              size={14}
              color={periodType === 'YEARLY' ? '#FFFFFF' : stitchTheme.colors.textSecondary}
            />
            <Text style={[styles.tabBtnText, periodType === 'YEARLY' && styles.tabBtnTextActive]}>
              Yearly Report
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Period Badge */}
        <View style={styles.periodPill}>
          <Ionicons name="time-outline" size={16} color={stitchTheme.colors.secondary} />
          <Text style={styles.periodPillText}>{periodLabel}</Text>
          <Text style={styles.periodCount}>({periodTxs.length} entries)</Text>
        </View>

        {/* P&L Statement Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profit & Loss Statement</Text>
            <View style={styles.marginBadge}>
              <Text style={styles.marginText}>{margin}% Net Margin</Text>
            </View>
          </View>

          <View style={styles.pnlRow}>
            <Text style={styles.pnlLabel}>Gross Revenue (Income)</Text>
            <Text style={[styles.pnlVal, { color: stitchTheme.colors.income }]}>
              +₹{totalIncome.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.pnlRow}>
            <Text style={styles.pnlLabel}>Operating Expenses</Text>
            <Text style={[styles.pnlVal, { color: stitchTheme.colors.expense }]}>
              −₹{totalExpense.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.pnlRow}>
            <Text style={styles.netLabel}>Net Financial Yield</Text>
            <Text
              style={[
                styles.netVal,
                { color: netBalance >= 0 ? stitchTheme.colors.income : stitchTheme.colors.expense },
              ]}
            >
              ₹{netBalance.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* GST & Tax Estimation Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>GST & Tax Estimation</Text>
            <Ionicons name="receipt-outline" size={18} color={stitchTheme.colors.primary} />
          </View>

          <View style={styles.taxGrid}>
            <View style={styles.taxBox}>
              <Text style={styles.taxBoxLabel}>Output GST Collected</Text>
              <Text style={styles.taxBoxVal}>₹{Math.round(outputGst).toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.taxBox}>
              <Text style={styles.taxBoxLabel}>Input Tax Credit (ITC)</Text>
              <Text style={styles.taxBoxVal}>₹{Math.round(inputGst).toLocaleString('en-IN')}</Text>
            </View>
          </View>

          <View style={styles.netTaxRow}>
            <View>
              <Text style={styles.netTaxLabel}>Net GST Liability</Text>
              <Text style={styles.netTaxSub}>Payable to Government</Text>
            </View>
            <Text style={styles.netTaxAmount}>₹{Math.round(netGstPayable).toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Expenses by Category Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Category Spending Distribution</Text>
          <Text style={styles.cardSubtitle}>
            Total Period Outflow: ₹{totalExpense.toLocaleString('en-IN')}
          </Text>

          {catBreakdown.length === 0 ? (
            <Text style={styles.noData}>No expense records found in {periodLabel}.</Text>
          ) : (
            catBreakdown.map((item, idx) => (
              <View key={idx} style={styles.catRow}>
                <View style={styles.catHeader}>
                  <View style={styles.catLeft}>
                    <View style={[styles.catDot, { backgroundColor: item.color }]} />
                    <Text style={styles.catName}>{item.name}</Text>
                  </View>
                  <Text style={styles.catAmount}>
                    ₹{item.amount.toLocaleString('en-IN')} ({item.percentage}%)
                  </Text>
                </View>

                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.min(item.percentage, 100)}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  headerSub: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    marginTop: 1,
  },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  pdfBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
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
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    marginBottom: 14,
    gap: 8,
  },
  periodPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  periodCount: {
    fontSize: 11,
    color: stitchTheme.colors.textMuted,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: stitchTheme.colors.textMuted,
    marginBottom: 12,
  },
  marginBadge: {
    backgroundColor: stitchTheme.colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  marginText: {
    fontSize: 11,
    fontWeight: '700',
    color: stitchTheme.colors.secondary,
  },
  pnlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  pnlLabel: {
    fontSize: 13,
    color: stitchTheme.colors.textSecondary,
  },
  pnlVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: stitchTheme.colors.borderLight,
    marginVertical: 10,
  },
  netLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: stitchTheme.colors.textPrimary,
  },
  netVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  taxGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  taxBox: {
    flex: 1,
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 10,
  },
  taxBoxLabel: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    marginBottom: 4,
  },
  taxBoxVal: {
    fontSize: 15,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  netTaxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.warningContainer,
    padding: 12,
    borderRadius: 12,
  },
  netTaxLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.warningText,
  },
  netTaxSub: {
    fontSize: 10,
    color: stitchTheme.colors.warningText,
  },
  netTaxAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: stitchTheme.colors.warningText,
  },
  catRow: {
    marginBottom: 12,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  catName: {
    fontSize: 13,
    fontWeight: '600',
    color: stitchTheme.colors.textPrimary,
  },
  catAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: stitchTheme.colors.textSecondary,
  },
  track: {
    height: 6,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  noData: {
    fontSize: 13,
    color: stitchTheme.colors.textMuted,
    paddingVertical: 10,
  },
});
