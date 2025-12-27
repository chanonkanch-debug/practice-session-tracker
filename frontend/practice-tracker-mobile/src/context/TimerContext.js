import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    // Timer state
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [goalSeconds, setGoalSeconds] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [sessionData, setSessionData] = useState(null);
    const [laps, setLaps] = useState([]);
    const [currentLapStart, setCurrentLapStart] = useState(0);

    // Ref for interval
    const intervalRef = useRef(null);

    // Load any active session from storage on mount
    useEffect(() => {
        loadActiveSession();
    }, []);

    // Timer tick
    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = setInterval(() => {
                setElapsedSeconds(prev => {
                    const newElapsed = prev + 1;

                    // Check if timer is complete
                    if (newElapsed >= goalSeconds) {
                        handleTimerComplete();
                        return goalSeconds;
                    }

                    return newElapsed;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, isPaused, goalSeconds]);

    // Save active session to AsyncStorage whenever it changes
    useEffect(() => {
        if (isActive) {
            saveActiveSession();
        }
    }, [isActive, isPaused, elapsedSeconds, sessionData, laps]);

    // Load active session from AsyncStorage
    const loadActiveSession = async () => {
        try {
            const savedSession = await AsyncStorage.getItem('activeTimerSession');
            if (savedSession) {
                const parsed = JSON.parse(savedSession);

                // Ask user if they want to resume
                Alert.alert(
                    'Resume Session?',
                    'You have an active practice session. Do you want to resume?',
                    [
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: async () => {
                                await AsyncStorage.removeItem('activeTimerSession');
                            }
                        },
                        {
                            text: 'Resume',
                            onPress: () => {
                                setIsActive(true);
                                setIsPaused(parsed.isPaused);
                                setGoalSeconds(parsed.goalSeconds);
                                setElapsedSeconds(parsed.elapsedSeconds);
                                setSessionData(parsed.sessionData);
                                setLaps(parsed.laps || []);
                                setCurrentLapStart(parsed.currentLapStart || 0);
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.log('Error loading active session:', error);
        }
    };

    // Save active session to AsyncStorage
    const saveActiveSession = async () => {
        try {
            const sessionToSave = {
                isActive,
                isPaused,
                goalSeconds,
                elapsedSeconds,
                sessionData,
                laps,
                currentLapStart,
            };
            await AsyncStorage.setItem('activeTimerSession', JSON.stringify(sessionToSave));
        } catch (error) {
            console.log('Error saving active session:', error);
        }
    };

    // Clear saved session
    const clearSavedSession = async () => {
        try {
            await AsyncStorage.removeItem('activeTimerSession');
        } catch (error) {
            console.log('Error clearing saved session:', error);
        }
    };

    // Start new timer session
    const startTimer = (durationMinutes, instrument, notes = '') => {
        const goalSecs = durationMinutes * 60;

        setGoalSeconds(goalSecs);
        setElapsedSeconds(0);
        setIsActive(true);
        setIsPaused(false);
        setLaps([]);
        setCurrentLapStart(0);
        setSessionData({
            practice_date: new Date().toISOString().split('T')[0],
            total_duration: durationMinutes,
            instrument,
            session_notes: notes,
            started_at: new Date().toISOString(),
            status: 'active',
        });
    };

    // Pause timer
    const pauseTimer = () => {
        setIsPaused(true);
    };

    // Resume timer
    const resumeTimer = () => {
        setIsPaused(false);
    };

    // Stop timer (abandon session)
    const stopTimer = async () => {
        setIsActive(false);
        setIsPaused(false);
        setGoalSeconds(0);
        setElapsedSeconds(0);
        setSessionData(null);
        setLaps([]);
        setCurrentLapStart(0);
        await clearSavedSession();
    };

    // Add a lap
    const addLap = (lapData) => {
        const lapDuration = elapsedSeconds - currentLapStart;

        const newLap = {
            ...lapData,
            lap_number: laps.length + 1,
            time_spent_minutes: Math.max(1, Math.round(lapDuration / 60)),  // CHANGED: At least 1 minute
            started_at: formatLapTime(currentLapStart),
            ended_at: formatLapTime(elapsedSeconds),
        };

        setLaps(prev => [...prev, newLap]);
        setCurrentLapStart(elapsedSeconds);

        return newLap;
    };

    // Format lap time as HH:MM:SS
    const formatLapTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Handle timer completion
    const handleTimerComplete = async () => {
        setIsActive(false);
        setIsPaused(true); // Keep paused so we can show completion screen

        // Will be handled by the completion screen
    };

    // Get session summary for saving
    const getSessionSummary = () => {
        return {
            ...sessionData,
            actual_duration: Math.round(elapsedSeconds / 60),
            completed_at: new Date().toISOString(),
            status: 'completed',
        };
    };

    // Calculate remaining time
    const getRemainingSeconds = () => {
        return Math.max(0, goalSeconds - elapsedSeconds);
    };

    // Calculate remaining time formatted
    const getRemainingFormatted = () => {
        const remaining = getRemainingSeconds();
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const value = {
        // State
        isActive,
        isPaused,
        goalSeconds,
        elapsedSeconds,
        sessionData,
        laps,

        // Computed
        remainingSeconds: getRemainingSeconds(),
        remainingFormatted: getRemainingFormatted(),

        // Actions
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        addLap,
        getSessionSummary,
        clearSavedSession,
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
};