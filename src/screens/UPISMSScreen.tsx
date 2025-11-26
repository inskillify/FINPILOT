import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const UPISMSScreen = () => {
  const smsTransactions = [
    { id: '1', message: 'Rs.2,500 debited from A/c XX1234 on 25-Nov-25. UPI/Google Pay/9876543210', amount: -2500, parsed: true },
    { id: '2', message: 'Rs.45,000 credited to A/c XX1234 on 24-Nov-25. Salary Credit', amount: 45000, parsed: true },
    { id: '3', message: 'Rs.1,200 debited from A/c XX1234 on 23-Nov-25. Bill Payment', amount: -1200, parsed: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>UPI SMS Parser</Text>
          <Text style={styles.headerSubtitle}>Automatically track transactions from SMS</Text>
        </View>
        <TouchableOpacity style={styles.syncButton}>
          <Ionicons name="sync" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Parsed</Text>
          <Text style={styles.statValue}>{smsTransactions.length}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statValue}>24</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent SMS Transactions</Text>
        {smsTransactions.map((sms) => (
          <View key={sms.id} style={styles.smsCard}>
            <View style={styles.smsHeader}>
              <Ionicons
                name={sms.amount > 0 ? 'arrow-down-circle' : 'arrow-up-circle'}
                size={24}
                color={sms.amount > 0 ? colors.success : colors.error}
              />
              <View style={styles.smsAmount}>
                <Text style={[styles.amountText, { color: sms.amount > 0 ? colors.success : colors.error }]}>
                  {sms.amount > 0 ? '+' : ''}₹{Math.abs(sms.amount).toLocaleString('en-IN')}
                </Text>
                {sms.parsed && (
                  <View style={styles.parsedBadge}>
                    <Text style={styles.parsedText}>Parsed</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.smsMessage}>{sms.message}</Text>
          </View>
        ))}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.info} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              We automatically parse your bank SMS messages to track UPI transactions. Grant SMS permission to enable this feature.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
  },
  syncButton: {
    padding: 8,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  smsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  smsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  smsAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    ...typography.bodyBold,
    marginRight: 8,
  },
  parsedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  parsedText: {
    ...typography.small,
    color: colors.white,
    fontSize: 10,
  },
  smsMessage: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 6,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default UPISMSScreen;