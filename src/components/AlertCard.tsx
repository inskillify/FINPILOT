/**
 * AlertCard Component
 * Displays alerts with severity color coding and action buttons
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface AlertCardProps {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
  actionText?: string;
  onAction?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
  id,
  title,
  message,
  type,
  actionText,
  onAction,
  onDismiss,
}) => {
  const getAlertColor = () => {
    switch (type) {
      case 'critical':
        return colors.danger;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getAlertIcon = () => {
    switch (type) {
      case 'critical':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'help-circle';
    }
  };

  const alertColor = getAlertColor();

  return (
    <View style={[styles.card, { borderLeftColor: alertColor }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name={getAlertIcon() as any} size={20} color={alertColor} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity onPress={() => onDismiss?.(id)}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.message}>{message}</Text>

      {actionText && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: alertColor }]}
          onPress={() => onAction?.(id)}
        >
          <Text style={styles.actionButtonText}>{actionText}</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </TouchableOpacity>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    ...typography.h4,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  message: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default AlertCard;
