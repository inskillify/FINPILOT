import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TransactionItem from '../components/TransactionItem';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const TransactionsScreen = () => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const transactions = [
    { id: '1', title: 'Grocery Store', category: 'Food', amount: -2500, date: '25 Nov 2025', type: 'expense' as const },
    { id: '2', title: 'Salary Credit', category: 'Income', amount: 45000, date: '24 Nov 2025', type: 'income' as const },
    { id: '3', title: 'Electric Bill', category: 'Utilities', amount: -1200, date: '23 Nov 2025', type: 'expense' as const },
    { id: '4', title: 'Restaurant', category: 'Food', amount: -850, date: '23 Nov 2025', type: 'expense' as const },
    { id: '5', title: 'Freelance Payment', category: 'Income', amount: 15000, date: '22 Nov 2025', type: 'income' as const },
    { id: '6', title: 'Uber Ride', category: 'Transport', amount: -320, date: '22 Nov 2025', type: 'expense' as const },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'income' && styles.filterButtonActive]}
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.filterTextActive]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'expense' && styles.filterButtonActive]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.filterTextActive]}>Expense</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.dateHeader}>November 2025</Text>
        {filteredTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            title={transaction.title}
            category={transaction.category}
            amount={transaction.amount}
            date={transaction.date}
            type={transaction.type}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.black,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  dateHeader: {
    ...typography.bodyBold,
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default TransactionsScreen;