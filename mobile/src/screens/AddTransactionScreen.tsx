import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLedger } from '../context/LedgerContext';
import { stitchTheme } from '../theme/stitchTheme';
import { QuickAddChips } from '../components/QuickAddChips';

export const AddTransactionScreen = ({ route, navigation }: any) => {
  const { categories, addTransaction } = useLedger();
  const initialType = route?.params?.initialType || 'EXPENSE';

  const [type, setType] = useState<'INCOME' | 'EXPENSE'>(initialType);
  const [scope, setScope] = useState<'PERSONAL' | 'BUSINESS'>('BUSINESS');
  const [amountStr, setAmountStr] = useState('0');
  const [description, setDescription] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('cat-fuel');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'BANK_TRANSFER' | 'CASH' | 'CREDIT_CARD'>('UPI');
  const [taxRate, setTaxRate] = useState('0');
  const [notes, setNotes] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stepper chip increment
  const handleAddAmount = (inc: number) => {
    const current = parseFloat(amountStr) || 0;
    setAmountStr(String(current + inc));
  };

  const handleClearAmount = () => {
    setAmountStr('0');
  };

  const handleSave = async () => {
    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please specify an amount greater than ₹0.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Description Required', 'Please enter a description for this record.');
      return;
    }

    try {
      setIsSubmitting(true);
      const rate = parseFloat(taxRate) || 0;
      const taxAmount = (parsedAmount * rate) / 100;

      await addTransaction({
        type,
        scope,
        amount: parsedAmount,
        description: description.trim(),
        categoryId: selectedCatId,
        paymentMethod,
        date: new Date().toISOString(),
        taxRate: rate,
        taxAmount,
        invoiceNumber: invoiceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      navigation?.goBack();
    } catch (e: any) {
      Alert.alert('Error', 'Failed to save transaction into offline database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={22} color={stitchTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={styles.offlineShield}>
          <Ionicons name="shield-checkmark" size={13} color={stitchTheme.colors.income} />
          <Text style={styles.offlineShieldText}>Offline</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Flow Switch: Income vs Expense */}
        <View style={styles.typeSwitcher}>
          <TouchableOpacity
            style={[
              styles.typeTab,
              type === 'EXPENSE' && { backgroundColor: stitchTheme.colors.expense, shadowColor: '#000', elevation: 2 },
            ]}
            onPress={() => {
              setType('EXPENSE');
              setSelectedCatId('cat-fuel');
            }}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={18}
              color={type === 'EXPENSE' ? '#FFFFFF' : stitchTheme.colors.textSecondary}
            />
            <Text
              style={[
                styles.typeTabText,
                type === 'EXPENSE' && { color: '#FFFFFF', fontWeight: '800' },
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeTab,
              type === 'INCOME' && { backgroundColor: stitchTheme.colors.income, shadowColor: '#000', elevation: 2 },
            ]}
            onPress={() => {
              setType('INCOME');
              setSelectedCatId('cat-retainer');
            }}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={18}
              color={type === 'INCOME' ? '#FFFFFF' : stitchTheme.colors.textSecondary}
            />
            <Text
              style={[
                styles.typeTabText,
                type === 'INCOME' && { color: '#FFFFFF', fontWeight: '800' },
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scope Toggle: Personal vs Business */}
        <View style={styles.scopeRow}>
          <View style={styles.scopeSegment}>
            <TouchableOpacity
              style={[styles.scopeBtn, scope === 'PERSONAL' && styles.scopeBtnActive]}
              onPress={() => setScope('PERSONAL')}
            >
              <Text
                style={[
                  styles.scopeBtnText,
                  scope === 'PERSONAL' && styles.scopeBtnTextActive,
                ]}
              >
                Personal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scopeBtn, scope === 'BUSINESS' && styles.scopeBtnActive]}
              onPress={() => setScope('BUSINESS')}
            >
              <Ionicons
                name="business-outline"
                size={14}
                color={scope === 'BUSINESS' ? stitchTheme.colors.primary : stitchTheme.colors.textMuted}
              />
              <Text
                style={[
                  styles.scopeBtnText,
                  scope === 'BUSINESS' && styles.scopeBtnTextActive,
                ]}
              >
                Business
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.encTag}>
            <Ionicons name="lock-closed" size={12} color={stitchTheme.colors.income} />
            <Text style={styles.encTagText}>AES-256 Offline</Text>
          </View>
        </View>

        {/* Hero Amount Display Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountRow}>
            <Text style={styles.currencyPrefix}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amountStr}
              onChangeText={setAmountStr}
              keyboardType="numeric"
              selectTextOnFocus
            />
          </View>
          <Text style={styles.amountSub}>
            {scope} Ledger Entry • {type === 'INCOME' ? 'Credit Flow' : 'Incurred Cost'}
          </Text>

          {/* Quick Add Stepper Chips */}
          <QuickAddChips onAddAmount={handleAddAmount} onClear={handleClearAmount} />
        </View>

        {/* Description Input */}
        <Text style={styles.sectionLabel}>Description / Payee *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. HPCL Petrol Pump, Client Milestone, Swiggy"
          placeholderTextColor={stitchTheme.colors.textMuted}
          value={description}
          onChangeText={setDescription}
        />

        {/* Category Grid */}
        <View style={styles.categorySectionHeader}>
          <Text style={styles.sectionLabel}>Category</Text>
          <Text style={styles.categoryCount}>{filteredCategories.length} Presets</Text>
        </View>

        <View style={styles.categoryGrid}>
          {filteredCategories.map((cat) => {
            const isSelected = selectedCatId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  isSelected && {
                    backgroundColor: stitchTheme.colors.secondaryContainer,
                    borderColor: stitchTheme.colors.secondary,
                  },
                ]}
                onPress={() => setSelectedCatId(cat.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.catIconSquare,
                    isSelected
                      ? { backgroundColor: 'rgba(255,255,255,0.2)' }
                      : { backgroundColor: stitchTheme.colors.surfaceContainerLow },
                  ]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={20}
                    color={isSelected ? '#FFFFFF' : cat.color}
                  />
                </View>
                <Text
                  style={[
                    styles.catName,
                    isSelected && { color: '#FFFFFF', fontWeight: '700' },
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Payment Account */}
        <Text style={styles.sectionLabel}>Payment Account / Method</Text>
        <View style={styles.accountRow}>
          {[
            { key: 'UPI', label: 'UPI Wallet' },
            { key: 'BANK_TRANSFER', label: 'Bank (NEFT/IMPS)' },
            { key: 'CASH', label: 'Cash In Hand' },
            { key: 'CREDIT_CARD', label: 'Credit Card' },
          ].map((acc) => (
            <TouchableOpacity
              key={acc.key}
              style={[
                styles.accountChip,
                paymentMethod === acc.key && styles.accountChipActive,
              ]}
              onPress={() => setPaymentMethod(acc.key as any)}
            >
              <Text
                style={[
                  styles.accountChipText,
                  paymentMethod === acc.key && styles.accountChipTextActive,
                ]}
              >
                {acc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* GST / Tax & Invoice linkage */}
        <Text style={styles.sectionLabel}>GST / Tax % (Optional)</Text>
        <View style={styles.taxRow}>
          {['0', '5', '12', '18', '28'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.taxChip, taxRate === r && styles.taxChipActive]}
              onPress={() => setTaxRate(r)}
            >
              <Text style={[styles.taxChipText, taxRate === r && styles.taxChipTextActive]}>
                {r}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Invoice / Ref & Notes */}
        <Text style={styles.sectionLabel}>Invoice Ref / Note (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. INV-2026-004, bill receipt number"
          placeholderTextColor={stitchTheme.colors.textMuted}
          value={invoiceNumber}
          onChangeText={setInvoiceNumber}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: type === 'INCOME' ? stitchTheme.colors.income : stitchTheme.colors.primary },
            isSubmitting && { opacity: 0.7 },
          ]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <Text style={styles.saveBtnText}>
            {isSubmitting
              ? 'Recording...'
              : `Save ${type === 'INCOME' ? 'Income' : 'Expense'} (₹${parseFloat(amountStr || '0').toLocaleString('en-IN')})`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  backBtn: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  offlineShield: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  offlineShieldText: {
    fontSize: 10,
    fontWeight: '700',
    color: stitchTheme.colors.incomeText,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  typeTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: stitchTheme.colors.textSecondary,
  },
  scopeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  scopeSegment: {
    flexDirection: 'row',
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  scopeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  scopeBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  scopeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  scopeBtnTextActive: {
    color: stitchTheme.colors.primary,
    fontWeight: '700',
  },
  encTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  encTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: '700',
    color: stitchTheme.colors.textSecondary,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 38,
    fontWeight: '800',
    color: stitchTheme.colors.textPrimary,
    minWidth: 120,
    textAlign: 'center',
  },
  amountSub: {
    fontSize: 12,
    color: stitchTheme.colors.textMuted,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
    marginBottom: 8,
    marginTop: 10,
  },
  categorySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryCount: {
    fontSize: 11,
    color: stitchTheme.colors.secondary,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  catIconSquare: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catName: {
    fontSize: 11,
    fontWeight: '600',
    color: stitchTheme.colors.textPrimary,
    textAlign: 'center',
  },
  accountRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  accountChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  accountChipActive: {
    backgroundColor: stitchTheme.colors.primary,
    borderColor: stitchTheme.colors.primary,
  },
  accountChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  accountChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  taxRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  taxChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  taxChipActive: {
    backgroundColor: stitchTheme.colors.primaryContainer,
    borderColor: stitchTheme.colors.primaryContainer,
  },
  taxChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: stitchTheme.colors.textSecondary,
  },
  taxChipTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: stitchTheme.colors.textPrimary,
    marginBottom: 10,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
