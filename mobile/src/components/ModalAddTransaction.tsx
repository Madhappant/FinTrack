import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { api } from '../services/api';

interface ModalAddTransactionProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clients: any[];
  vendors: any[];
}

export const ModalAddTransaction: React.FC<ModalAddTransactionProps> = ({
  visible,
  onClose,
  onSuccess,
  clients,
  vendors,
}) => {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [taxRate, setTaxRate] = useState('0');
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible, type]);

  const loadCategories = async () => {
    try {
      const res = await api.getCategories(type);
      setCategories(res.data.categories || []);
      if (res.data.categories?.length > 0) {
        setSelectedCategory(res.data.categories[0].id);
      }
    } catch (e) {
      console.warn('Error loading categories', e);
    }
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Description Required', 'Please enter a description for this entry.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        categoryId: selectedCategory || null,
        paymentMethod,
        taxRate: parseFloat(taxRate) || 0,
        notes: notes.trim() || null,
        date: new Date().toISOString(),
      };

      if (type === 'INCOME' && selectedEntity) {
        payload.clientId = selectedEntity;
      } else if (type === 'EXPENSE' && selectedEntity) {
        payload.vendorId = selectedEntity;
      }

      await api.createTransaction(payload);
      // Reset form
      setAmount('');
      setDescription('');
      setNotes('');
      setSelectedEntity('');
      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions = ['UPI', 'BANK_TRANSFER', 'CASH', 'CARD'];
  const taxOptions = ['0', '5', '12', '18', '28'];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Record Transaction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Type Switcher */}
            <View style={styles.typeSwitcher}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'EXPENSE' && { backgroundColor: colors.expense },
                ]}
                onPress={() => setType('EXPENSE')}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={18}
                  color={type === 'EXPENSE' ? '#fff' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    type === 'EXPENSE' && { color: '#fff' },
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'INCOME' && { backgroundColor: colors.income },
                ]}
                onPress={() => setType('INCOME')}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={18}
                  color={type === 'INCOME' ? '#fff' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    type === 'INCOME' && { color: '#fff' },
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. AWS Cloud Server Bill, Client Retainer"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
            />

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    selectedCategory === cat.id && {
                      backgroundColor: cat.color || colors.primary,
                      borderColor: cat.color || colors.primary,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory === cat.id && { color: '#fff', fontWeight: '700' },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Client / Vendor linkage */}
            <Text style={styles.label}>
              {type === 'INCOME' ? 'Link Client (Optional)' : 'Link Vendor (Optional)'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              <TouchableOpacity
                style={[styles.chip, !selectedEntity && styles.chipActive]}
                onPress={() => setSelectedEntity('')}
              >
                <Text style={[styles.chipText, !selectedEntity && styles.chipTextActive]}>
                  None
                </Text>
              </TouchableOpacity>
              {(type === 'INCOME' ? clients : vendors).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.chip, selectedEntity === item.id && styles.chipActive]}
                  onPress={() => setSelectedEntity(item.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedEntity === item.id && styles.chipTextActive,
                    ]}
                  >
                    {item.company || item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Payment Method */}
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.rowWrap}>
              {paymentOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.tagBtn, paymentMethod === opt && styles.tagBtnActive]}
                  onPress={() => setPaymentMethod(opt)}
                >
                  <Text
                    style={[
                      styles.tagBtnText,
                      paymentMethod === opt && styles.tagBtnTextActive,
                    ]}
                  >
                    {opt.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* GST / Tax Rate */}
            <Text style={styles.label}>GST / Tax %</Text>
            <View style={styles.rowWrap}>
              {taxOptions.map((rate) => (
                <TouchableOpacity
                  key={rate}
                  style={[styles.tagBtn, taxRate === rate && styles.tagBtnActive]}
                  onPress={() => setTaxRate(rate)}
                >
                  <Text
                    style={[
                      styles.tagBtnText,
                      taxRate === rate && styles.tagBtnTextActive,
                    ]}
                  >
                    {rate}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notes */}
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Invoice ref, transaction ID, or remark"
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: type === 'INCOME' ? colors.income : colors.primary },
                isSubmitting && { opacity: 0.7 },
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Saving...' : `Save ${type === 'INCOME' ? 'Income' : 'Expense'}`}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingVertical: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  chipsScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tagBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tagBtnTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
