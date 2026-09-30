import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stitchTheme } from '../theme/stitchTheme';

interface BudgetMeterProps {
  spent: number;
  ceiling: number;
  percentage: number;
  remainingBuffer: number;
  dailySafeSpend: number;
}

export const BudgetMeter: React.FC<BudgetMeterProps> = ({
  spent,
  ceiling,
  percentage,
  remainingBuffer,
  dailySafeSpend,
}) => {
  const isWarning = percentage >= 80;
  const isExceeded = percentage >= 100;

  let badgeBg = stitchTheme.colors.surfaceContainer;
  let badgeText = stitchTheme.colors.secondary;
  if (isExceeded) {
    badgeBg = stitchTheme.colors.expenseContainer;
    badgeText = stitchTheme.colors.expense;
  } else if (isWarning) {
    badgeBg = stitchTheme.colors.warningContainer;
    badgeText = stitchTheme.colors.warning;
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconTitle}>
          <View style={styles.iconCircle}>
            <Ionicons name="wallet-outline" size={18} color={stitchTheme.colors.primary} />
          </View>
          <View>
            <Text style={styles.title}>Monthly Budget</Text>
            <Text style={styles.subtitle}>Flexible Spending Cap</Text>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeLabel, { color: badgeText }]}>{percentage}% Used</Text>
        </View>
      </View>

      <View style={styles.numbersRow}>
        <Text style={styles.spentText}>
          ₹{spent.toLocaleString('en-IN')}{' '}
          <Text style={styles.ceilingText}>of ₹{ceiling.toLocaleString('en-IN')}</Text>
        </Text>
        <Text style={styles.bufferText}>₹{remainingBuffer.toLocaleString('en-IN')} buffer</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isExceeded
                ? stitchTheme.colors.expense
                : isWarning
                ? stitchTheme.colors.warning
                : stitchTheme.colors.secondary,
            },
          ]}
        />
      </View>

      <View style={styles.bottomMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="speedometer-outline" size={13} color={stitchTheme.colors.textMuted} />
          <Text style={styles.metaText}>Safe Velocity: ₹{dailySafeSpend}/day</Text>
        </View>
        {isWarning ? (
          <View style={styles.alertPill}>
            <Ionicons name="alert-circle" size={12} color={stitchTheme.colors.warning} />
            <Text style={styles.alertPillText}>Limit Approaching</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  numbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 12,
    marginBottom: 6,
  },
  spentText: {
    fontSize: 16,
    fontWeight: '800',
    color: stitchTheme.colors.textPrimary,
  },
  ceilingText: {
    fontSize: 12,
    fontWeight: '500',
    color: stitchTheme.colors.textMuted,
  },
  bufferText: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.income,
  },
  track: {
    height: 8,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  bottomMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    fontWeight: '500',
  },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  alertPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: stitchTheme.colors.warning,
  },
});
