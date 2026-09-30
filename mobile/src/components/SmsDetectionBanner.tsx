import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stitchTheme } from '../theme/stitchTheme';

interface SmsDetectionBannerProps {
  detected: {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    merchant: string;
    detectedCategory: string;
    account: string;
  };
  onConfirm: () => void;
  onDismiss: () => void;
}

export const SmsDetectionBanner: React.FC<SmsDetectionBannerProps> = ({
  detected,
  onConfirm,
  onDismiss,
}) => {
  const isIncome = detected.type === 'INCOME';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <View style={styles.smsIcon}>
            <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>New Transaction Detected</Text>
              <View style={styles.autoBadge}>
                <Text style={styles.autoText}>OFFLINE AUTO</Text>
              </View>
            </View>
            <Text style={styles.smsSnippet} numberOfLines={1}>
              {detected.account}: "{isIncome ? 'credited' : 'debited'} by ₹{detected.amount} at {detected.merchant}..."
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
          <Ionicons name="close" size={18} color={stitchTheme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.tagPill}>
          <Ionicons name="pricetag-outline" size={12} color={stitchTheme.colors.secondary} />
          <Text style={styles.tagText}>{detected.merchant}</Text>
        </View>

        <Text style={[styles.amountText, isIncome ? styles.incomeText : styles.expenseText]}>
          {isIncome ? '+₹' : '−₹'}{detected.amount.toLocaleString('en-IN')}
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
          <Text style={styles.confirmBtnText}>Confirm & Add to Ledger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ignoreBtn} onPress={onDismiss} activeOpacity={0.8}>
          <Text style={styles.ignoreBtnText}>Ignore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    borderRadius: 18,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: stitchTheme.colors.surfaceContainerHighest,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  smsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: stitchTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  autoBadge: {
    backgroundColor: stitchTheme.colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  autoText: {
    fontSize: 9,
    fontWeight: '800',
    color: stitchTheme.colors.secondary,
  },
  smsSnippet: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
    maxWidth: 220,
  },
  closeBtn: {
    padding: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: stitchTheme.colors.textPrimary,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
  },
  incomeText: {
    color: stitchTheme.colors.income,
  },
  expenseText: {
    color: stitchTheme.colors.expense,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchTheme.colors.primary,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  confirmBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ignoreBtn: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  ignoreBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
});
