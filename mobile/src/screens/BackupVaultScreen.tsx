import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLedger } from '../context/LedgerContext';
import { stitchTheme } from '../theme/stitchTheme';
import { offlineDb } from '../services/offlineDb';

export const BackupVaultScreen = () => {
  const { summary, transactions, categories, subscriptions, invoices, refreshLedger, resetVault } = useLedger();

  const [jsonModalVisible, setJsonModalVisible] = useState(false);
  const [exportedJson, setExportedJson] = useState('');
  const [importJson, setImportJson] = useState('');
  const [importModalVisible, setImportModalVisible] = useState(false);

  const handleExport = async () => {
    const raw = await offlineDb.exportData();
    setExportedJson(raw);
    setJsonModalVisible(true);
  };

  const handleImport = async () => {
    if (!importJson.trim()) {
      Alert.alert('Required', 'Please paste the backup JSON payload.');
      return;
    }
    const success = await offlineDb.importData(importJson.trim());
    if (success) {
      await refreshLedger();
      setImportModalVisible(false);
      setImportJson('');
      Alert.alert('Restored Successfully', 'Offline database restored from snapshot.');
    } else {
      Alert.alert('Error', 'Invalid backup format. Restoration aborted.');
    }
  };

  const handleWipe = () => {
    Alert.alert(
      'Reset Local Database',
      'This will erase all local transactions and restore clean state. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase All',
          style: 'destructive',
          onPress: async () => {
            await resetVault();
            Alert.alert('Database Cleaned', 'All local records wiped.');
          },
        },
      ]
    );
  };

  const totalRecords = transactions.length + categories.length + subscriptions.length + invoices.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Offline Vault</Text>
          <Text style={styles.headerSub}>Air-Gapped AES-256 Storage</Text>
        </View>

        <View style={styles.airGapBadge}>
          <Ionicons name="shield-checkmark" size={13} color={stitchTheme.colors.income} />
          <Text style={styles.airGapText}>100% Air-Gap</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Security Status Card (Navy) */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <View style={styles.heroShieldIcon}>
                <Ionicons name="shield-checkmark" size={20} color={stitchTheme.colors.income} />
              </View>
              <View>
                <Text style={styles.heroPre}>Absolute Air-Gap</Text>
                <Text style={styles.heroHeading}>100% Offline & Private</Text>
              </View>
            </View>

            <View style={styles.zeroSyncPill}>
              <View style={styles.zeroSyncDot} />
              <Text style={styles.zeroSyncText}>Zero Sync</Text>
            </View>
          </View>

          <Text style={styles.heroParagraph}>
            Zero cloud telemetry. All financial ledger entries, budget limits, and audit logs reside strictly on this device's encrypted storage (AES-256 GCM).
          </Text>

          {/* Database Health Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Local Database Engine</Text>
              <View style={styles.statValRow}>
                <Ionicons name="checkmark-circle" size={14} color={stitchTheme.colors.incomeVibrant} />
                <Text style={styles.statVal}>SQLite Vault v4.5</Text>
              </View>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Local Records Count</Text>
              <View style={styles.statValRow}>
                <Ionicons name="server-outline" size={14} color={stitchTheme.colors.primaryFixedDim} />
                <Text style={styles.statVal}>{totalRecords} records stored</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Snapshot Actions */}
        <Text style={styles.sectionTitle}>Snapshot & Backup Tools</Text>

        <TouchableOpacity style={styles.actionRow} onPress={handleExport}>
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: stitchTheme.colors.surfaceContainer }]}>
              <Ionicons name="download-outline" size={20} color={stitchTheme.colors.secondary} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Create Encrypted Snapshot</Text>
              <Text style={styles.actionSub}>Export database backup to secure JSON payload</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={stitchTheme.colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} onPress={() => setImportModalVisible(true)}>
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: stitchTheme.colors.surfaceContainerHigh }]}>
              <Ionicons name="cloud-upload-outline" size={20} color={stitchTheme.colors.primary} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Restore from Snapshot</Text>
              <Text style={styles.actionSub}>Import previously backed up financial snapshot</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={stitchTheme.colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionRow, styles.dangerRow]} onPress={handleWipe}>
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: stitchTheme.colors.expenseContainer }]}>
              <Ionicons name="trash-outline" size={20} color={stitchTheme.colors.expense} />
            </View>
            <View>
              <Text style={[styles.actionTitle, { color: stitchTheme.colors.expense }]}>
                Wipe Local Database
              </Text>
              <Text style={styles.actionSub}>Emergency reset all transactions to clean state</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={stitchTheme.colors.expense} />
        </TouchableOpacity>
      </ScrollView>

      {/* Export JSON Modal */}
      <Modal visible={jsonModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Encrypted Backup Snapshot</Text>
              <TouchableOpacity onPress={() => setJsonModalVisible(false)}>
                <Ionicons name="close" size={22} color={stitchTheme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Copy this raw snapshot to save onto your laptop, external drive, or USB:
            </Text>

            <TextInput
              style={styles.jsonText}
              value={exportedJson}
              editable={false}
              multiline
              numberOfLines={8}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={() => setJsonModalVisible(false)}>
              <Text style={styles.saveBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Import JSON Modal */}
      <Modal visible={importModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Restore Database</Text>
              <TouchableOpacity onPress={() => setImportModalVisible(false)}>
                <Ionicons name="close" size={22} color={stitchTheme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Paste the backup JSON payload below to restore your ledger:
            </Text>

            <TextInput
              style={styles.jsonInput}
              value={importJson}
              onChangeText={setImportJson}
              multiline
              numberOfLines={6}
              placeholder="Paste JSON snapshot here..."
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleImport}>
              <Text style={styles.saveBtnText}>Verify & Restore</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  airGapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  airGapText: {
    fontSize: 10,
    fontWeight: '700',
    color: stitchTheme.colors.incomeText,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: stitchTheme.colors.primary,
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    shadowColor: stitchTheme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroShieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: stitchTheme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPre: {
    fontSize: 10,
    fontWeight: '700',
    color: stitchTheme.colors.incomeVibrant,
    textTransform: 'uppercase',
  },
  heroHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  zeroSyncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  zeroSyncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: stitchTheme.colors.incomeVibrant,
  },
  zeroSyncText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroParagraph: {
    fontSize: 12,
    color: stitchTheme.colors.primaryFixedDim,
    lineHeight: 18,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 10,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: stitchTheme.colors.primaryFixedDim,
    marginBottom: 2,
  },
  statValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  actionSub: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    marginTop: 1,
  },
  dangerRow: {
    borderColor: stitchTheme.colors.expenseContainer,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: stitchTheme.colors.textSecondary,
    marginVertical: 10,
  },
  jsonText: {
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 12,
    padding: 10,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: stitchTheme.colors.textPrimary,
    height: 180,
  },
  jsonInput: {
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    color: stitchTheme.colors.textPrimary,
    height: 120,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: stitchTheme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
