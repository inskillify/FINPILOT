/**
 * JarCard Component
 * Displays individual jar with progress, target, and allocation button
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface JarCardProps {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  color?: string;
  icon?: string;
  onAllocate?: (jarId: string) => void;
}

const JarCard: React.FC<JarCardProps> = ({
  id,
  name,
  currentAmount,
  targetAmount,
  color = colors.primary,
  icon = 'cube',
  onAllocate,
}) => {
  const progress = (currentAmount / targetAmount) * 100;
  const remaining = targetAmount - currentAmount;
  const dailyRecommended = targetAmount / 30;

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Ionicons name={icon as any} size={20} color={colors.white} />
          </View>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.subtitle}>
              ₹{currentAmount.toLocaleString()} / ₹{targetAmount.toLocaleString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.allocateButton, { backgroundColor: color }]}
          onPress={() => onAllocate?.(id)}
        >
          <Ionicons name="add" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ProgressBar progress={progress} color={color} showPercentage={false} />

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Remaining</Text>
          <Text style={styles.footerValue}>₹{remaining.toLocaleString()}</Text>
        </View>
        <View>
          <Text style={styles.footerLabel}>Daily Recommended</Text>
          <Text style={styles.footerValue}>₹{dailyRecommended.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  name: {
    ...typography.h4,
    color: colors.text,
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  allocateButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  footerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footerValue: {
    ...typography.small,
    color: colors.text,
    fontWeight: '600',
  },
});

export default JarCard;
