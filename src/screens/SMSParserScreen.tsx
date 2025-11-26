/**
 * UPI SMS Parser Screen
 * Features:
 * - SMS input textarea
 * - Parse SMS button
 * - Auto-filled transaction preview
 * - Confirm to add transaction
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SMSParser from '../components/SMSParser';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const SMSParserScreen = ({ navigation }: any) => {
  const [smsText, setSmsText] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleParse = (text: string) => {
    // Parse SMS logic
    const amountMatch = text.match(/₹\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

    const isIncome = /credited|received|salary|payment/i.test(text);
    const type = isIncome ? 'income' : 'expense';

    let category = 'Other';
    if (/food|restaurant|cafe/i.test(text)) category = 'Food';
    else if (/fuel|petrol|gas|transport/i.test(text)) category = 'Transport';
    else if (/bill|electricity|water|internet/i.test(text)) category = 'Utilities';
    else if (/shopping|store|mall/i.test(text)) category = 'Shopping';

    setParsedData({
      amount,
      type,
      category,
      title: text.substring(0, 50),
      originalSMS: text,
    });
  };

  const handleConfirm = (transaction: any) => {
    const newTransaction = {
      id: String(transactions.length + 1),
      title: transaction.title,
      category: transaction.category,
      amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      type: transaction.type,
    };

    setTransactions([...transactions, newTransaction]);
    setSmsText('');
    setParsedData(null);

    Alert.alert('Success', 'Transaction added successfully!', [
      {
        text: 'OK',
        onPress: () => {
          // Navigate to transactions or stay here
        },
      },
    ]);
  };

  const exampleSMS = [
    'UPI TXN: ₹2500 debited to Zomato. Ref: 123456789. Balance: ₹45000',
    'Your account has been credited with ₹45000. Salary deposit. Balance: ₹58720',
    'HDFC Bank: ₹1200 debited for Electricity Bill. Ref: ELEC123. Balance: ₹57520',
    'Uber: ₹450 debited. Trip to Airport. Balance: ₹57070',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SMS Parser</Text>
          <Text style={styles.subtitle}>Extract transactions from SMS</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Paste your UPI or bank SMS to automatically extract transaction details
          </Text>
        </View>

        {/* SMS Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paste SMS</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste your SMS here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={5}
            value={smsText}
            onChangeText={setSmsText}
          />
          <TouchableOpacity
            style={[styles.parseButton, !smsText.trim() && styles.parseButtonDisabled]}
            onPress={() => handleParse(smsText)}
            disabled={!smsText.trim()}
          >
            <Ionicons name="scan" size={18} color={colors.white} />
            <Text style={styles.parseButtonText}>Parse SMS</Text>
          </TouchableOpacity>
        </View>

        {/* Parsed Data Preview */}
        {parsedData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Amount</Text>
                <Text style={styles.previewValue}>₹{parsedData.amount.toLocaleString()}</Text>
              </View>

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Type</Text>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor:
                        parsedData.type === 'income' ? colors.success : colors.danger,
                    },
                  ]}
                >
                  <Text style={styles.typeBadgeText}>
                    {parsedData.type.charAt(0).toUpperCase() + parsedData.type.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Category</Text>
                <Text style={styles.previewValue}>{parsedData.category}</Text>
              </View>

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Title</Text>
                <Text style={styles.previewValue}>{parsedData.title}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => handleConfirm(parsedData)}
            >
              <Ionicons name="checkmark-circle" size={18} color={colors.white} />
              <Text style={styles.confirmButtonText}>Confirm & Add Transaction</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Example SMS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Example SMS</Text>
          {exampleSMS.map((sms, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exampleCard}
              onPress={() => setSmsText(sms)}
            >
              <Ionicons name="copy" size={16} color={colors.primary} />
              <Text style={styles.exampleText}>{sms}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Parsed Transactions */}
        {transactions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Parsed ({transactions.length})</Text>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color: transaction.type === 'income' ? colors.success : colors.danger,
                      },
                    ]}
                  >
                    {transaction.type === 'income' ? '+' : ''}₹{Math.abs(
                      transaction.amount
                    ).toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={16} color={colors.warning} />
            <Text style={styles.tipText}>
              Works best with UPI and bank SMS notifications
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={16} color={colors.warning} />
            <Text style={styles.tipText}>
              Make sure the SMS contains the transaction amount
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={16} color={colors.warning} />
            <Text style={styles.tipText}>
              You can edit the category after parsing if needed
            </Text>
          </View>
        </View>

        <View style={styles.spacer} />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 12,
  },
  infoText: {
    ...typography.small,
    color: colors.primary,
    marginLeft: 12,
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.background,
    color: colors.text,
    ...typography.body,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  parseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  parseButtonDisabled: {
    opacity: 0.5,
  },
  parseButtonText: {
    ...typography.h4,
    color: colors.white,
    marginLeft: 8,
  },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  previewLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  previewValue: {
    ...typography.h4,
    color: colors.text,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeBadgeText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingVertical: 12,
  },
  confirmButtonText: {
    ...typography.h4,
    color: colors.white,
    marginLeft: 8,
  },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleText: {
    ...typography.small,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  transactionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionTitle: {
    ...typography.small,
    color: colors.text,
    fontWeight: '600',
  },
  transactionCategory: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    ...typography.h4,
    fontWeight: '600',
  },
  transactionDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipText: {
    ...typography.small,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  spacer: {
    height: 20,
  },
});

export default SMSParserScreen;
