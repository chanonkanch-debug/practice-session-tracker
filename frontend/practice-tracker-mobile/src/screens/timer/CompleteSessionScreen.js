import { useContext, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { TimerContext } from '../../context/TimerContext';
import { SessionApi } from '../../services/SessionApi';

export default function CompleteSessionScreen({ navigation }) {
    const {
        sessionData,
        laps,
        elapsedSeconds,
        getSessionSummary,
        stopTimer,
        clearSavedSession,
    } = useContext(TimerContext);

    const [isSaving, setIsSaving] = useState(false);

    const handleSaveSession = async () => {
        try {
            setIsSaving(true);

            // Get session summary
            const summary = getSessionSummary();
            const actualDuration = Math.max(1, summary.actual_duration);

            // Create session in backend
            const createdSession = await SessionApi.createSession({
                practice_date: summary.practice_date,
                total_duration: summary.total_duration,
                actual_duration: actualDuration,
                instrument: summary.instrument,
                session_notes: summary.session_notes,
                status: summary.status,
                started_at: summary.started_at,
                ended_at: summary.ended_at,
            });

            console.log('Session created:', createdSession);

            // Create all laps as session items
            if (laps.length > 0) {
                for (const lap of laps) {

                    // Ensure lap duration is at least 1
                    const lapDuration = Math.max(1, lap.time_spent_minutes);

                    await SessionApi.createSessionItem(createdSession.session.id, {
                        item_type: lap.item_type,
                        item_name: lap.item_name,
                        tempo_bpm: lap.tempo_bpm,
                        time_spent_minutes: lapDuration,
                        difficulty_level: lap.difficulty_level,
                        notes: lap.notes,
                        lap_number: lap.lap_number,
                        started_at: lap.started_at,
                        ended_at: lap.ended_at,
                    });
                }
            }

            // Clear timer state
            await stopTimer();
            await clearSavedSession();

            // Show success
            Alert.alert(
                'Session Saved! 🎉',
                `Great practice! You completed ${laps.length} laps in ${Math.round(elapsedSeconds / 60)} minutes.`,
                [
                    {
                        text: 'View Session',
                        onPress: () => {
                            navigation.navigate('SessionsTab', {
                                screen: 'SessionDetail',
                                params: { session: createdSession.session },
                            });
                        },
                    },
                    {
                        text: 'Done',
                        onPress: () => {
                            navigation.navigate('Home');
                        },
                    },
                ]
            );
        } catch (error) {
            console.log('Error saving session:', error);
            Alert.alert('Error', 'Failed to save session. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        Alert.alert(
            'Discard Session?',
            'Are you sure? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: async () => {
                        await stopTimer();
                        await clearSavedSession();
                        navigation.navigate('Home');
                    },
                },
            ]
        );
    };

    const totalMinutes = Math.round(elapsedSeconds / 60);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.emoji}>🎉</Text>
                    <Text style={styles.title}>Practice Complete!</Text>
                    <Text style={styles.subtitle}>Great work on your session</Text>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Total Time</Text>
                        <Text style={styles.summaryValue}>{totalMinutes} min</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Laps</Text>
                        <Text style={styles.summaryValue}>{laps.length}</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Instrument</Text>
                        <Text style={styles.summaryValue}>{sessionData?.instrument}</Text>
                    </View>
                </View>

                {/* Laps Breakdown */}
                {laps.length > 0 && (
                    <View style={styles.lapsSection}>
                        <Text style={styles.sectionTitle}>Practice Breakdown</Text>
                        {laps.map((lap, index) => (
                            <View key={index} style={styles.lapCard}>
                                <View style={styles.lapHeader}>
                                    <Text style={styles.lapNumber}>Lap {lap.lap_number}</Text>
                                    <Text style={styles.lapDuration}>{lap.time_spent_minutes}m</Text>
                                </View>
                                <Text style={styles.lapName}>{lap.item_name}</Text>
                                <View style={styles.lapDetails}>
                                    <Text style={styles.lapType}>{lap.item_type}</Text>
                                    {lap.tempo_bpm && (
                                        <>
                                            <Text style={styles.lapDot}>•</Text>
                                            <Text style={styles.lapTempo}>{lap.tempo_bpm} BPM</Text>
                                        </>
                                    )}
                                    <Text style={styles.lapDot}>•</Text>
                                    <Text style={styles.lapDifficulty}>{lap.difficulty_level}</Text>
                                </View>
                                {lap.notes && (
                                    <Text style={styles.lapNotes}>{lap.notes}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Session Notes */}
                {sessionData?.session_notes && (
                    <View style={styles.notesSection}>
                        <Text style={styles.sectionTitle}>Session Notes</Text>
                        <Text style={styles.notesText}>{sessionData.session_notes}</Text>
                    </View>
                )}
            </ScrollView>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveSession}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.saveButtonText}>💾 Save Session</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.discardButton}
                    onPress={handleDiscard}
                    disabled={isSaving}
                >
                    <Text style={styles.discardButtonText}>Discard</Text>
                </TouchableOpacity>
            </View>
        </View>
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
    header: {
        backgroundColor: '#4caf50',
        padding: 30,
        paddingTop: 60,
        alignItems: 'center',
    },
    emoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        opacity: 0.9,
    },
    summaryContainer: {
        flexDirection: 'row',
        padding: 15,
        gap: 10,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 5,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    lapsSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    lapCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lapHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    lapNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    lapDuration: {
        fontSize: 14,
        color: '#666',
    },
    lapName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    lapDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    lapType: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    lapDot: {
        fontSize: 12,
        color: '#ccc',
    },
    lapTempo: {
        fontSize: 12,
        color: '#666',
    },
    lapDifficulty: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    lapNotes: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        fontStyle: 'italic',
    },
    notesSection: {
        padding: 15,
    },
    notesText: {
        fontSize: 16,
        color: '#666',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
    },
    actions: {
        padding: 20,
        gap: 12,
    },
    saveButton: {
        backgroundColor: '#4caf50',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    discardButton: {
        padding: 15,
        alignItems: 'center',
    },
    discardButtonText: {
        color: '#f44336',
        fontSize: 16,
        fontWeight: '600',
    },
});