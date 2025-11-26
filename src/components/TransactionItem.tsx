import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface TransactionItemProps {
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  onPress?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  category,
  amount,
  date,
  type,
  onPress,
}) => {
  const iconName = type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle';
  const amountColor = type === 'income' ? colors.success : colors.error;
  const amountPrefix = type === 'income' ? '+' : '-';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={amountColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}₹{Math.abs(amount).toLocaleString('en-IN')}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    ...typography.small,
    color: colors.textSecondary,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.bodyBold,
    marginBottom: 4,
  },
  date: {
    ...typography.small,
    color: colors.textSecondary,
  },
});

export default TransactionItem;