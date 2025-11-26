import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface InsightCardProps {
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  onPress?: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  category,
  impact,
  onPress,
}) => {
  const impactColors = {
    high: colors.error,
    medium: colors.warning,
    low: colors.info,
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.impactBadge, { backgroundColor: impactColors[impact] }]}>
          <Text style={styles.impactText}>{impact.toUpperCase()}</Text>
        </View>
        <Text style={styles.category}>{category}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.footer}>
        <Ionicons name="bulb" size={16} color={colors.primary} />
        <Text style={styles.footerText}>AI Generated Insight</Text>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  impactText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '700',
  },
  category: {
    ...typography.small,
    color: colors.textSecondary,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    ...typography.small,
    color: colors.primary,
    marginLeft: 6,
  },
});

export default InsightCard;