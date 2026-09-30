import React from 'react';
import { View, StyleSheet } from 'react-native';
import { stitchTheme } from '../theme/stitchTheme';

interface PinSlotsProps {
  pinLength: number;
  maxLength?: number;
}

export const PinSlots: React.FC<PinSlotsProps> = ({ pinLength, maxLength = 4 }) => {
  const slots = Array.from({ length: maxLength });

  return (
    <View style={styles.container}>
      {slots.map((_, i) => {
        const isFilled = i < pinLength;
        const isActive = i === pinLength;

        return (
          <View
            key={i}
            style={[
              styles.slot,
              isFilled && styles.slotFilled,
              isActive && styles.slotActive,
            ]}
          >
            {isActive && <View style={styles.activeDot} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 20,
  },
  slot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotFilled: {
    backgroundColor: stitchTheme.colors.primaryContainer,
    transform: [{ scale: 1.1 }],
  },
  slotActive: {
    borderWidth: 1.5,
    borderColor: stitchTheme.colors.secondary,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: stitchTheme.colors.secondary,
  },
});
