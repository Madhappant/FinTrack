import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface TransactionItemProps {
  transaction: {
    id: string;
    type: 'INCOME' | 'EXPENSE' | string;
    amount: number;
    description: string;
    date: string;
    paymentMethod: string;
    category?: { name: string; color: string; icon?: string } | null;
    client?: { name: string } | null;
    vendor?: { name: string } | null;
    taxAmount?: number;
  };
  onPress?: () => void;
  currency?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  currency = '₹',
}) => {
  const isIncome = transaction.type === 'INCOME';
  const categoryColor = transaction.category?.color || (isIncome ? colors.income : colors.expense);
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  const counterparty = isIncome ? transaction.client?.name : transaction.vendor?.name;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: `${categoryColor}15` }]}>
        <Ionicons
          name={isIncome ? 'arrow-down-circle' : 'arrow-up-circle'}
          size={24}
          color={categoryColor}
        />
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <View style={styles.subRow}>
          <Text style={styles.categoryName}>
            {transaction.category?.name || 'General'}
          </Text>
          {counterparty ? (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.counterparty} numberOfLines={1}>
                {counterparty}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.amountBox}>
        <Text style={[styles.amountText, isIncome ? styles.incomeText : styles.expenseText]}>
          {isIncome ? '+' : '-'}{currency}{transaction.amount.toLocaleString('en-IN')}
        </Text>
        <View style={styles.badgeRow}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <View style={styles.methodBadge}>
            <Text style={styles.methodText}>{transaction.paymentMethod}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsBox: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dot: {
    marginHorizontal: 4,
    color: colors.textMuted,
    fontSize: 10,
  },
  counterparty: {
    fontSize: 12,
    color: colors.textMuted,
    flexShrink: 1,
  },
  amountBox: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  incomeText: {
    color: colors.income,
  },
  expenseText: {
    color: colors.expense,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
    marginRight: 6,
  },
  methodBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  methodText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
