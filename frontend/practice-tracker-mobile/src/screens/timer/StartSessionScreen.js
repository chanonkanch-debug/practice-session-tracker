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
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { TimerContext } from '../../context/TimerContext';

export default function StartSessionScreen({ navigation }) {
    const { startTimer, isActive } = useContext(TimerContext);

    const [duration, setDuration] = useState('60');
    const [instrument, setInstrument] = useState('');
    const [notes, setNotes] = useState('');

    // Quick duration buttons
    const quickDurations = [30, 45, 60, 90];

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
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header with Gradient */}
                <LinearGradient
                    colors={['#6366f1', '#8b5cf6', '#a855f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerIconContainer}>
                        <View style={styles.headerIconCircle}>
                            <Text style={styles.headerIcon}>⏱️</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>Start Practice Session</Text>
                    <Text style={styles.subtitle}>Set your practice goal and begin!</Text>
                </LinearGradient>

                {/* Form Container */}
                <View style={styles.formContainer}>
                    {/* Duration Section */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Duration (minutes) *</Text>

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
                                    activeOpacity={0.7}
                                >
                                    <LinearGradient
                                        colors={
                                            duration === String(mins)
                                                ? ['#6366f1', '#8b5cf6']
                                                : ['#ffffff', '#ffffff']
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.quickButtonGradient}
                                    >
                                        <Text
                                            style={[
                                                styles.quickButtonText,
                                                duration === String(mins) && styles.quickButtonTextActive,
                                            ]}
                                        >
                                            {mins}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Custom input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputIcon}>⏲️</Text>
                            <TextInput
                                style={styles.input}
                                value={duration}
                                onChangeText={setDuration}
                                placeholder="Enter custom duration"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Instrument Section */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Instrument *</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputIcon}>🎵</Text>
                            <TextInput
                                style={styles.input}
                                value={instrument}
                                onChangeText={setInstrument}
                                placeholder="e.g., Piano, Guitar, Drums"
                                placeholderTextColor="#94a3b8"
                            />
                        </View>
                    </View>

                    {/* Notes Section */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Session Notes (optional)</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Text style={[styles.inputIcon, styles.textAreaIcon]}>📝</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="What do you plan to practice?"
                                placeholderTextColor="#94a3b8"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Start Button */}
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={handleStartSession}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.startButtonGradient}
                        >
                            <Text style={styles.startButtonIcon}>🎵</Text>
                            <Text style={styles.startButtonText}>Start Practice</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Cancel */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafb',
    },
    scrollView: {
        flex: 1,
    },
    // Header
    headerGradient: {
        paddingTop: 80,
        paddingBottom: 60,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerIconContainer: {
        marginBottom: 20,
    },
    headerIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    headerIcon: {
        fontSize: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: 'white',
        marginBottom: 8,
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    // Form Container
    formContainer: {
        paddingHorizontal: 20,
        marginTop: -40,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    // Quick Duration Buttons
    quickButtons: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    quickButton: {
        flex: 1,
        minWidth: 60,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    quickButtonGradient: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 12,
    },
    quickButtonActive: {
        shadowColor: '#6366f1',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    quickButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#64748b',
    },
    quickButtonTextActive: {
        color: 'white',
    },
    // Input Container
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    textAreaContainer: {
        height: 100,
        alignItems: 'flex-start',
        paddingVertical: 16,
    },
    inputIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    textAreaIcon: {
        marginTop: -2,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
    },
    textArea: {
        height: '100%',
        textAlignVertical: 'top',
    },
    // Start Button
    startButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
        marginTop: 8,
    },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 24,
        gap: 10,
    },
    startButtonIcon: {
        fontSize: 24,
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    // Cancel Button
    cancelButton: {
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
    },
    cancelButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '600',
    },
});