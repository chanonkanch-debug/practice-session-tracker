import { useState, useContext, useEffect } from 'react';
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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TimerContext } from '../../context/TimerContext';

export default function StartSessionScreen({ navigation }) {
    const { startTimer, isActive } = useContext(TimerContext);

    const [duration, setDuration] = useState('60');
    const [instrument, setInstrument] = useState('');
    const [notes, setNotes] = useState('');

    // Quick duration buttons
    const quickDurations = [30, 45, 60, 90, 120];

    // Check for active session when screen comes into focus
    useFocusEffect(() => {
        if (isActive) {
            navigation.replace('ActiveTimer');
        }
    });

    const handleStartSession = () => {
        // Validation
        if (!duration || isNaN(duration) || Number(duration) <= 0) {
            Alert.alert('Error', 'Please enter a valid duration');
            return;
        }

        if (!instrument.trim()) {
            Alert.alert('Error', 'Please enter an instrument');
            return;
        }

        // Start the timer
        startTimer(Number(duration), instrument.trim(), notes.trim());

        // Navigate to active timer screen
        navigation.navigate('ActiveTimer');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerEmoji}>⏱️</Text>
                        <Text style={styles.title}>Start Practice Session</Text>
                        <Text style={styles.subtitle}>Set your practice goal and begin!</Text>
                    </View>

                    {/* Duration */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Duration (minutes) *</Text>

                        {/* Quick buttons */}
                        <View style={styles.quickButtons}>
                            {quickDurations.map((mins) => (
                                <TouchableOpacity
                                    key={mins}
                                    style={[
                                        styles.quickButton,
                                        duration === String(mins) && styles.quickButtonActive,
                                    ]}
                                    onPress={() => setDuration(String(mins))}
                                >
                                    <Text
                                        style={[
                                            styles.quickButtonText,
                                            duration === String(mins) && styles.quickButtonTextActive,
                                        ]}
                                    >
                                        {mins}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Custom input */}
                        <TextInput
                            style={styles.input}
                            value={duration}
                            onChangeText={setDuration}
                            placeholder="Enter custom duration"
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Instrument */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Instrument *</Text>
                        <TextInput
                            style={styles.input}
                            value={instrument}
                            onChangeText={setInstrument}
                            placeholder="e.g., Piano, Guitar, Drums"
                        />
                    </View>

                    {/* Notes (optional) */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Session Notes (optional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="What do you plan to practice?"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Start Button */}
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={handleStartSession}
                    >
                        <Text style={styles.startButtonText}>🎵 Start Practice</Text>
                    </TouchableOpacity>

                    {/* Cancel */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
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
    content: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    headerEmoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    quickButtons: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    quickButton: {
        flex: 1,
        minWidth: 60,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    quickButtonActive: {
        backgroundColor: '#6200ee',
        borderColor: '#6200ee',
    },
    quickButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    quickButtonTextActive: {
        color: 'white',
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
        height: 80,
        paddingTop: 15,
    },
    startButton: {
        backgroundColor: '#6200ee',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    startButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
});