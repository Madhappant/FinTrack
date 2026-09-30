import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stitchTheme } from '../theme/stitchTheme';

interface BudgetAlarmBannerProps {
  spent: number;
  ceiling: number;
  scope: string;
  onAdjustCap?: () => void;
}

export const BudgetAlarmBanner: React.FC<BudgetAlarmBannerProps> = ({
  spent,
  ceiling,
  scope,
  onAdjustCap,
}) => {
  const [detailsModal, setDetailsModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || ceiling <= 0 || spent < ceiling) {
    return null;
  }

  const overrun = spent - ceiling;

  return (
    <>
      <TouchableOpacity
        style={styles.banner}
        activeOpacity={0.9}
        onPress={() => setDetailsModal(true)}
      >
        <View style={styles.alarmIconSquare}>
          <Ionicons name="notifications" size={20} color="#FFFFFF" />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.bannerTitle}>🚨 MONTHLY EXPENSE ALARM!</Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>BREACHED</Text>
            </View>
          </View>
          <Text style={styles.bannerMessage} numberOfLines={2}>
            Your {scope} spending of ₹{spent.toLocaleString('en-IN')} has exceeded your set cap of ₹{ceiling.toLocaleString('en-IN')} by ₹{overrun.toLocaleString('en-IN')}!
          </Text>
        </View>

        <TouchableOpacity onPress={() => setDismissed(true)} style={styles.closeBtn}>
          <Ionicons name="close" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Alarm Details Modal */}
      <Modal visible={detailsModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalAlarmHeader}>
              <View style={styles.bellLarge}>
                <Ionicons name="alert-circle" size={36} color="#DC2626" />
              </View>
              <Text style={styles.modalHeading}>Budget Ceiling Overrun</Text>
              <Text style={styles.modalSub}>
                Monthly expense set in week 1 has been surpassed.
              </Text>
            </View>

            <View style={styles.statSplit}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Configured Cap</Text>
                <Text style={styles.statVal}>₹{ceiling.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Current Spent</Text>
                <Text style={[styles.statVal, { color: '#DC2626' }]}>
                  ₹{spent.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <View style={styles.overrunRow}>
              <Text style={styles.overrunLabel}>Overrun Deficit:</Text>
              <Text style={styles.overrunVal}>+₹{overrun.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.modalBtnRow}>
              {onAdjustCap && (
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => {
                    setDetailsModal(false);
                    onAdjustCap();
                  }}
                >
                  <Text style={styles.adjustBtnText}>Adjust Monthly Cap</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.ackBtn}
                onPress={() => {
                  setDetailsModal(false);
                  setDismissed(true);
                }}
              >
                <Text style={styles.ackBtnText}>Acknowledge Alarm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  alarmIconSquare: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerMessage: {
    fontSize: 11,
    color: '#FEF2F2',
    marginTop: 2,
    lineHeight: 15,
  },
  closeBtn: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
  },
  modalAlarmHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bellLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  statSplit: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  overrunRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  overrunLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
  },
  overrunVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
  },
  modalBtnRow: {
    gap: 8,
  },
  adjustBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  adjustBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  ackBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ackBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
});
