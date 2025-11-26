/**
 * SMSParser Component
 * Handles SMS input, parsing, and transaction preview
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface SMSParserProps {
  onParse?: (smsText: string) => void;
  onConfirm?: (transaction: any) => void;
}

const SMSParser: React.FC<SMSParserProps> = ({ onParse, onConfirm }) => {
  const [smsText, setSmsText] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);

  const handleParse = () => {
    if (!smsText.trim()) return;

    // Simple parsing logic
    const amountMatch = smsText.match(/₹\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

    const isIncome = /credited|received|salary|payment/i.test(smsText);
    const type = isIncome ? 'income' : 'expense';

    let category = 'Other';
    if (/food|restaurant|cafe/i.test(smsText)) category = 'Food';
    else if (/fuel|petrol|gas|transport/i.test(smsText)) category = 'Transport';
    else if (/bill|electricity|water|internet/i.test(smsText)) category = 'Utilities';
    else if (/shopping|store|mall/i.test(smsText)) category = 'Shopping';

    const parsed = {
      amount,
      type,
      category,
      title: smsText.substring(0, 50),
      originalSMS: smsText,
    };

    setParsedData(parsed);
    onParse?.(smsText);
  };

  const handleConfirm = () => {
    if (parsedData) {
      onConfirm?.(parsedData);
      setSmsText('');
      setParsedData(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paste SMS</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste your SMS here..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
          value={smsText}
          onChangeText={setSmsText}
        />
        <TouchableOpacity
          style={[styles.parseButton, !smsText.trim() && styles.parseButtonDisabled]}
          onPress={handleParse}
          disabled={!smsText.trim()}
        >
          <Ionicons name="scan" size={18} color={colors.white} />
          <Text style={styles.parseButtonText}>Parse SMS</Text>
        </TouchableOpacity>
      </View>

      {parsedData && (
        <View style={styles.previewSection}>
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

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Ionicons name="checkmark-circle" size={18} color={colors.white} />
            <Text style={styles.confirmButtonText}>Confirm & Add Transaction</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 16,
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
    minHeight: 100,
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
  previewSection: {
    padding: 16,
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
});

export default SMSParser;
