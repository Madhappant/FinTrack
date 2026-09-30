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

export const CategoryManagementScreen = () => {
  const { categories, addCategory, deleteCategory } = useLedger();

  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#316BF3');
  const [icon, setIcon] = useState('pricetag-outline');

  const filtered = categories.filter((c) => c.type === activeTab);

  const handleSaveCategory = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a category name.');
      return;
    }
    await addCategory({
      name: name.trim(),
      type: activeTab,
      color,
      icon,
    });
    setName('');
    setModalVisible(false);
  };

  const handleDelete = (id: string, isDefault: boolean, catName: string) => {
    if (isDefault) {
      Alert.alert('System Category', 'System default categories cannot be removed.');
      return;
    }
    Alert.alert('Delete Category', `Are you sure you want to remove "${catName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Category Taxonomy</Text>
          <Text style={styles.headerSub}>Organize & tune custom ledger tags</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>New Tag</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tab Switcher: Expenses vs Income */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'EXPENSE' && styles.tabBtnActive]}
            onPress={() => setActiveTab('EXPENSE')}
          >
            <Ionicons
              name="arrow-up"
              size={14}
              color={activeTab === 'EXPENSE' ? '#FFFFFF' : stitchTheme.colors.expense}
            />
            <Text style={[styles.tabBtnText, activeTab === 'EXPENSE' && styles.tabBtnTextActive]}>
              Expenses ({categories.filter((c) => c.type === 'EXPENSE').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'INCOME' && styles.tabBtnActive]}
            onPress={() => setActiveTab('INCOME')}
          >
            <Ionicons
              name="arrow-down"
              size={14}
              color={activeTab === 'INCOME' ? '#FFFFFF' : stitchTheme.colors.income}
            />
            <Text style={[styles.tabBtnText, activeTab === 'INCOME' && styles.tabBtnTextActive]}>
              Income ({categories.filter((c) => c.type === 'INCOME').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Most Active Ledger Tag Card */}
        <View style={styles.highlightCard}>
          <View style={styles.highlightLeft}>
            <View style={styles.highlightIconSquare}>
              <Ionicons name="flame" size={22} color={stitchTheme.colors.secondary} />
            </View>
            <View>
              <Text style={styles.highlightLabel}>Active Ledger Presets</Text>
              <Text style={styles.highlightTitle}>
                {activeTab === 'EXPENSE' ? 'Fuel, Food & Office' : 'Retainers & Projects'}
              </Text>
              <Text style={styles.highlightSub}>Offline auto-tagging ready</Text>
            </View>
          </View>
        </View>

        {/* Categories List */}
        <Text style={styles.sectionTitle}>Registered Tags</Text>
        {filtered.map((cat) => (
          <View key={cat.id} style={styles.catRow}>
            <View style={styles.catLeft}>
              <View style={[styles.catIconBox, { backgroundColor: `${cat.color}20` }]}>
                <Ionicons name={cat.icon as any} size={18} color={cat.color} />
              </View>
              <View>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catStatus}>
                  {cat.isDefault ? 'Standard System Tag' : 'Custom Tag'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleDelete(cat.id, cat.isDefault, cat.name)}
              style={styles.delBtn}
            >
              <Ionicons
                name={cat.isDefault ? 'lock-closed-outline' : 'trash-outline'}
                size={16}
                color={stitchTheme.colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add Custom Category Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add {activeTab === 'EXPENSE' ? 'Expense' : 'Income'} Tag
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={stitchTheme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Category Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Client Entertainment, Gym, Equipment"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Pick Color</Text>
            <View style={styles.colorRow}>
              {['#316BF3', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'].map((col) => (
                <TouchableOpacity
                  key={col}
                  style={[
                    styles.colorDot,
                    { backgroundColor: col },
                    color === col && styles.colorDotActive,
                  ]}
                  onPress={() => setColor(col)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCategory}>
              <Text style={styles.saveBtnText}>Save Category</Text>
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: {
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
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: stitchTheme.colors.primary,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  highlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    marginBottom: 16,
  },
  highlightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightIconSquare: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: stitchTheme.colors.textMuted,
    textTransform: 'uppercase',
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  highlightSub: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
    marginBottom: 10,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: stitchTheme.colors.borderLight,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: {
    fontSize: 13,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
  },
  catStatus: {
    fontSize: 11,
    color: stitchTheme.colors.textMuted,
    marginTop: 1,
  },
  delBtn: {
    padding: 6,
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
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  colorDotActive: {
    borderWidth: 3,
    borderColor: '#0F172A',
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
