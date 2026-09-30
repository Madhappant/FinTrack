import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stitchTheme } from '../theme/stitchTheme';

interface ScopeSwitcherProps {
  currentScope: 'ALL' | 'PERSONAL' | 'BUSINESS';
  onSelect: (scope: 'ALL' | 'PERSONAL' | 'BUSINESS') => void;
  showAll?: boolean;
}

export const ScopeSwitcher: React.FC<ScopeSwitcherProps> = ({
  currentScope,
  onSelect,
  showAll = true,
}) => {
  return (
    <View style={styles.container}>
      {showAll && (
        <TouchableOpacity
          style={[styles.segmentBtn, currentScope === 'ALL' && styles.segmentBtnActive]}
          onPress={() => onSelect('ALL')}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.segmentText, currentScope === 'ALL' && styles.segmentTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.segmentBtn, currentScope === 'PERSONAL' && styles.segmentBtnActive]}
        onPress={() => onSelect('PERSONAL')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="person-outline"
          size={14}
          color={currentScope === 'PERSONAL' ? stitchTheme.colors.primary : stitchTheme.colors.textMuted}
        />
        <Text
          style={[
            styles.segmentText,
            currentScope === 'PERSONAL' && styles.segmentTextActive,
          ]}
        >
          Personal
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.segmentBtn, currentScope === 'BUSINESS' && styles.segmentBtnActive]}
        onPress={() => onSelect('BUSINESS')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="briefcase-outline"
          size={14}
          color={currentScope === 'BUSINESS' ? stitchTheme.colors.primary : stitchTheme.colors.textMuted}
        />
        <Text
          style={[
            styles.segmentText,
            currentScope === 'BUSINESS' && styles.segmentTextActive,
          ]}
        >
          Business
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    borderRadius: 14,
    padding: 3,
    alignSelf: 'flex-start',
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  segmentTextActive: {
    color: stitchTheme.colors.textPrimary,
    fontWeight: '700',
  },
});
