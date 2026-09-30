import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stitchTheme } from '../theme/stitchTheme';

interface QuickAddChipsProps {
  onAddAmount: (increment: number) => void;
  onClear: () => void;
}

export const QuickAddChips: React.FC<QuickAddChipsProps> = ({ onAddAmount, onClear }) => {
  const CHIPS = [100, 500, 1000, 5000];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {CHIPS.map((amt) => (
          <TouchableOpacity
            key={amt}
            style={styles.chip}
            onPress={() => onAddAmount(amt)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipText}>+₹{amt.toLocaleString('en-IN')}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.backspaceChip} onPress={onClear} activeOpacity={0.7}>
          <Ionicons name="backspace-outline" size={16} color={stitchTheme.colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: stitchTheme.colors.borderLight,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  backspaceChip: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
