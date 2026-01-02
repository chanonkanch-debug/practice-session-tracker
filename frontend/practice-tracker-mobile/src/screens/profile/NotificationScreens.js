import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { UserApi } from '../../services/UserApi';

export default function NotificationsScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await UserApi.getSettings();
      setNotificationsEnabled(response.settings.notifications_enabled);
    } catch (error) {
      console.log('Error fetching settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (value) => {
    try {
      setIsSaving(true);
      setNotificationsEnabled(value);

      await UserApi.updateSettings({
        notifications_enabled: value
      });

      // Show feedback
      setTimeout(() => {
        Alert.alert(
          'Success',
          value
            ? 'Notifications enabled'
            : 'Notifications disabled'
        );
      }, 300);

    } catch (error) {
      console.log('Error updating settings:', error);
      // Revert on error
      setNotificationsEnabled(!value);
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🔔</Text>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Manage your notification preferences</Text>
        </View>

        {/* Main Toggle */}
        <View style={styles.card}>
          <View style={styles.mainToggle}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleTitle}>Enable Notifications</Text>
              <Text style={styles.toggleSubtitle}>
                Receive practice reminders and updates
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggle}
              disabled={isSaving}
              trackColor={{ false: '#e0e0e0', true: '#c7b3ff' }}
              thumbColor={notificationsEnabled ? '#6200ee' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
            />
          </View>
        </View>

        {/* Notification Types (Coming Soon) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <Text style={styles.sectionSubtitle}>Coming soon!</Text>

          <View style={styles.card}>
            <View style={styles.option}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>⏰</Text>
                <View>
                  <Text style={styles.optionTitle}>Practice Reminders</Text>
                  <Text style={styles.optionSubtitle}>Daily practice notifications</Text>
                </View>
              </View>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.option}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>🔥</Text>
                <View>
                  <Text style={styles.optionTitle}>Streak Alerts</Text>
                  <Text style={styles.optionSubtitle}>Don't break your streak!</Text>
                </View>
              </View>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.option}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>🎯</Text>
                <View>
                  <Text style={styles.optionTitle}>Goal Progress</Text>
                  <Text style={styles.optionSubtitle}>Weekly goal updates</Text>
                </View>
              </View>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Notification features are currently in development. Stay tuned for updates!
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  mainToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLeft: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  comingSoonBadge: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6200ee',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});