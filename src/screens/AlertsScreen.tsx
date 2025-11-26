import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const AlertsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const alerts = [
    {
      id: '1',
      title: 'Bill Payment Due',
      message: 'Your electricity bill of ₹1,200 is due in 3 days',
      time: '2 hours ago',
      type: 'warning',
      icon: 'warning' as const,
    },
    {
      id: '2',
      title: 'Goal Achievement',
      message: 'Congratulations! You reached 50% of your vacation savings goal',
      time: '1 day ago',
      type: 'success',
      icon: 'checkmark-circle' as const,
    },
    {
      id: '3',
      title: 'Large Transaction',
      message: 'A transaction of ₹15,000 was detected in your account',
      time: '2 days ago',
      type: 'info',
      icon: 'information-circle' as const,
    },
    {
      id: '4',
      title: 'Budget Alert',
      message: 'You have exceeded your food budget by 20% this month',
      time: '3 days ago',
      type: 'error',
      icon: 'alert-circle' as const,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return colors.warning;
      case 'success':
        return colors.success;
      case 'info':
        return colors.info;
      case 'error':
        return colors.error;
      default:
        return colors.gray;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingsCard}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive alerts about your finances</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
            thumbColor={notificationsEnabled ? colors.primary : colors.gray}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {alerts.map((alert) => (
          <TouchableOpacity key={alert.id} style={styles.alertCard}>
            <View style={[styles.iconContainer, { backgroundColor: getTypeColor(alert.type) + '20' }]}>
              <Ionicons name={alert.icon} size={24} color={getTypeColor(alert.type)} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  settingsCard: {
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
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
  alertCard: {
    flexDirection: 'row',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 4,
  },
  alertMessage: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  alertTime: {
    ...typography.small,
    color: colors.gray,
  },
});

export default AlertsScreen;