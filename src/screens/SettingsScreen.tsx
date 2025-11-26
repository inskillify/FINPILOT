import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [biometric, setBiometric] = React.useState(true);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline' as const, label: 'Profile', value: null },
        { icon: 'lock-closed-outline' as const, label: 'Change Password', value: null },
        { icon: 'shield-checkmark-outline' as const, label: 'Privacy', value: null },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'moon-outline' as const, label: 'Dark Mode', value: darkMode, toggle: setDarkMode },
        { icon: 'finger-print-outline' as const, label: 'Biometric Login', value: biometric, toggle: setBiometric },
        { icon: 'language-outline' as const, label: 'Language', value: 'English' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline' as const, label: 'Help Center', value: null },
        { icon: 'chatbubble-outline' as const, label: 'Contact Support', value: null },
        { icon: 'document-text-outline' as const, label: 'Terms & Privacy', value: null },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>john.doe@example.com</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex < section.items.length - 1 && styles.settingItemBorder,
                ]}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name={item.icon} size={24} color={colors.text} />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                {item.toggle ? (
                  <Switch
                    value={item.value as boolean}
                    onValueChange={item.toggle}
                    trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
                    thumbColor={item.value ? colors.primary : colors.gray}
                  />
                ) : item.value ? (
                  <Text style={styles.settingValue}>{item.value}</Text>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={colors.gray} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileCard: {
    backgroundColor: colors.white,
    alignItems: 'center',
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
    marginLeft: 12,
  },
  settingValue: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.error,
    marginLeft: 8,
  },
  version: {
    ...typography.small,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default SettingsScreen;