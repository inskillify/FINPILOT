/**
 * MetricCard Component
 * Displays a single metric with value, label, and optional change indicator
 * Used across dashboard and insights screens
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  icon,
  color = colors.primary,
  trend = 'neutral',
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return colors.success;
    if (trend === 'down') return colors.danger;
    return colors.textSecondary;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'arrow-up';
    if (trend === 'down') return 'arrow-down';
    return 'remove';
  };

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {icon && <Ionicons name={icon as any} size={20} color={color} />}
      </View>
      <Text style={styles.value}>{value}</Text>
      {change !== undefined && (
        <View style={styles.changeContainer}>
          <Ionicons name={getTrendIcon() as any} size={14} color={getTrendColor()} />
          <Text style={[styles.change, { color: getTrendColor() }]}>
            {change > 0 ? '+' : ''}{change}%
          </Text>
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
    marginBottom: 8,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  value: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    ...typography.small,
    marginLeft: 4,
  },
});

export default MetricCard;
