import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSecurity } from '../context/SecurityContext';
import { stitchTheme } from '../theme/stitchTheme';

export const SettingsScreen = ({ navigation }: any) => {
  const {
    isPinEnabled,
    securitySettings,
    togglePinProtection,
    updatePin,
    updateProfileNames,
  } = useSecurity();

  // Profile modal
  const [profileModal, setProfileModal] = useState(false);
  const [userName, setUserName] = useState(securitySettings?.userName || '');
  const [businessName, setBusinessName] = useState(securitySettings?.businessName || '');

  // Change PIN modal
  const [pinModal, setPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');

  // Alerts
  const [budgetAlert, setBudgetAlert] = useState(true);
  const [dailyWarning, setDailyWarning] = useState(true);

  const handleSaveProfile = async () => {
    await updateProfileNames(userName.trim(), businessName.trim());
    setProfileModal(false);
    Alert.alert('Updated', 'Profile and ledger details saved locally.');
  };

  const handleSavePin = async () => {
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit numeric PIN.');
      return;
    }
    await updatePin(newPin);
    setPinModal(false);
    setNewPin('');
    Alert.alert('PIN Updated', 'New Master PIN has been set.');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings & Security</Text>
        <Text style={styles.headerSub}>Offline Vault & Preferences</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {securitySettings?.userName ? securitySettings.userName.charAt(0).toUpperCase() : 'O'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{securitySettings?.userName || 'Solo Proprietor'}</Text>
            <Text style={styles.businessTitle}>{securitySettings?.businessName || 'Sovereign Ledger'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => {
              setUserName(securitySettings?.userName || '');
              setBusinessName(securitySettings?.businessName || '');
              setProfileModal(true);
            }}
          >
            <Ionicons name="create-outline" size={18} color={stitchTheme.colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Security Settings Section */}
        <Text style={styles.sectionTitle}>Security & Privacy (Hardware KeyStore)</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: stitchTheme.colors.surfaceContainerLow }]}>
              <Ionicons name="key-outline" size={18} color={stitchTheme.colors.primary} />
            </View>
            <View>
              <Text style={styles.settingLabel}>4-Digit Master PIN Lock</Text>
              <Text style={styles.settingSub}>Require PIN when opening FinTrack</Text>
            </View>
          </View>
          <Switch
            value={isPinEnabled}
            onValueChange={(val) => togglePinProtection(val)}
            trackColor={{ false: '#E2E8F0', true: stitchTheme.colors.secondary }}
          />
        </View>

        {isPinEnabled && (
          <TouchableOpacity style={styles.settingRow} onPress={() => setPinModal(true)}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: stitchTheme.colors.surfaceContainerLow }]}>
                <Ionicons name="lock-closed-outline" size={18} color={stitchTheme.colors.secondary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Change Master PIN</Text>
                <Text style={styles.settingSub}>Current: ••••</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={stitchTheme.colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Navigation Shortcuts to Key Modules */}
        <Text style={styles.sectionTitle}>Ledger Customization</Text>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation?.navigate('CategoryManagement')}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: stitchTheme.colors.surfaceContainerLow }]}>
              <Ionicons name="pricetags-outline" size={18} color={stitchTheme.colors.primary} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Category Taxonomy</Text>
              <Text style={styles.settingSub}>Manage income & expense tags</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={stitchTheme.colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation?.navigate('BackupVault')}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: stitchTheme.colors.surfaceContainerLow }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={stitchTheme.colors.income} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Offline Data & Vault Backup</Text>
              <Text style={styles.settingSub}>Export snapshots, restore or reset database</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={stitchTheme.colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => navigation?.navigate('Reports')}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: stitchTheme.colors.surfaceContainerLow }]}>
              <Ionicons name="bar-chart-outline" size={18} color={stitchTheme.colors.secondary} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Financial Reports & GST</Text>
              <Text style={styles.settingSub}>Profit & Loss statements and tax telemetry</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={stitchTheme.colors.textMuted} />
        </TouchableOpacity>

        {/* Notifications & Spending Alert Settings */}
        <Text style={styles.sectionTitle}>Spending Alert Thresholds</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: stitchTheme.colors.warningContainer }]}>
              <Ionicons name="alert-circle-outline" size={18} color={stitchTheme.colors.warning} />
            </View>
            <View>
              <Text style={styles.settingLabel}>80% Budget Strain Alert</Text>
              <Text style={styles.settingSub}>Warn when approaching monthly ceiling</Text>
            </View>
          </View>
          <Switch
            value={budgetAlert}
            onValueChange={setBudgetAlert}
            trackColor={{ false: '#E2E8F0', true: stitchTheme.colors.secondary }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: stitchTheme.colors.surfaceContainerLow }]}>
              <Ionicons name="speedometer-outline" size={18} color={stitchTheme.colors.primary} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Safe Velocity Monitor</Text>
              <Text style={styles.settingSub}>Calculate remaining daily allowance</Text>
            </View>
          </View>
          <Switch
            value={dailyWarning}
            onValueChange={setDailyWarning}
            trackColor={{ false: '#E2E8F0', true: stitchTheme.colors.secondary }}
          />
        </View>

        {/* App Info Footer */}
        <View style={styles.appInfoCard}>
          <Text style={styles.appName}>FinTrack · Sovereign Ledger</Text>
          <Text style={styles.appVer}>v1.0.0 • 100% Offline Air-Gapped Engine</Text>
          <Text style={styles.appNotice}>
            Data resides exclusively on this physical device. No telemetry, analytics, or remote tracking.
          </Text>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal visible={profileModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile & Business</Text>
              <TouchableOpacity onPress={() => setProfileModal(false)}>
                <Ionicons name="close" size={22} color={stitchTheme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="e.g. Rajesh Kumar"
            />

            <Text style={styles.inputLabel}>Business / Freelance Brand</Text>
            <TextInput
              style={styles.input}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="e.g. Sugan Digital Tech"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change PIN Modal */}
      <Modal visible={pinModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set 4-Digit Master PIN</Text>
              <TouchableOpacity onPress={() => setPinModal(false)}>
                <Ionicons name="close" size={22} color={stitchTheme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Enter 4 Digits</Text>
            <TextInput
              style={[styles.input, { letterSpacing: 8, textAlign: 'center', fontSize: 24 }]}
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="numeric"
              maxLength={4}
              placeholder="••••"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSavePin}>
              <Text style={styles.saveBtnText}>Save New PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchTheme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: stitchTheme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: stitchTheme.colors.textPrimary,
  },
  headerSub: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: stitchTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  businessTitle: {
    fontSize: 12,
    color: stitchTheme.colors.textSecondary,
    marginTop: 2,
  },
  editProfileBtn: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: stitchTheme.colors.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  settingSub: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    marginTop: 1,
  },
  appInfoCard: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  appVer: {
    fontSize: 11,
    color: stitchTheme.colors.textMuted,
    marginTop: 2,
  },
  appNotice: {
    fontSize: 11,
    color: stitchTheme.colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: stitchTheme.colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: stitchTheme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
