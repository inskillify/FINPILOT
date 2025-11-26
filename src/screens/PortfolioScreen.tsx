import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const PortfolioScreen = () => {
  const portfolio = [
    { name: 'Stocks', value: 150000, percentage: 35, color: colors.info },
    { name: 'Mutual Funds', value: 120000, percentage: 28, color: colors.success },
    { name: 'Fixed Deposits', value: 80000, percentage: 19, color: colors.warning },
    { name: 'Gold', value: 50000, percentage: 12, color: colors.primary },
    { name: 'Cash', value: 30000, percentage: 6, color: colors.gray },
  ];

  const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.netWorthCard}>
        <Text style={styles.netWorthLabel}>Total Net Worth</Text>
        <Text style={styles.netWorthValue}>₹{totalValue.toLocaleString('en-IN')}</Text>
        <Text style={styles.netWorthChange}>+12.5% this month</Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Asset Allocation</Text>
        <View style={styles.pieChart}>
          {portfolio.map((item, index) => (
            <View
              key={index}
              style={[
                styles.pieSegment,
                {
                  backgroundColor: item.color,
                  height: `${item.percentage}%`,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.assetsList}>
        <Text style={styles.sectionTitle}>Portfolio Breakdown</Text>
        {portfolio.map((item, index) => (
          <View key={index} style={styles.assetCard}>
            <View style={styles.assetHeader}>
              <View style={styles.assetInfo}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.assetName}>{item.name}</Text>
              </View>
              <Text style={styles.assetPercentage}>{item.percentage}%</Text>
            </View>
            <Text style={styles.assetValue}>₹{item.value.toLocaleString('en-IN')}</Text>
          </View>
        ))}
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Portfolio Insight</Text>
        <Text style={styles.insightText}>
          Your portfolio is well-diversified across multiple asset classes. Consider rebalancing if any asset exceeds 40% of your total portfolio.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  netWorthCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  netWorthLabel: {
    ...typography.caption,
    color: colors.darkGray,
    marginBottom: 8,
  },
  netWorthValue: {
    ...typography.h1,
    color: colors.black,
    marginBottom: 8,
  },
  netWorthChange: {
    ...typography.caption,
    color: colors.success,
  },
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 16,
  },
  pieChart: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pieSegment: {
    width: '100%',
  },
  assetsList: {
    paddingHorizontal: 16,
  },
  assetCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  assetName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  assetPercentage: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  assetValue: {
    ...typography.h3,
    color: colors.text,
  },
  insightCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  insightTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 8,
  },
  insightText: {
    ...typography.caption,
    color: colors.darkGray,
    lineHeight: 20,
  },
});

export default PortfolioScreen;