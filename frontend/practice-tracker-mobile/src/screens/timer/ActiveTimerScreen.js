import { useContext, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';
import { TimerContext } from '../../context/TimerContext';
import { formatTime } from '../../utils/timerHelpers';

export default function ActiveTimerScreen({ navigation }) {
    const {
        isActive,
        isPaused,
        goalSeconds,
        elapsedSeconds,
        remainingSeconds,
        sessionData,
        laps,
        pauseTimer,
        resumeTimer,
        stopTimer,
    } = useContext(TimerContext);

    // Keep screen awake while on this screen
    useEffect(() => {
        activateKeepAwakeAsync();

        return () => {
            deactivateKeepAwake();
        };
    }, []);

    // If no active session, go back
    useEffect(() => {
        if (!isActive && !isPaused) {
            navigation.replace('SessionsList');
        }
    }, [isActive, isPaused]);

    const handlePauseResume = () => {
        if (isPaused) {
            resumeTimer();
        } else {
            pauseTimer();
        }
    };

    const handleLap = () => {
        pauseTimer();
        navigation.navigate('AddLap');
    };

    const handleStop = () => {
        Alert.alert(
            'End Practice Early?',
            'Do you want to save your progress or discard this session?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: async () => {
                        await stopTimer();
                        navigation.navigate('SessionsList');
                    },
                },
                {
                    text: 'Save Progress',
                    onPress: () => {
                        navigation.navigate('CompleteSession');
                    },
                },
            ]
        );
    };

    const handleComplete = () => {
        navigation.navigate('CompleteSession');
    };

    // Check if timer is complete
    const isComplete = remainingSeconds === 0 && elapsedSeconds > 0;
    const progressPercentage = Math.min((elapsedSeconds / goalSeconds) * 100, 100);

    return (
        <View style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={
                    isComplete
                        ? ['#10b981', '#059669']
                        : isPaused
                        ? ['#f59e0b', '#d97706']
                        : ['#6366f1', '#8b5cf6']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.instrument}>{sessionData?.instrument}</Text>
                    <Text style={styles.goalText}>Goal: {sessionData?.total_duration} min</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Timer Display Card */}
                <View style={styles.timerCard}>
                    <LinearGradient
                        colors={['#ffffff', '#fafafa']}
                        style={styles.timerGradient}
                    >
                        <Text style={styles.timerLabel}>
                            {isComplete ? '✅ Complete!' : isPaused ? '⏸️ Paused' : '⏱️ Remaining'}
                        </Text>
                        <Text style={styles.timerValue}>
                            {formatTime(remainingSeconds)}
                        </Text>
                        <Text style={styles.elapsedText}>
                            {Math.floor(elapsedSeconds / 60)} min elapsed
                        </Text>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <LinearGradient
                                    colors={isComplete ? ['#10b981', '#059669'] : ['#6366f1', '#8b5cf6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {Math.round(progressPercentage)}% Complete
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Laps Section */}
                <View style={styles.lapsSection}>
                    <View style={styles.lapsSectionHeader}>
                        <Text style={styles.lapsTitle}>Practice Laps</Text>
                        <View style={styles.lapsCount}>
                            <Text style={styles.lapsCountText}>{laps.length}</Text>
                        </View>
                    </View>

                    {laps.length === 0 ? (
                        <View style={styles.noLapsCard}>
                            <Text style={styles.noLapsIcon}>⏱️</Text>
                            <Text style={styles.noLapsText}>
                                Tap "Lap" to log what you're practicing
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.lapsList}>
                            {laps.map((lap, index) => (
                                <View key={index} style={styles.lapCard}>
                                    <LinearGradient
                                        colors={['#ffffff', '#fafafa']}
                                        style={styles.lapGradient}
                                    >
                                        <View style={styles.lapHeader}>
                                            <View style={styles.lapNumberBadge}>
                                                <Text style={styles.lapNumber}>#{lap.lap_number}</Text>
                                            </View>
                                            <Text style={styles.lapDuration}>{lap.time_spent_minutes}m</Text>
                                        </View>
                                        <Text style={styles.lapName}>{lap.item_name}</Text>
                                        <View style={styles.lapTag}>
                                            <Text style={styles.lapType}>{lap.item_type}</Text>
                                        </View>
                                    </LinearGradient>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Bottom spacing */}
                <View style={{ height: 180 }} />
            </ScrollView>

            {/* Controls - Fixed at bottom */}
            <View style={styles.controls}>
                {!isComplete ? (
                    <View style={styles.controlsGrid}>
                        {/* Pause/Resume */}
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={handlePauseResume}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={isPaused ? ['#10b981', '#059669'] : ['#f59e0b', '#d97706']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.controlButtonGradient}
                            >
                                <Text style={styles.controlButtonIcon}>
                                    {isPaused ? '▶️' : '⏸️'}
                                </Text>
                                <Text style={styles.controlButtonText}>
                                    {isPaused ? 'Resume' : 'Pause'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Lap */}
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={handleLap}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#6366f1', '#8b5cf6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.controlButtonGradient}
                            >
                                <Text style={styles.controlButtonIcon}>⏱️</Text>
                                <Text style={styles.controlButtonText}>Lap</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Stop */}
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={handleStop}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#ef4444', '#dc2626']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.controlButtonGradient}
                            >
                                <Text style={styles.controlButtonIcon}>⏹️</Text>
                                <Text style={styles.controlButtonText}>Stop</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.completeButtonContainer}
                        onPress={handleComplete}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#10b981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.completeButtonGradient}
                        >
                            <Text style={styles.completeButtonIcon}>✅</Text>
                            <Text style={styles.completeButtonText}>Complete Session</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafb',
    },
    // Header
    header: {
        paddingTop: 60,
        paddingBottom: 32,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerContent: {
        alignItems: 'center',
    },
    instrument: {
        fontSize: 28,
        fontWeight: '900',
        color: 'white',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    goalText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    // Timer Card
    timerCard: {
        marginHorizontal: 20,
        marginTop: -20,
        marginBottom: 20,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
    },
    timerGradient: {
        padding: 32,
        alignItems: 'center',
    },
    timerLabel: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '700',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    timerValue: {
        fontSize: 80,
        fontWeight: '900',
        color: '#6366f1',
        lineHeight: 88,
        letterSpacing: -3,
    },
    elapsedText: {
        fontSize: 15,
        color: '#94a3b8',
        marginTop: 8,
        fontWeight: '600',
    },
    // Progress
    progressContainer: {
        width: '100%',
        marginTop: 24,
    },
    progressBar: {
        height: 12,
        backgroundColor: '#e2e8f0',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 6,
    },
    progressText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
        color: '#64748b',
        fontWeight: '700',
    },
    // Laps Section
    lapsSection: {
        paddingHorizontal: 20,
    },
    lapsSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    lapsTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.3,
    },
    lapsCount: {
        backgroundColor: '#f0f9ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    lapsCountText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#6366f1',
    },
    noLapsCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    noLapsIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    noLapsText: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 22,
    },
    lapsList: {
        gap: 12,
    },
    lapCard: {
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
        fontSize: 17,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    lapTag: {
        alignSelf: 'flex-start',
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
    // Controls
    controls: {
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
    controlsGrid: {
        gap: 12,
    },
    controlButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    controlButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 10,
    },
    controlButtonIcon: {
        fontSize: 22,
    },
    controlButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    completeButtonContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    completeButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 24,
        gap: 10,
    },
    completeButtonIcon: {
        fontSize: 24,
    },
    completeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
});