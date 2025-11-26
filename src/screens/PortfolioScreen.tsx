/**
 * Portfolio Screen
 * Display and manage investment portfolio
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PortfolioCard from '../components/PortfolioCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import apiService from '../services/api';
import { Portfolio, HoldingWithAsset } from '../types/api';

const PortfolioScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      setError(null);
      const data = await apiService.getPortfolio();
      setPortfolio(data);
    } catch (err: any) {
      console.error('Error fetching portfolio:', err);
      setError(err.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading portfolio...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPortfolio}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!portfolio) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="briefcase-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyText}>No portfolio data</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAsset')}
        >
          <Text style={styles.addButtonText}>Add Your First Asset</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const gainLossColor = portfolio.total_gain_loss >= 0 ? colors.success : colors.error;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Investment Portfolio</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAsset')}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Portfolio Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Value</Text>
            <Text style={styles.summaryValue}>₹{portfolio.total_value?.toLocaleString() || 0}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Invested</Text>
            <Text style={styles.summaryValue}>₹{portfolio.total_invested?.toLocaleString() || 0}</Text>
          </View>

          <View style={[styles.summaryCard, { borderLeftColor: gainLossColor }]}>
            <Text style={styles.summaryLabel}>Gain/Loss</Text>
            <Text style={[styles.summaryValue, { color: gainLossColor }]}>
              ₹{portfolio.total_gain_loss?.toLocaleString() || 0}
            </Text>
            <Text style={[styles.summarySubtext, { color: gainLossColor }]}>
              {portfolio.gain_loss_percentage?.toFixed(2)}%
            </Text>
          </View>
        </View>

        {/* Holdings */}
        {portfolio.holdings && portfolio.holdings.length > 0 ? (
          <View style={styles.holdingsContainer}>
            <Text style={styles.sectionTitle}>Holdings</Text>
            {portfolio.holdings.map((holding) => (
              <PortfolioCard
                key={holding.id}
                name={holding.asset.name}
                symbol={holding.asset.symbol}
                quantity={holding.quantity}
                currentPrice={holding.asset.current_price}
                currentValue={holding.current_value}
                gainLoss={holding.gain_loss}
                onPress={() => navigation.navigate('HoldingDetail', { holdingId: holding.id })}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No holdings yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('AddAsset')}
            >
              <Text style={styles.createButtonText}>Add Your First Holding</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    ...typography.heading,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
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
  summaryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  summarySubtext: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  holdingsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    ...typography.heading,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    ...typography.body,
  },
  createButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PortfolioScreen;
