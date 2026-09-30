import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLedger } from '../context/LedgerContext';
import { stitchTheme } from '../theme/stitchTheme';

export const TransactionsScreen = ({ navigation }: any) => {
  const { transactions, deleteTransaction, scope, setScope } = useLedger();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
    if (scope !== 'ALL' && t.scope !== scope) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchNotes = t.notes ? t.notes.toLowerCase().includes(q) : false;
      const matchInv = t.invoiceNumber ? t.invoiceNumber.toLowerCase().includes(q) : false;
      return matchDesc || matchNotes || matchInv;
    }
    return true;
  });

  const handleDelete = (id: string, desc: string) => {
    Alert.alert('Delete Entry', `Are you sure you want to delete "${desc}" from the ledger?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Transactions Ledger</Text>
          <Text style={styles.headerSub}>Real-time local balance & audit</Text>
        </View>

        <View style={styles.vaultTag}>
          <Ionicons name="shield-checkmark" size={13} color={stitchTheme.colors.income} />
          <Text style={styles.vaultTagText}>Vault Active</Text>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={stitchTheme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search payee, category, note..."
          placeholderTextColor={stitchTheme.colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={stitchTheme.colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Chips Row */}
      <View style={styles.filterScroll}>
        <TouchableOpacity
          style={[styles.chip, typeFilter === 'ALL' && styles.chipActive]}
          onPress={() => setTypeFilter('ALL')}
        >
          <Text style={[styles.chipText, typeFilter === 'ALL' && styles.chipTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, typeFilter === 'INCOME' && styles.chipActive]}
          onPress={() => setTypeFilter('INCOME')}
        >
          <Ionicons
            name="arrow-down"
            size={12}
            color={typeFilter === 'INCOME' ? '#FFFFFF' : stitchTheme.colors.income}
          />
          <Text style={[styles.chipText, typeFilter === 'INCOME' && styles.chipTextActive]}>
            Income
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, typeFilter === 'EXPENSE' && styles.chipActive]}
          onPress={() => setTypeFilter('EXPENSE')}
        >
          <Ionicons
            name="arrow-up"
            size={12}
            color={typeFilter === 'EXPENSE' ? '#FFFFFF' : stitchTheme.colors.expense}
          />
          <Text style={[styles.chipText, typeFilter === 'EXPENSE' && styles.chipTextActive]}>
            Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, scope === 'PERSONAL' && styles.chipActive]}
          onPress={() => setScope(scope === 'PERSONAL' ? 'ALL' : 'PERSONAL')}
        >
          <Text style={[styles.chipText, scope === 'PERSONAL' && styles.chipTextActive]}>
            Personal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, scope === 'BUSINESS' && styles.chipActive]}
          onPress={() => setScope(scope === 'BUSINESS' ? 'ALL' : 'BUSINESS')}
        >
          <Text style={[styles.chipText, scope === 'BUSINESS' && styles.chipTextActive]}>
            Business
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isIncome = item.type === 'INCOME';
          return (
            <View style={styles.txCard}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isIncome
                      ? stitchTheme.colors.incomeContainer
                      : stitchTheme.colors.expenseContainer,
                  },
                ]}
              >
                <Ionicons
                  name={isIncome ? 'arrow-down' : 'arrow-up'}
                  size={18}
                  color={isIncome ? stitchTheme.colors.income : stitchTheme.colors.expense}
                />
              </View>

              <View style={styles.middleInfo}>
                <Text style={styles.txTitle} numberOfLines={1}>
                  {item.description}
                </Text>
                <View style={styles.subMeta}>
                  <View style={styles.scopeBadge}>
                    <Text style={styles.scopeBadgeText}>{item.scope}</Text>
                  </View>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.methodText}>{item.paymentMethod}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.dateText}>
                    {new Date(item.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
              </View>

              <View style={styles.rightBox}>
                <Text
                  style={[
                    styles.txAmount,
                    { color: isIncome ? stitchTheme.colors.income : stitchTheme.colors.expense },
                  ]}
                >
                  {isIncome ? '+₹' : '−₹'}
                  {item.amount.toLocaleString('en-IN')}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.description)}
                  style={styles.trashBtn}
                >
                  <Ionicons name="trash-outline" size={14} color={stitchTheme.colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="documents-outline" size={48} color={stitchTheme.colors.textMuted} />
            <Text style={styles.emptyTitle}>Zero Ledger Records</Text>
            <Text style={styles.emptySub}>
              No transactions match this filter. Tap the "+ Add" button to record a new entry.
            </Text>
          </View>
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation?.navigate('AddTransaction')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
  vaultTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stitchTheme.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  vaultTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: stitchTheme.colors.incomeText,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: stitchTheme.colors.textPrimary,
  },
  filterScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: stitchTheme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  chipActive: {
    backgroundColor: stitchTheme.colors.primary,
    borderColor: stitchTheme.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: stitchTheme.colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: stitchTheme.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  middleInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
    marginBottom: 2,
  },
  subMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scopeBadge: {
    backgroundColor: stitchTheme.colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  scopeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: stitchTheme.colors.secondary,
  },
  metaDot: {
    marginHorizontal: 4,
    color: stitchTheme.colors.textMuted,
    fontSize: 9,
  },
  methodText: {
    fontSize: 11,
    color: stitchTheme.colors.textSecondary,
  },
  dateText: {
    fontSize: 11,
    color: stitchTheme.colors.textMuted,
  },
  rightBox: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  trashBtn: {
    padding: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: stitchTheme.colors.textPrimary,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: stitchTheme.colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: stitchTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: stitchTheme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
