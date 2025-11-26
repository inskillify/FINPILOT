/**
 * Jars Screen
 * Display and manage savings jars
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JarCard from '../components/JarCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import apiService from '../services/api';
import { Jar } from '../types/api';

const JarsScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [jars, setJars] = useState<Jar[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchJars = async () => {
    try {
      setError(null);
      const data = await apiService.getJars();
      setJars(data || []);
    } catch (err: any) {
      console.error('Error fetching jars:', err);
      setError(err.message || 'Failed to load jars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJars();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading jars...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchJars}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalFunded = jars.reduce((sum, jar) => sum + jar.current_amount, 0);
  const totalTarget = jars.reduce((sum, jar) => sum + jar.target_amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Savings Jars</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateJar')}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Funded</Text>
            <Text style={styles.summaryValue}>₹{totalFunded.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Target</Text>
            <Text style={styles.summaryValue}>₹{totalTarget.toLocaleString()}</Text>
          </View>
        </View>

        {jars.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No jars yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateJar')}
            >
              <Text style={styles.createButtonText}>Create Your First Jar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.jarsContainer}>
            {jars.map((jar) => (
              <JarCard
                key={jar.id}
                name={jar.name}
                description={jar.description}
                current={jar.current_amount}
                target={jar.target_amount}
                color={jar.color}
                icon={jar.icon}
                onPress={() => navigation.navigate('JarDetail', { jarId: jar.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    ...typography.heading,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    ...typography.body,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    ...typography.body,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    ...typography.body,
  },
  createButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  jarsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default JarsScreen;
