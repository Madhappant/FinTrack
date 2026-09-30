import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface StatCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor?: string;
  currency?: string;
  isNegative?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  subtitle,
  iconName,
  iconColor,
  bgColor = '#F8FAFC',
  currency = '₹',
  isNegative = false,
}) => {
  const formattedAmount = `${currency}${amount.toLocaleString('en-IN')}`;

  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconCircle, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
      </View>
      <Text style={[styles.amount, isNegative && styles.negativeText]}>
        {formattedAmount}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  negativeText: {
    color: colors.expense,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
