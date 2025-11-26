/**
 * PortfolioCard Component
 * Displays portfolio asset with value, P&L, and allocation
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface PortfolioCardProps {
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  type: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  symbol,
  name,
  quantity,
  currentPrice,
  totalValue,
  gainLoss,
  gainLossPercent,
  type,
}) => {
  const isPositive = gainLoss >= 0;
  const trendColor = isPositive ? colors.success : colors.danger;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <View style={[styles.typeIcon, { backgroundColor: trendColor }]}>
            <Ionicons
              name={type === 'stock' ? 'trending-up' : 'wallet'}
              size={16}
              color={colors.white}
            />
          </View>
          <View>
            <Text style={styles.symbol}>{symbol}</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{totalValue.toLocaleString()}</Text>
          <View style={styles.gainLossContainer}>
            <Ionicons
              name={isPositive ? 'arrow-up' : 'arrow-down'}
              size={14}
              color={trendColor}
            />
            <Text style={[styles.gainLoss, { color: trendColor }]}>
              {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Quantity</Text>
          <Text style={styles.detailValue}>{quantity}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Current Price</Text>
          <Text style={styles.detailValue}>₹{currentPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>P&L</Text>
          <Text style={[styles.detailValue, { color: trendColor }]}>
            ₹{gainLoss.toLocaleString()}
          </Text>
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
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  symbol: {
    ...typography.h4,
    color: colors.text,
  },
  name: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    ...typography.h4,
    color: colors.text,
  },
  gainLossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  gainLoss: {
    ...typography.small,
    fontWeight: '600',
    marginLeft: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default PortfolioCard;
