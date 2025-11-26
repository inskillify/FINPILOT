import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface GoalCardProps {
  title: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  title,
  currentAmount,
  targetAmount,
  deadline,
  icon = 'flag',
  onPress,
}) => {
  const progress = (currentAmount / targetAmount) * 100;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.deadline}>Target: {deadline}</Text>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.currentAmount}>₹{currentAmount.toLocaleString('en-IN')}</Text>
        <Text style={styles.targetAmount}>₹{targetAmount.toLocaleString('en-IN')}</Text>
      </View>
      <Text style={styles.percentage}>{progress.toFixed(1)}% Complete</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 4,
  },
  deadline: {
    ...typography.small,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  currentAmount: {
    ...typography.bodyBold,
    color: colors.text,
  },
  targetAmount: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  percentage: {
    ...typography.caption,
    color: colors.primary,
    textAlign: 'center',
  },
});

export default GoalCard;