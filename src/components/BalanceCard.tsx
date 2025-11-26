import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface BalanceCardProps {
  balance: number;
  label?: string;
  showDetails?: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, label = 'Total Balance', showDetails = true }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.balance}>₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
      {showDetails && (
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Income</Text>
            <Text style={[styles.detailValue, { color: colors.success }]}>+₹45,000</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Expenses</Text>
            <Text style={[styles.detailValue, { color: colors.error }]}>-₹12,279.24</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    ...typography.caption,
    color: colors.darkGray,
    marginBottom: 8,
  },
  balance: {
    ...typography.h1,
    color: colors.black,
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...typography.small,
    color: colors.darkGray,
    marginBottom: 4,
  },
  detailValue: {
    ...typography.bodyBold,
  },
});

export default BalanceCard;