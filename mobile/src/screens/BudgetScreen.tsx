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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLedger } from '../context/LedgerContext';
import { stitchTheme } from '../theme/stitchTheme';

export const BudgetScreen = () => {
  const { budgetStatus, scope, setScope, setMonthlyCeiling } = useLedger();

  const [modalVisible, setModalVisible] = useState(false);
  const [newCeiling, setNewCeiling] = useState(String(budgetStatus.ceiling));

  const handleSaveCeiling = async () => {
    const val = parseFloat(newCeiling);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Invalid Ceiling', 'Please enter a valid monthly budget limit.');
      return;
    }
    await setMonthlyCeiling(val);
    setModalVisible(false);
  };

  const isWarning = budgetStatus.percentage >= 80;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Monthly Budget</Text>
          <Text style={styles.headerSub}>Flexible Spending Cap & Velocity</Text>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setNewCeiling(String(budgetStatus.ceiling));
            setModalVisible(true);
          }}
        >
          <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          <Text style={styles.editBtnText}>Edit Cap</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Scope Tabs: Overall / Personal / Business */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, scope === 'ALL' && styles.tabBtnActive]}
            onPress={() => setScope('ALL')}
          >
            <Text style={[styles.tabBtnText, scope === 'ALL' && styles.tabBtnTextActive]}>
              Overall
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, scope === 'PERSONAL' && styles.tabBtnActive]}
            onPress={() => setScope('PERSONAL')}
          >
            <Text style={[styles.tabBtnText, scope === 'PERSONAL' && styles.tabBtnTextActive]}>
              Personal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, scope === 'BUSINESS' && styles.tabBtnActive]}
            onPress={() => setScope('BUSINESS')}
          >
            <Text style={[styles.tabBtnText, scope === 'BUSINESS' && styles.tabBtnTextActive]}>
              Business
            </Text>
          </TouchableOpacity>
        </View>

        {/* High-Impact Hero Budget Card (Navy) */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.alarmRow}>
              <View
                style={[
                  styles.pulseDot,
                  { backgroundColor: isWarning ? '#FBBF24' : stitchTheme.colors.incomeVibrant },
                ]}
              />
              <Text style={styles.alarmText}>
                {isWarning ? 'Spending Alarm Active' : 'Within Safe Range'}
              </Text>
            </View>

            <View style={styles.daysPill}>
              <Text style={styles.daysText}>{budgetStatus.daysLeft} Days Left</Text>
            </View>
          </View>

          {/* Main Visual Stat & Gauge */}
          <View style={styles.gaugeRow}>
            <View>
              <Text style={styles.spentLabel}>Spent This Month</Text>
              <Text style={styles.spentAmount}>₹{budgetStatus.spent.toLocaleString('en-IN')}</Text>
              <Text style={styles.ceilingLabel}>
                of ₹{budgetStatus.ceiling.toLocaleString('en-IN')} monthly cap
              </Text>
            </View>

            <View style={styles.circleGauge}>
              <Text style={styles.percentageText}>{budgetStatus.percentage}%</Text>
              <Text style={styles.utilLabel}>UTILIZED</Text>
            </View>
          </View>

          {/* Key Figure Metrics */}
          <View style={styles.keyGrid}>
            <View style={styles.keyBox}>
              <Text style={styles.keyBoxLabel}>Remaining Buffer</Text>
              <Text style={[styles.keyBoxVal, { color: stitchTheme.colors.incomeVibrant }]}>
                ₹{budgetStatus.remainingBuffer.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.keyBox}>
              <Text style={styles.keyBoxLabel}>Safe Daily Velocity</Text>
              <Text style={[styles.keyBoxVal, { color: stitchTheme.colors.secondaryLight }]}>
                ₹{budgetStatus.dailySafeSpend}/day
              </Text>
            </View>
          </View>
        </View>

        {/* Category Budget Recommendations */}
        <Text style={styles.sectionTitle}>Category Spending Allocation</Text>

        {[
          { name: 'Fuel & Travel', icon: 'car-outline', defaultAlloc: '15%' },
          { name: 'Food & Dining', icon: 'restaurant-outline', defaultAlloc: '25%' },
          { name: 'Rent & Office', icon: 'business-outline', defaultAlloc: '30%' },
          { name: 'Utilities & Bills', icon: 'flash-outline', defaultAlloc: '10%' },
          { name: 'Software & Hosting', icon: 'server-outline', defaultAlloc: '12%' },
        ].map((item, idx) => (
          <View key={idx} style={styles.catCard}>
            <View style={styles.catLeft}>
              <View style={styles.catIconSquare}>
                <Ionicons name={item.icon as any} size={18} color={stitchTheme.colors.primary} />
              </View>
              <View>
                <Text style={styles.catTitle}>{item.name}</Text>
                <Text style={styles.catSub}>Suggested allocation: {item.defaultAlloc}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={stitchTheme.colors.textMuted} />
          </View>
        ))}
      </ScrollView>

      {/* Edit Ceiling Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set {scope} Budget Cap</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={stitchTheme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Enter your monthly spending threshold limit in Rupees (₹):
            </Text>

            <TextInput
              style={styles.input}
              value={newCeiling}
              onChangeText={setNewCeiling}
              keyboardType="numeric"
              placeholder="e.g. 50000"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCeiling}>
              <Text style={styles.saveBtnText}>Update Monthly Cap</Text>
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
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: stitchTheme.colors.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    marginBottom: 12,
  },
  alarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alarmText: {
    fontSize: 11,
    fontWeight: '700',
    color: stitchTheme.colors.primaryFixed,
    textTransform: 'uppercase',
  },
  daysPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  daysText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gaugeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  spentLabel: {
    fontSize: 12,
    color: stitchTheme.colors.primaryFixedDim,
  },
  spentAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  ceilingLabel: {
    fontSize: 12,
    color: stitchTheme.colors.primaryFixedDim,
  },
  circleGauge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  utilLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: stitchTheme.colors.primaryFixedDim,
  },
  keyGrid: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 14,
    marginTop: 12,
  },
  keyBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 10,
  },
  keyBoxLabel: {
    fontSize: 11,
    color: stitchTheme.colors.primaryFixedDim,
    marginBottom: 4,
  },
  keyBoxVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
    marginBottom: 10,
  },
  catCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catIconSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  catSub: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
    marginTop: 1,
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
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: stitchTheme.colors.textSecondary,
    marginVertical: 10,
  },
  input: {
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: stitchTheme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
