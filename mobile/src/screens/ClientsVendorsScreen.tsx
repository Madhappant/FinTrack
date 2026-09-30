import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export const ClientsVendorsScreen = () => {
  const [tab, setTab] = useState<'CLIENTS' | 'VENDORS'>('CLIENTS');
  const [clients, setClients] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Add modal
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [extraInfo, setExtraInfo] = useState(''); // GST for client, ServiceType for vendor

  const fetchData = useCallback(async () => {
    try {
      const [cRes, vRes] = await Promise.all([api.getClients(), api.getVendors()]);
      setClients(cRes.data.clients || []);
      setVendors(vRes.data.vendors || []);
    } catch (err) {
      console.warn('Failed to load contacts', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSaveContact = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a contact name.');
      return;
    }

    try {
      if (tab === 'CLIENTS') {
        await api.createClient({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          gstNumber: extraInfo.trim(),
        });
      } else {
        await api.createVendor({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          serviceType: extraInfo.trim(),
        });
      }

      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setExtraInfo('');
      setModalVisible(false);
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save contact');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Directory</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="person-add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>
            Add {tab === 'CLIENTS' ? 'Client' : 'Vendor'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Directory Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'CLIENTS' && styles.tabBtnActive]}
          onPress={() => setTab('CLIENTS')}
        >
          <Ionicons
            name="business"
            size={18}
            color={tab === 'CLIENTS' ? '#0F172A' : colors.textMuted}
          />
          <Text style={[styles.tabBtnText, tab === 'CLIENTS' && styles.tabBtnTextActive]}>
            Clients ({clients.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'VENDORS' && styles.tabBtnActive]}
          onPress={() => setTab('VENDORS')}
        >
          <Ionicons
            name="cube"
            size={18}
            color={tab === 'VENDORS' ? '#0F172A' : colors.textMuted}
          />
          <Text style={[styles.tabBtnText, tab === 'VENDORS' && styles.tabBtnTextActive]}>
            Vendors ({vendors.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={tab === 'CLIENTS' ? clients : vendors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name ? item.name.charAt(0).toUpperCase() : 'C'}
                  </Text>
                </View>

                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  {item.company ? (
                    <Text style={styles.companyName}>{item.company}</Text>
                  ) : null}
                </View>

                <View style={styles.amountBadge}>
                  <Text style={styles.amountLabel}>
                    {tab === 'CLIENTS' ? 'Total Revenue' : 'Total Paid'}
                  </Text>
                  <Text
                    style={[
                      styles.amountVal,
                      { color: tab === 'CLIENTS' ? colors.income : colors.expense },
                    ]}
                  >
                    ₹
                    {(tab === 'CLIENTS' ? item.totalEarned : item.totalPaid || 0).toLocaleString(
                      'en-IN'
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.contactDivider} />

              <View style={styles.contactFooter}>
                <View style={styles.contactDetailRow}>
                  {item.phone ? (
                    <View style={styles.detailItem}>
                      <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{item.phone}</Text>
                    </View>
                  ) : null}
                  {item.email ? (
                    <View style={styles.detailItem}>
                      <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{item.email}</Text>
                    </View>
                  ) : null}
                </View>

                {tab === 'CLIENTS' && item.pendingAmount > 0 ? (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>
                      Pending: ₹{item.pendingAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No contacts yet</Text>
              <Text style={styles.emptySub}>
                Add your {tab === 'CLIENTS' ? 'clients to link invoices & income' : 'vendors to track supplier expenses'}.
              </Text>
            </View>
          }
        />
      )}

      {/* Add Contact Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add New {tab === 'CLIENTS' ? 'Client' : 'Vendor'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Contact Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Priya Sundaram"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>Company / Business Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. BluePeak Logistics"
                placeholderTextColor={colors.textMuted}
                value={company}
                onChangeText={setCompany}
              />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="contact@company.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="+91 98765 43210"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>
                {tab === 'CLIENTS' ? 'GST Number (Optional)' : 'Service / Supply Type'}
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder={tab === 'CLIENTS' ? 'e.g. 33AABCT1234F1Z1' : 'e.g. Web Hosting, Office Rent'}
                placeholderTextColor={colors.textMuted}
                value={extraInfo}
                onChangeText={setExtraInfo}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveContact}>
                <Text style={styles.saveBtnText}>Save Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  tabBtnTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  companyName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  amountBadge: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  amountVal: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  contactDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  contactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactDetailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  pendingBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalBody: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
