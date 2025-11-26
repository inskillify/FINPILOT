/**
 * AI Insights Screen
 * Display AI-generated financial insights and predictions
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InsightCard from '../components/InsightCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import apiService from '../services/api';
import { Prediction, Pattern, Optimization, CategoryStats } from '../types/api';

const AIInsightsScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'predictions' | 'patterns' | 'optimizations' | 'categories'>('predictions');

  const fetchInsights = async () => {
    try {
      setError(null);
      const [pred, patt, opt, cat] = await Promise.all([
        apiService.getPredictions().catch(() => []),
        apiService.getPatterns().catch(() => []),
        apiService.getOptimizations().catch(() => []),
        apiService.getCategories().catch(() => []),
      ]);

      setPredictions(pred || []);
      setPatterns(patt || []);
      setOptimizations(opt || []);
      setCategories(cat || []);
    } catch (err: any) {
      console.error('Error fetching insights:', err);
      setError(err.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Analyzing your finances...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchInsights}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Insights</Text>
        <Text style={styles.headerSubtitle}>Personalized financial analysis</Text>
      </View>

      {/* Tab Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {(['predictions', 'patterns', 'optimizations', 'categories'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <View style={styles.section}>
            {predictions.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="trending-up" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No predictions available yet</Text>
              </View>
            ) : (
              predictions.map((pred, idx) => (
                <InsightCard
                  key={idx}
                  title={pred.type}
                  value={`₹${pred.value?.toLocaleString() || 0}`}
                  confidence={`${(pred.confidence * 100).toFixed(0)}% confident`}
                  date={new Date(pred.date).toLocaleDateString()}
                  icon="trending-up"
                />
              ))
            )}
          </View>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && (
          <View style={styles.section}>
            {patterns.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="analytics" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No patterns detected yet</Text>
              </View>
            ) : (
              patterns.map((pattern, idx) => (
                <View key={idx} style={styles.patternCard}>
                  <View style={styles.patternHeader}>
                    <Text style={styles.patternCategory}>{pattern.category}</Text>
                    <View
                      style={[
                        styles.trendBadge,
                        pattern.trend === 'increasing' && styles.trendIncreasing,
                        pattern.trend === 'decreasing' && styles.trendDecreasing,
                        pattern.trend === 'stable' && styles.trendStable,
                      ]}
                    >
                      <Ionicons
                        name={
                          pattern.trend === 'increasing'
                            ? 'arrow-up'
                            : pattern.trend === 'decreasing'
                            ? 'arrow-down'
                            : 'remove'
                        }
                        size={14}
                        color={colors.white}
                      />
                      <Text style={styles.trendText}>{pattern.trend}</Text>
                    </View>
                  </View>
                  <View style={styles.patternStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Average</Text>
                      <Text style={styles.statValue}>₹{pattern.average_amount?.toLocaleString() || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Frequency</Text>
                      <Text style={styles.statValue}>{pattern.frequency}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Optimizations Tab */}
        {activeTab === 'optimizations' && (
          <View style={styles.section}>
            {optimizations.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bulb" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No optimization suggestions yet</Text>
              </View>
            ) : (
              optimizations.map((opt, idx) => (
                <View key={idx} style={styles.optimizationCard}>
                  <View style={styles.optimizationHeader}>
                    <Text style={styles.optimizationTitle}>{opt.title}</Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        opt.priority === 'high' && styles.priorityHigh,
                        opt.priority === 'medium' && styles.priorityMedium,
                        opt.priority === 'low' && styles.priorityLow,
                      ]}
                    >
                      <Text style={styles.priorityText}>{opt.priority}</Text>
                    </View>
                  </View>
                  <Text style={styles.optimizationDescription}>{opt.description}</Text>
                  <View style={styles.savingsContainer}>
                    <Ionicons name="cash" size={16} color={colors.success} />
                    <Text style={styles.savingsText}>
                      Potential savings: ₹{opt.potential_savings?.toLocaleString() || 0}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <View style={styles.section}>
            {categories.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="pie-chart" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No category data available yet</Text>
              </View>
            ) : (
              categories.map((cat, idx) => (
                <View key={idx} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{cat.category}</Text>
                    <Text style={styles.categoryPercentage}>{cat.percentage_of_total?.toFixed(1)}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(cat.percentage_of_total || 0, 100)}%` },
                      ]}
                    />
                  </View>
                  <View style={styles.categoryStats}>
                    <View style={styles.categoryStat}>
                      <Text style={styles.categoryStatLabel}>Total</Text>
                      <Text style={styles.categoryStatValue}>₹{cat.total_amount?.toLocaleString() || 0}</Text>
                    </View>
                    <View style={styles.categoryStat}>
                      <Text style={styles.categoryStatLabel}>Transactions</Text>
                      <Text style={styles.categoryStatValue}>{cat.transaction_count}</Text>
                    </View>
                    <View style={styles.categoryStat}>
                      <Text style={styles.categoryStatLabel}>Average</Text>
                      <Text style={styles.categoryStatValue}>₹{cat.average_transaction?.toLocaleString() || 0}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
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
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
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
  tabsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    ...typography.body,
  },
  patternCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patternCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  trendIncreasing: {
    backgroundColor: colors.error,
  },
  trendDecreasing: {
    backgroundColor: colors.success,
  },
  trendStable: {
    backgroundColor: colors.warning,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    textTransform: 'capitalize',
  },
  patternStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  optimizationCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  optimizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  priorityHigh: {
    backgroundColor: colors.error,
  },
  priorityMedium: {
    backgroundColor: colors.warning,
  },
  priorityLow: {
    backgroundColor: colors.info,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    textTransform: 'capitalize',
  },
  optimizationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  categoryStats: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryStat: {
    flex: 1,
  },
  categoryStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  categoryStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

export default AIInsightsScreen;
