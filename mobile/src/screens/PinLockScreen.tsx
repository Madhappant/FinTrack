import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSecurity } from '../context/SecurityContext';
import { stitchTheme } from '../theme/stitchTheme';
import { TactileKeypad } from '../components/TactileKeypad';
import { PinSlots } from '../components/PinSlots';

export const PinLockScreen = () => {
  const { unlock, securitySettings } = useSecurity();
  const [pin, setPin] = useState('');
  const [errorCount, setErrorCount] = useState(0);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);

      if (nextPin.length === 4) {
        // Evaluate PIN
        setTimeout(() => {
          const success = unlock(nextPin);
          if (!success) {
            setErrorCount((prev) => prev + 1);
            Alert.alert('Incorrect PIN', 'The Master PIN entered is incorrect. Default is 1234.');
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <View style={styles.container}>
      {/* Top Security Hardware Status */}
      <View style={styles.topStatus}>
        <View style={styles.pulseDot}>
          <View style={styles.pulseInner} />
        </View>
        <Ionicons name="shield-checkmark" size={14} color={stitchTheme.colors.income} />
        <Text style={styles.hardwareText}>Hardware KeyStore · AES-256 GCM</Text>
      </View>

      {/* Vault Shield Glyph */}
      <View style={styles.shieldWrapper}>
        <View style={styles.shieldSquare}>
          <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
        </View>
        <View style={styles.keyBadge}>
          <Ionicons name="key" size={12} color={stitchTheme.colors.income} />
        </View>
      </View>

      {/* Header Titles */}
      <Text style={styles.title}>Unlock FinTrack</Text>
      <Text style={styles.subtitle}>
        Enter your 4-digit Master PIN to decrypt your local offline ledger
      </Text>

      {/* Solo Proprietor Identity Pill */}
      <View style={styles.identityPill}>
        <View style={styles.avatarMini}>
          <Text style={styles.avatarMiniText}>
            {securitySettings?.userName ? securitySettings.userName.charAt(0).toUpperCase() : 'O'}
          </Text>
        </View>
        <Text style={styles.identityName}>{securitySettings?.userName || 'Solo Proprietor'}</Text>
        <Text style={styles.identityDot}>•</Text>
        <Text style={styles.identityOrg}>{securitySettings?.businessName || 'Sovereign Ledger'}</Text>
      </View>

      {/* Masked PIN Slots */}
      <PinSlots pinLength={pin.length} />

      {/* Tactile Numeric Keypad */}
      <TactileKeypad
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onClear={handleClear}
      />

      <Text style={styles.footerNote}>
        🔒 100% Offline Air-Gapped Encryption • Zero Cloud Sync
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  topStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 24,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: stitchTheme.colors.income,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  hardwareText: {
    fontSize: 11,
    fontWeight: '700',
    color: stitchTheme.colors.incomeText,
    letterSpacing: 0.5,
  },
  shieldWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  shieldSquare: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: stitchTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: stitchTheme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  keyBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: stitchTheme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: stitchTheme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  identityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
  },
  avatarMini: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: stitchTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  identityName: {
    fontSize: 12,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  identityDot: {
    fontSize: 10,
    color: stitchTheme.colors.textMuted,
  },
  identityOrg: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
  },
  footerNote: {
    fontSize: 11,
    color: stitchTheme.colors.textMuted,
    marginTop: 20,
    textAlign: 'center',
  },
});
