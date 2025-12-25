import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SessionApi } from '../../services/SessionApi';

export default function AddEditSessionScreen({ route, navigation }) {
    // check if editing (has session param) or creating (no param)
    const isEditing = route.params?.session !== undefined;
    const existingSession = route.params?.session;

    // form state
    const [practiceDate, setPracticeDate] = useState('');
    const [totalDuration, setTotalDuration] = useState('');
    const [instrument, setInstrument] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // set inital values if editing
    useEffect(() => {
        if (isEditing) {
            const date = new Date(existingSession.practice_date);
            const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd

            setPracticeDate(formattedDate);
            setTotalDuration(String(existingSession.total_duration));
            setInstrument(existingSession.instrument || '');
            setNotes(existingSession.notes || '');
        } else {
            // set today's date for new session
            const today = new Date().toISOString().split('T')[0];
            setPracticeDate(today);
        }
    }, []);

    // validate form
    const validateForm = () => {
        if (!practiceDate) {
            Alert.alert('Error', 'Please enter a practice date');
            return false;
        }

        if (!totalDuration || isNaN(totalDuration) || Number(totalDuration) <= 0) {
            Alert.alert('Error', 'Please enter a valid duration (in minutes)');
            return false;
        }

        return true;
    };

    // handle submit (create or update)
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setIsLoading(true);

            const sessionData = {
                practice_date: practiceDate,
                total_duration: Number(totalDuration),
                instrument: instrument || null,
                session_notes: notes || null,
            };

            if (isEditing) {
                // Update existing session
                await SessionApi.updateSession(existingSession.id, sessionData);
                Alert.alert('Success', 'Session updated successfully!');
            } else {
                // Create new session
                await SessionApi.createSession(sessionData);
                Alert.alert('Success', 'Session created successfully!');
            }

            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to save session');
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.form}>
                    <Text style={styles.title}>
                        {isEditing ? 'Edit Session' : 'Add Practice Session'}
                    </Text>

                    {/* Practice Date */}
                    <Text style={styles.label}>Practice Date *</Text>
                    <TextInput
                        style={styles.input}
                        value={practiceDate}
                        onChangeText={setPracticeDate}
                        placeholder="YYYY-MM-DD (e.g., 2024-12-18)"
                        editable={!isLoading}
                    />
                    <Text style={styles.hint}>Format: YYYY-MM-DD</Text>

                    {/* Duration */}
                    <Text style={styles.label}>Duration (minutes) *</Text>
                    <TextInput
                        style={styles.input}
                        value={totalDuration}
                        onChangeText={setTotalDuration}
                        placeholder="45"
                        keyboardType="numeric"
                        editable={!isLoading}
                    />

                    {/* Instrument */}
                    <Text style={styles.label}>Instrument</Text>
                    <TextInput
                        style={styles.input}
                        value={instrument}
                        onChangeText={setInstrument}
                        placeholder="e.g., Piano, Guitar, Drums"
                        editable={!isLoading}
                    />

                    {/* Notes */}
                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="What did you practice today?"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        editable={!isLoading}
                    />

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                {isEditing ? 'Update Session' : 'Create Session'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                        disabled={isLoading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#6200ee',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 18,
    alignItems: 'center',
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});