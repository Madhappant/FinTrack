import React, { useState } from 'react';
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

interface ModalAddInvoiceProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clients: any[];
}

export const ModalAddInvoice: React.FC<ModalAddInvoiceProps> = ({
  visible,
  onClose,
  onSuccess,
  clients,
}) => {
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [taxRate, setTaxRate] = useState('18');
  const [notes, setNotes] = useState('Payment due within 15 days of issue.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedAmount = parseFloat(amount) || 0;
  const parsedTaxRate = parseFloat(taxRate) || 0;
  const taxAmount = (parsedAmount * parsedTaxRate) / 100;
  const totalAmount = parsedAmount + taxAmount;

  const handleSubmit = async () => {
    if (!clientId) {
      Alert.alert('Client Required', 'Please select a client for this invoice.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Item Description Required', 'Please provide a description of the work/services.');
      return;
    }
    if (parsedAmount <= 0) {
      Alert.alert('Amount Required', 'Please enter a valid amount.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.createInvoice({
        clientId,
        notes,
        items: [
          {
            description: description.trim(),
            quantity: 1,
            unitPrice: parsedAmount,
            taxRate: parsedTaxRate,
          },
        ],
      });

      setDescription('');
      setAmount('');
      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const taxOptions = ['0', '5', '12', '18', '28'];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create New Invoice</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Select Client */}
            <Text style={styles.label}>Select Client *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {clients.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.chip, clientId === c.id && styles.chipActive]}
                  onPress={() => setClientId(c.id)}
                >
                  <Text style={[styles.chipText, clientId === c.id && styles.chipTextActive]}>
                    {c.company || c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Service / Item Description */}
            <Text style={styles.label}>Service / Item Description *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Website Design & Deployment (Phase 1)"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
            />

            {/* Subtotal Amount */}
            <Text style={styles.label}>Subtotal Amount (₹) *</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
            />

            {/* GST / Tax Rate */}
            <Text style={styles.label}>GST / Tax Rate %</Text>
            <View style={styles.rowWrap}>
              {taxOptions.map((rate) => (
                <TouchableOpacity
                  key={rate}
                  style={[styles.tagBtn, taxRate === rate && styles.tagBtnActive]}
                  onPress={() => setTaxRate(rate)}
                >
                  <Text style={[styles.tagBtnText, taxRate === rate && styles.tagBtnTextActive]}>
                    {rate}% {rate === '18' ? '(Standard GST)' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Calculation summary preview box */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryVal}>₹{parsedAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST ({parsedTaxRate}%)</Text>
                <Text style={styles.summaryVal}>₹{taxAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalVal}>₹{totalAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            {/* Terms / Notes */}
            <Text style={styles.label}>Payment Terms & Notes</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Generating Invoice...' : 'Generate & Issue Invoice'}
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  amountInput: {
    fontSize: 26,
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
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  submitBtn: {
    backgroundColor: colors.primary,
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
