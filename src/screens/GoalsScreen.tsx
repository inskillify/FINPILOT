import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GoalCard from '../components/GoalCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const GoalsScreen = () => {
  const goals = [
    { id: '1', title: 'Buy New Car', currentAmount: 150000, targetAmount: 500000, deadline: 'Dec 2026', icon: 'car' as const },
    { id: '2', title: 'House Down Payment', currentAmount: 200000, targetAmount: 1000000, deadline: 'Jun 2027', icon: 'home' as const },
    { id: '3', title: 'Retirement Fund', currentAmount: 500000, targetAmount: 5000000, deadline: 'Dec 2045', icon: 'wallet' as const },
    { id: '4', title: 'Education Fund', currentAmount: 80000, targetAmount: 300000, deadline: 'Mar 2028', icon: 'school' as const },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Goals</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            title={goal.title}
            currentAmount={goal.currentAmount}
            targetAmount={goal.targetAmount}
            deadline={goal.deadline}
            icon={goal.icon}
          />
        ))}

        <View style={styles.motivationCard}>
          <Ionicons name="trophy" size={32} color={colors.primary} />
          <Text style={styles.motivationTitle}>Keep Going!</Text>
          <Text style={styles.motivationText}>
            You're making great progress on your financial goals. Stay consistent and you'll achieve them!
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  addButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  motivationCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  motivationTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  motivationText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default GoalsScreen;