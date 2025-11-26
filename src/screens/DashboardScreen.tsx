import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const DashboardScreen = () => {
  const recentTransactions = [
    { id: '1', title: 'Grocery Store', category: 'Food', amount: -2500, date: '25 Nov', type: 'expense' as const },
    { id: '2', title: 'Salary Credit', category: 'Income', amount: 45000, date: '24 Nov', type: 'income' as const },
    { id: '3', title: 'Electric Bill', category: 'Utilities', amount: -1200, date: '23 Nov', type: 'expense' as const },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <BalanceCard balance={58720.76} />

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statValue}>₹12,279</Text>
          <Text style={styles.statChange}>+12.5%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Savings</Text>
          <Text style={styles.statValue}>₹32,720</Text>
          <Text style={styles.statChange}>+8.2%</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {recentTransactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          title={transaction.title}
          category={transaction.category}
          amount={transaction.amount}
          date={transaction.date}
          type={transaction.type}
        />
      ))}

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Add Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="analytics" size={24} color={colors.primary} />
          <Text style={styles.actionText}>View Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  statChange: {
    ...typography.small,
    color: colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  seeAll: {
    ...typography.caption,
    color: colors.primary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    ...typography.caption,
    color: colors.text,
    marginLeft: 8,
  },
});

export default DashboardScreen;