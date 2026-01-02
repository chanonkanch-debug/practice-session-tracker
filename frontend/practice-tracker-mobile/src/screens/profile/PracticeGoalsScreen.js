import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { UserApi } from '../../services/UserApi';

export default function PracticeGoalsScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [goalMinutes, setGoalMinutes] = useState('30');

  // Quick goal presets
  const presets = [15, 30, 45, 60, 90, 120];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await UserApi.getSettings();
      setGoalMinutes(String(response.settings.practice_goal_minutes));
    } catch (error) {
      console.log('Error fetching settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    const minutes = parseInt(goalMinutes);
    if (isNaN(minutes) || minutes < 1 || minutes > 480) {
      Alert.alert('Error', 'Goal must be between 1 and 480 minutes');
      return;
    }

    try {
      setIsSaving(true);

      await UserApi.updateSettings({
        practice_goal_minutes: minutes
      });

      Alert.alert(
        'Success',
        `Daily practice goal set to ${minutes} minutes!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (error) {
      console.log('Error updating goal:', error);
      Alert.alert('Error', 'Failed to update practice goal');
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

  const currentGoal = parseInt(goalMinutes) || 30;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🎯</Text>
          <Text style={styles.title}>Practice Goals</Text>
          <Text style={styles.subtitle}>Set your daily practice target</Text>
        </View>

        {/* Current Goal Display */}
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>Your Daily Goal</Text>
          <View style={styles.goalDisplay}>
            <Text style={styles.goalNumber}>{currentGoal}</Text>
            <Text style={styles.goalUnit}>minutes</Text>
          </View>
          <Text style={styles.goalEquivalent}>
            {Math.floor(currentGoal / 60) > 0 && `${Math.floor(currentGoal / 60)} hour${Math.floor(currentGoal / 60) > 1 ? 's' : ''}`}
            {currentGoal % 60 > 0 && ` ${currentGoal % 60} min`}
          </Text>
        </View>

        {/* Quick Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Presets</Text>
          <View style={styles.presetsGrid}>
            {presets.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetButton,
                  currentGoal === preset && styles.presetButtonActive
                ]}
                onPress={() => setGoalMinutes(String(preset))}
              >
                <Text style={[
                  styles.presetValue,
                  currentGoal === preset && styles.presetValueActive
                ]}>
                  {preset}
                </Text>
                <Text style={[
                  styles.presetLabel,
                  currentGoal === preset && styles.presetLabelActive
                ]}>
                  min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Goal</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={goalMinutes}
              onChangeText={setGoalMinutes}
              placeholder="Enter minutes"
              keyboardType="numeric"
            />
            <Text style={styles.inputSuffix}>minutes</Text>
          </View>
          <Text style={styles.hint}>Between 1 and 480 minutes (8 hours)</Text>
        </View>

        {/* Motivation */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationIcon}>💡</Text>
          <View style={styles.motivationContent}>
            <Text style={styles.motivationTitle}>Tip</Text>
            <Text style={styles.motivationText}>
              Start with a realistic goal you can maintain daily. You can always increase it later!
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Goal</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSaving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

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
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  goalLabel: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  goalDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  goalNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  goalUnit: {
    fontSize: 20,
    color: '#999',
    fontWeight: '600',
  },
  goalEquivalent: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  presetButtonActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  presetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  presetValueActive: {
    color: 'white',
  },
  presetLabel: {
    fontSize: 12,
    color: '#999',
  },
  presetLabelActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  inputSuffix: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: '#999',
  },
  motivationCard: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  motivationIcon: {
    fontSize: 24,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});