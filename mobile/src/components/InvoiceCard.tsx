import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface InvoiceCardProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE' | string;
    subtotal: number;
    taxTotal: number;
    total: number;
    client: {
      name: string;
      company?: string;
    };
    items?: Array<{ description: string; quantity: number; amount: number }>;
  };
  onMarkPaid?: (id: string) => void;
  onPress?: () => void;
  currency?: string;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onMarkPaid,
  onPress,
  currency = '₹',
}) => {
  const isPaid = invoice.status === 'PAID';
  const isOverdue = invoice.status === 'OVERDUE';

  let statusBg = colors.warningLight;
  let statusColor = colors.warning;
  if (isPaid) {
    statusBg = colors.incomeLight;
    statusColor = colors.income;
  } else if (isOverdue) {
    statusBg = colors.expenseLight;
    statusColor = colors.expense;
  }

  const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          <Text style={styles.clientName}>{invoice.client.company || invoice.client.name}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{invoice.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.label}>Due Date</Text>
          <Text style={[styles.value, isOverdue && styles.overdueDate]}>
            {formattedDueDate}
          </Text>
        </View>

        <View style={styles.rightAmountBox}>
          <Text style={styles.label}>
            {invoice.taxTotal > 0 ? `Incl. ${currency}${invoice.taxTotal} GST` : 'Total Amount'}
          </Text>
          <Text style={styles.totalAmount}>
            {currency}{invoice.total.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {!isPaid && onMarkPaid ? (
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => onMarkPaid(invoice.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-done" size={16} color="#059669" />
          <Text style={styles.payBtnText}>Mark as Received / Paid</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  clientName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  overdueDate: {
    color: colors.expense,
  },
  rightAmountBox: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  payBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  payBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 6,
  },
});
