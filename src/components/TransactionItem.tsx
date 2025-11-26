import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface TransactionItemProps {
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  category,
  amount,
  date,
  type,
}) => {
  const categoryIcons: { [key: string]: string } = {
    Food: 'restaurant',
    Transport: 'car',
    Entertainment: 'film',
    Utilities: 'flash',
    Shopping: 'bag',
    Income: 'wallet',
    Other: 'cube',
  };

  const categoryColors: { [key: string]: string } = {
    Food: '#F59E0B',
    Transport: '#3B82F6',
    Entertainment: '#8B5CF6',
    Utilities: '#10B981',
    Shopping: '#EC4899',
    Income: '#10B981',
    Other: '#6B7280',
  };

  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: categoryColors[category] || colors.primary }]}>
        <Ionicons
          name={categoryIcons[category] || 'cube'}
          size={20}
          color={colors.white}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            { color: type === 'income' ? colors.success : colors.danger },
          ]}
        >
          {type === 'income' ? '+' : '-'}₹{Math.abs(amount).toLocaleString()}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.small,
    color: colors.text,
    fontWeight: '600',
  },
  category: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.h4,
    fontWeight: '600',
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default TransactionItem;
