import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stitchTheme } from '../theme/stitchTheme';

interface TactileKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear?: () => void;
}

const KEYS = [
  { val: '1', sub: ' ' },
  { val: '2', sub: 'ABC' },
  { val: '3', sub: 'DEF' },
  { val: '4', sub: 'GHI' },
  { val: '5', sub: 'JKL' },
  { val: '6', sub: 'MNO' },
  { val: '7', sub: 'PQRS' },
  { val: '8', sub: 'TUV' },
  { val: '9', sub: 'WXYZ' },
];

export const TactileKeypad: React.FC<TactileKeypadProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {KEYS.map((k) => (
          <TouchableOpacity
            key={k.val}
            style={styles.keyBtn}
            onPress={() => onKeyPress(k.val)}
            activeOpacity={0.6}
          >
            <Text style={styles.keyNumber}>{k.val}</Text>
            <Text style={styles.keySub}>{k.sub}</Text>
          </TouchableOpacity>
        ))}

        {/* Bottom row: Clear / Biometric */}
        <TouchableOpacity
          style={styles.utilityBtn}
          onPress={onClear || onBackspace}
          activeOpacity={0.6}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>

        {/* Key 0 */}
        <TouchableOpacity
          style={styles.keyBtn}
          onPress={() => onKeyPress('0')}
          activeOpacity={0.6}
        >
          <Text style={styles.keyNumber}>0</Text>
          <Text style={styles.keySub}>+</Text>
        </TouchableOpacity>

        {/* Backspace */}
        <TouchableOpacity
          style={styles.utilityBtn}
          onPress={onBackspace}
          activeOpacity={0.6}
        >
          <Ionicons name="backspace-outline" size={24} color={stitchTheme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  keyBtn: {
    width: '30%',
    height: 68,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: stitchTheme.colors.borderLight,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  keyNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  keySub: {
    fontSize: 10,
    color: stitchTheme.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 1,
  },
  utilityBtn: {
    width: '30%',
    height: 68,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
});
