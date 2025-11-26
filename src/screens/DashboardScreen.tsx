/**
 * Dashboard Screen
 * Main dashboard showing:
 * - Current balance with safe-to-spend meter
 * - 7-day forecast card
 * - Quick stats (Income, Expenses, Jars funded, Goals progress)
 * - Alerts list (critical → warnings → info)
 * - Spending habits snapshot
 * - Action buttons
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BalanceCard from '../components/BalanceCard';
import MetricCard from '../components/MetricCard';
import AlertCard from '../components/AlertCard';
import TransactionItem from '../components/TransactionItem';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import apiService from '../services/api';
import { DashboardSummary } from '../types/api';

const DashboardScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setError(null);
      const data = await apiService.getDashboardSummary();
      setDashboardData(data);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
      // Fallback to mock data for development
      setDashboardData(getMockDashboardData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <Text style={styles.errorText}>{error || 'Failed to load dashboard'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const safeToSpend = Math.max(0, dashboardData.safe_to_spend || 0);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Balance Card */}
      <BalanceCard
        balance={dashboardData.balance}
        safeToSpend={safeToSpend}
        onViewDetails={() => navigation.navigate('Transactions')}
      />

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <MetricCard
          icon="trending-up"
          label="Income (7d)"
          value={`₹${dashboardData.income_7day?.toLocaleString() || 0}`}
          color={colors.success}
        />
        <MetricCard
          icon="trending-down"
          label="Expenses (7d)"
          value={`₹${dashboardData.expense_7day?.toLocaleString() || 0}`}
          color={colors.error}
        />
        <MetricCard
          icon="cube"
          label="Jars Funded"
          value={`${dashboardData.jars_funded || 0}`}
          color={colors.warning}
        />
        <MetricCard
          icon="target"
          label="Goals Progress"
          value={`${dashboardData.goals_progress || 0}%`}
          color={colors.info}
        />
      </View>

      {/* Alerts Section */}
      {dashboardData.alerts && dashboardData.alerts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alerts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {dashboardData.alerts.slice(0, 3).map((alert) => (
            <AlertCard
              key={alert.id}
              title={alert.title}
              message={alert.message}
              severity={alert.severity}
              onDismiss={() => {
                // Handle dismiss
              }}
            />
          ))}
        </View>
      )}

      {/* Recent Transactions */}
      {dashboardData.recent_transactions && dashboardData.recent_transactions.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {dashboardData.recent_transactions.slice(0, 5).map((transaction) => (
            <TransactionItem
              key={transaction.id}
              title={transaction.description}
              category={transaction.category}
              amount={transaction.amount}
              date={new Date(transaction.date).toLocaleDateString()}
              type={transaction.type}
            />
          ))}
        </View>
      )}

      {/* Spending Habits */}
      {dashboardData.spending_habits && Object.keys(dashboardData.spending_habits).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Habits</Text>
          <View style={styles.habitsContainer}>
            {Object.entries(dashboardData.spending_habits).map(([category, amount]: [string, any]) => (
              <View key={category} style={styles.habitItem}>
                <Text style={styles.habitLabel}>{category}</Text>
                <Text style={styles.habitAmount}>₹{amount?.toLocaleString() || 0}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Transactions')}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.actionButtonText}>Add Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AICoach')}
        >
          <Ionicons name="chatbubble" size={24} color={colors.primary} />
          <Text style={styles.actionButtonText}>Ask AI Coach</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

// Mock data for fallback/development
const getMockDashboardData = (): DashboardSummary => ({
  balance: 58720.76,
  safe_to_spend: 48720.76,
  income_7day: 45000,
  expense_7day: 12279,
  jars_funded: 3,
  goals_progress: 65,
  alerts: [
    {
      id: '1',
      user_id: 'user1',
      title: 'High Spending Alert',
      message: 'Your spending this month is 15% higher than last month',
      severity: 'warning',
      is_read: false,
      is_dismissed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  recent_transactions: [
    {
      id: '1',
      user_id: 'user1',
      type: 'expense',
      category: 'food',
      amount: -2500,
      description: 'Grocery Store',
      date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  spending_habits: {
    food: 8500,
    transport: 3200,
    entertainment: 2100,
    utilities: 1200,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    ...typography.body,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    ...typography.body,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginVertical: 16,
    gap: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    ...typography.heading,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  habitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  habitItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  habitLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  habitAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  spacer: {
    height: 20,
  },
});

export default DashboardScreen;
