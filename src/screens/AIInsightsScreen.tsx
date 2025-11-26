import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InsightCard from '../components/InsightCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const AIInsightsScreen = () => {
  const insights = [
    {
      id: '1',
      title: 'High Spending on Food',
      description: 'Your food expenses are 35% higher than last month. Consider meal planning to reduce costs.',
      category: 'Spending',
      impact: 'high' as const,
    },
    {
      id: '2',
      title: 'Great Savings Progress',
      description: 'You saved 25% of your income this month. Keep up the excellent work!',
      category: 'Savings',
      impact: 'low' as const,
    },
    {
      id: '3',
      title: 'Upcoming Bill Payment',
      description: 'Your electricity bill of ₹1,200 is due in 3 days. Make sure you have sufficient balance.',
      category: 'Bills',
      impact: 'medium' as const,
    },
    {
      id: '4',
      title: 'Investment Opportunity',
      description: 'Based on your savings pattern, you could invest ₹10,000 monthly in mutual funds.',
      category: 'Investment',
      impact: 'medium' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Insights</Text>
        <Text style={styles.headerSubtitle}>Personalized financial recommendations</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
            category={insight.category}
            impact={insight.impact}
          />
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            These insights are generated using AI by analyzing your spending patterns, income, and financial goals.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  infoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  infoText: {
    ...typography.caption,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AIInsightsScreen;