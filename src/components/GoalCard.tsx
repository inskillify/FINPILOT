/**
 * GoalCard Component
 * Displays goal with progress, timeline, and feasibility status
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface GoalCardProps {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  daysLeft: number;
  monthlyRequired: number;
  feasible: boolean;
  priority: 'low' | 'medium' | 'high';
}

const GoalCard: React.FC<GoalCardProps> = ({
  id,
  title,
  currentAmount,
  targetAmount,
  daysLeft,
  monthlyRequired,
  feasible,
  priority,
}) => {
  const progress = (currentAmount / targetAmount) * 100;

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const getFeasibilityIcon = () => {
    return feasible ? 'checkmark-circle' : 'alert-circle';
  };

  const getFeasibilityColor = () => {
    return feasible ? colors.success : colors.warning;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{priority.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <Ionicons name={getFeasibilityIcon() as any} size={20} color={getFeasibilityColor()} />
      </View>

      <ProgressBar progress={progress} color={colors.primary} showPercentage={false} />

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Target</Text>
          <Text style={styles.detailValue}>₹{targetAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Days Left</Text>
          <Text style={styles.detailValue}>{daysLeft} days</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Monthly Required</Text>
          <Text style={styles.detailValue}>₹{monthlyRequired.toLocaleString()}</Text>
        </View>
      </View>

      {!feasible && (
        <View style={styles.warningBox}>
          <Ionicons name="alert" size={16} color={colors.warning} />
          <Text style={styles.warningText}>Adjust timeline or increase monthly savings</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  priorityBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  priorityText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    ...typography.small,
    color: colors.text,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  warningText: {
    ...typography.small,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
  },
});

export default GoalCard;
