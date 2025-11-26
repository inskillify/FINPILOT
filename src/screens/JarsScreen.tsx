import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JarCard from '../components/JarCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const JarsScreen = () => {
  const jars = [
    { id: '1', name: 'Emergency Fund', currentAmount: 25000, targetAmount: 100000, color: colors.error },
    { id: '2', name: 'Vacation', currentAmount: 15000, targetAmount: 50000, color: colors.info },
    { id: '3', name: 'New Laptop', currentAmount: 30000, targetAmount: 80000, color: colors.success },
    { id: '4', name: 'Investment', currentAmount: 50000, targetAmount: 200000, color: colors.warning },
  ];

  const totalSaved = jars.reduce((sum, jar) => sum + jar.currentAmount, 0);
  const totalTarget = jars.reduce((sum, jar) => sum + jar.targetAmount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Saved in Jars</Text>
        <Text style={styles.summaryAmount}>₹{totalSaved.toLocaleString('en-IN')}</Text>
        <Text style={styles.summaryTarget}>of ₹{totalTarget.toLocaleString('en-IN')}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Savings Jars</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {jars.map((jar) => (
          <JarCard
            key={jar.id}
            name={jar.name}
            currentAmount={jar.currentAmount}
            targetAmount={jar.targetAmount}
            color={jar.color}
          />
        ))}

        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={colors.primary} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Savings Tip</Text>
            <Text style={styles.tipText}>
              Try to save at least 20% of your monthly income across different jars for better financial security.
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
  summaryCard: {
    backgroundColor: colors.primary,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.darkGray,
    marginBottom: 8,
  },
  summaryAmount: {
    ...typography.h1,
    color: colors.black,
    marginBottom: 4,
  },
  summaryTarget: {
    ...typography.caption,
    color: colors.darkGray,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 6,
  },
  tipText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default JarsScreen;