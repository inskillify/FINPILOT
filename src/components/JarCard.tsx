import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface JarCardProps {
  name: string;
  currentAmount: number;
  targetAmount: number;
  color?: string;
  onPress?: () => void;
}

const JarCard: React.FC<JarCardProps> = ({
  name,
  currentAmount,
  targetAmount,
  color = colors.primary,
  onPress,
}) => {
  const progress = (currentAmount / targetAmount) * 100;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.percentage}>{progress.toFixed(0)}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.amounts}>
        <Text style={styles.currentAmount}>₹{currentAmount.toLocaleString('en-IN')}</Text>
        <Text style={styles.targetAmount}>of ₹{targetAmount.toLocaleString('en-IN')}</Text>
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
  name: {
    ...typography.bodyBold,
    color: colors.text,
  },
  percentage: {
    ...typography.bodyBold,
    color: colors.primary,
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
    borderRadius: 4,
  },
  amounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentAmount: {
    ...typography.bodyBold,
    color: colors.text,
  },
  targetAmount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default JarCard;