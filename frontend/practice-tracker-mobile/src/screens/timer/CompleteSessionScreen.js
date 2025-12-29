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
import { LinearGradient } from 'expo-linear-gradient';
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

            console.log('Session summary: ', summary);
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
                actualDuration >= summary.total_duration
                    ? `Great practice! You completed ${laps.length} lap${laps.length !== 1 ? 's' : ''} in ${Math.round(elapsedSeconds / 60)} minutes.`
                    : `Session saved! You practiced for ${Math.round(elapsedSeconds / 60)} of ${summary.total_duration} minutes with ${laps.length} lap${laps.length !== 1 ? 's' : ''}.`,
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
    const isComplete = totalMinutes >= (sessionData?.total_duration || 0);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header with Gradient */}
                <LinearGradient
                    colors={
                        isComplete
                            ? ['#10b981', '#059669', '#047857']
                            : ['#f59e0b', '#d97706', '#b45309']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerIconContainer}>
                        <View style={styles.headerIconCircle}>
                            <Text style={styles.headerIcon}>
                                {isComplete ? '🎉' : '⏸️'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.title}>
                        {isComplete ? 'Practice Complete!' : 'Session Ended Early'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isComplete ? 'Great work on your session' : 'Your progress has been saved'}
                    </Text>
                </LinearGradient>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <LinearGradient
                            colors={['#ffffff', '#fafafa']}
                            style={styles.summaryCardGradient}
                        >
                            <View style={styles.summaryIconContainer}>
                                <Text style={styles.summaryIcon}>⏱️</Text>
                            </View>
                            <Text style={styles.summaryValue}>{totalMinutes}</Text>
                            <Text style={styles.summaryLabel}>minutes</Text>
                        </LinearGradient>
                    </View>

                    <View style={styles.summaryCard}>
                        <LinearGradient
                            colors={['#ffffff', '#fafafa']}
                            style={styles.summaryCardGradient}
                        >
                            <View style={styles.summaryIconContainer}>
                                <Text style={styles.summaryIcon}>🎯</Text>
                            </View>
                            <Text style={styles.summaryValue}>{laps.length}</Text>
                            <Text style={styles.summaryLabel}>laps</Text>
                        </LinearGradient>
                    </View>

                    <View style={styles.summaryCard}>
                        <LinearGradient
                            colors={['#ffffff', '#fafafa']}
                            style={styles.summaryCardGradient}
                        >
                            <View style={styles.summaryIconContainer}>
                                <Text style={styles.summaryIcon}>🎵</Text>
                            </View>
                            <Text style={styles.summaryValue}>{sessionData?.instrument}</Text>
                            <Text style={styles.summaryLabel}>instrument</Text>
                        </LinearGradient>
                    </View>
                </View>

                {/* Laps Breakdown */}
                {laps.length > 0 && (
                    <View style={styles.lapsSection}>
                        <Text style={styles.sectionTitle}>Practice Breakdown</Text>
                        {laps.map((lap, index) => (
                            <View key={index} style={styles.lapCard}>
                                <LinearGradient
                                    colors={['#ffffff', '#fafafa']}
                                    style={styles.lapGradient}
                                >
                                    <View style={styles.lapHeader}>
                                        <View style={styles.lapNumberBadge}>
                                            <Text style={styles.lapNumber}>Lap {lap.lap_number}</Text>
                                        </View>
                                        <Text style={styles.lapDuration}>{lap.time_spent_minutes}m</Text>
                                    </View>
                                    <Text style={styles.lapName}>{lap.item_name}</Text>
                                    <View style={styles.lapDetails}>
                                        <View style={styles.lapTag}>
                                            <Text style={styles.lapType}>{lap.item_type}</Text>
                                        </View>
                                        {lap.tempo_bpm && (
                                            <View style={styles.lapTag}>
                                                <Text style={styles.lapDetail}>{lap.tempo_bpm} BPM</Text>
                                            </View>
                                        )}
                                        <View style={styles.lapTag}>
                                            <Text style={styles.lapDetail}>{lap.difficulty_level}</Text>
                                        </View>
                                    </View>
                                    {lap.notes && (
                                        <View style={styles.lapNotesContainer}>
                                            <Text style={styles.lapNotes}>{lap.notes}</Text>
                                        </View>
                                    )}
                                </LinearGradient>
                            </View>
                        ))}
                    </View>
                )}

                {/* Session Notes */}
                {sessionData?.session_notes && (
                    <View style={styles.notesSection}>
                        <Text style={styles.sectionTitle}>Session Notes</Text>
                        <View style={styles.notesCard}>
                            <Text style={styles.notesText}>{sessionData.session_notes}</Text>
                        </View>
                    </View>
                )}

                {/* Bottom spacing */}
                <View style={{ height: 160 }} />
            </ScrollView>

            {/* Actions - Fixed at bottom */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveSession}
                    disabled={isSaving}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={isSaving ? ['#94a3b8', '#94a3b8'] : ['#10b981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButtonGradient}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text style={styles.saveButtonIcon}>💾</Text>
                                <Text style={styles.saveButtonText}>Save Session</Text>
                            </>
                        )}
                    </LinearGradient>
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
        backgroundColor: '#f8fafb',
    },
    scrollView: {
        flex: 1,
    },
    // Header
    header: {
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
        shadowColor: '#000',
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
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    // Summary Cards
    summaryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: -40,
        gap: 12,
        marginBottom: 20,
    },
    summaryCard: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    summaryCardGradient: {
        padding: 20,
        alignItems: 'center',
    },
    summaryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f0f9ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryIcon: {
        fontSize: 24,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#6366f1',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    summaryLabel: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Laps Section
    lapsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    lapCard: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    lapGradient: {
        padding: 18,
        borderLeftWidth: 4,
        borderLeftColor: '#6366f1',
    },
    lapHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    lapNumberBadge: {
        backgroundColor: '#f0f9ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    lapNumber: {
        fontSize: 14,
        fontWeight: '800',
        color: '#6366f1',
    },
    lapDuration: {
        fontSize: 15,
        color: '#64748b',
        fontWeight: '700',
    },
    lapName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 10,
        letterSpacing: -0.3,
    },
    lapDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    lapTag: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    lapType: {
        fontSize: 12,
        color: '#475569',
        textTransform: 'capitalize',
        fontWeight: '700',
    },
    lapDetail: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    lapNotesContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    lapNotes: {
        fontSize: 14,
        color: '#64748b',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    // Notes Section
    notesSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    notesCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    notesText: {
        fontSize: 15,
        color: '#64748b',
        lineHeight: 22,
        fontWeight: '500',
    },
    // Actions
    actions: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    saveButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 12,
    },
    saveButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 24,
        gap: 10,
    },
    saveButtonIcon: {
        fontSize: 24,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    discardButton: {
        padding: 16,
        alignItems: 'center',
    },
    discardButtonText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '700',
    },
});