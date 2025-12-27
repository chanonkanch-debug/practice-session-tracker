import { useContext, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';  // CHANGED
import { useEffect } from 'react';  // ADD THIS
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
            'Stop Practice?',
            'Are you sure you want to stop this practice session? All progress will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Stop',
                    style: 'destructive',
                    onPress: async () => {
                        await stopTimer();
                        navigation.navigate('SessionsList');
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

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.instrument}>{sessionData?.instrument}</Text>
                <Text style={styles.goalText}>Goal: {sessionData?.total_duration} min</Text>
            </View>

            {/* Timer Display */}
            <View style={styles.timerContainer}>
                <Text style={styles.timerLabel}>
                    {isComplete ? 'Complete!' : isPaused ? 'Paused' : 'Remaining'}
                </Text>
                <Text style={styles.timerValue}>
                    {formatTime(remainingSeconds)}
                </Text>
                <Text style={styles.elapsedText}>
                    {Math.floor(elapsedSeconds / 60)} min elapsed
                </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${(elapsedSeconds / goalSeconds) * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {Math.round((elapsedSeconds / goalSeconds) * 100)}% Complete
                </Text>
            </View>

            {/* Laps */}
            <View style={styles.lapsContainer}>
                <Text style={styles.lapsTitle}>
                    Laps ({laps.length})
                </Text>
                {laps.length === 0 ? (
                    <Text style={styles.noLaps}>
                        Tap "Lap" to log what you're practicing
                    </Text>
                ) : (
                    <ScrollView style={styles.lapsList}>
                        {laps.map((lap, index) => (
                            <View key={index} style={styles.lapItem}>
                                <View style={styles.lapHeader}>
                                    <Text style={styles.lapNumber}>#{lap.lap_number}</Text>
                                    <Text style={styles.lapDuration}>{lap.time_spent_minutes}m</Text>
                                </View>
                                <Text style={styles.lapName}>{lap.item_name}</Text>
                                <Text style={styles.lapType}>{lap.item_type}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                {!isComplete ? (
                    <>
                        {/* Pause/Resume */}
                        <TouchableOpacity
                            style={[styles.controlButton, styles.pauseButton]}
                            onPress={handlePauseResume}
                        >
                            <Text style={styles.controlButtonText}>
                                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                            </Text>
                        </TouchableOpacity>

                        {/* Lap */}
                        <TouchableOpacity
                            style={[styles.controlButton, styles.lapButton]}
                            onPress={handleLap}
                        >
                            <Text style={styles.controlButtonText}>⏱️ Lap</Text>
                        </TouchableOpacity>

                        {/* Stop */}
                        <TouchableOpacity
                            style={[styles.controlButton, styles.stopButton]}
                            onPress={handleStop}
                        >
                            <Text style={styles.controlButtonText}>⏹️ Stop</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.controlButton, styles.completeButton]}
                        onPress={handleComplete}
                    >
                        <Text style={styles.controlButtonText}>✅ Complete Session</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#6200ee',
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    instrument: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    goalText: {
        fontSize: 16,
        color: 'white',
        opacity: 0.9,
    },
    timerContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    timerLabel: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    timerValue: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    elapsedText: {
        fontSize: 16,
        color: '#999',
        marginTop: 10,
    },
    progressContainer: {
        paddingHorizontal: 30,
        marginBottom: 20,
    },
    progressBar: {
        height: 12,
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#6200ee',
    },
    progressText: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
    lapsContainer: {
        flex: 1,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    lapsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    noLaps: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 20,
    },
    lapsList: {
        flex: 1,
    },
    lapItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    lapHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    lapNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    lapDuration: {
        fontSize: 14,
        color: '#666',
    },
    lapName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    lapType: {
        fontSize: 12,
        color: '#999',
        textTransform: 'capitalize',
    },
    controls: {
        padding: 20,
        gap: 12,
    },
    controlButton: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    pauseButton: {
        backgroundColor: '#ff9800',
    },
    lapButton: {
        backgroundColor: '#2196f3',
    },
    stopButton: {
        backgroundColor: '#f44336',
    },
    completeButton: {
        backgroundColor: '#4caf50',
    },
    controlButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});