import { useState, useContext } from 'react';
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
import { TimerContext } from '../../context/TimerContext';

export default function AddLapScreen({ navigation }) {
    const { addLap, resumeTimer, elapsedSeconds, currentLapStart } = useContext(TimerContext);

    const [itemName, setItemName] = useState('');
    const [itemType, setItemType] = useState('scale');
    const [tempoBpm, setTempoBpm] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [notes, setNotes] = useState('');

    // Calculate this lap's duration
    const lapDuration = Math.round((elapsedSeconds - (currentLapStart || 0)) / 60);

    const itemTypes = [
        { value: 'scale', label: 'Scale', emoji: '🎼' },
        { value: 'piece', label: 'Piece', emoji: '🎵' },
        { value: 'technique', label: 'Technique', emoji: '💪' },
        { value: 'exercise', label: 'Exercise', emoji: '📝' },
        { value: 'warmup', label: 'Warm-up', emoji: '🔥' },
        { value: 'other', label: 'Other', emoji: '⭐' },
    ];

    const difficulties = [
        { value: 'beginner', label: 'Beginner', emoji: '🌱' },
        { value: 'medium', label: 'Medium', emoji: '🎯' },
        { value: 'advanced', label: 'Advanced', emoji: '🚀' },
    ];

    const handleSaveLap = () => {
        // Validation
        if (!itemName.trim()) {
            Alert.alert('Error', 'Please enter what you practiced');
            return;
        }

        // Create lap data
        const lapData = {
            item_name: itemName.trim(),
            item_type: itemType,
            tempo_bpm: tempoBpm ? parseInt(tempoBpm) : null,
            difficulty_level: difficulty,
            notes: notes.trim() || null,
        };

        // Add lap to context
        addLap(lapData);

        // Show success
        Alert.alert(
            'Lap Saved! 🎉',
            `Logged ${lapDuration} min of ${itemName}`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        resumeTimer();
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const handleCancel = () => {
        Alert.alert(
            'Discard Lap?',
            'Timer will resume without saving this lap.',
            [
                { text: 'Keep Editing', style: 'cancel' },
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => {
                        resumeTimer();
                        navigation.goBack();
                    },
                },
            ]
        );
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
                    <Text style={styles.title}>Log Practice Lap</Text>
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>Duration: ~{lapDuration} min</Text>
                    </View>
                </LinearGradient>

                {/* Form Container */}
                <View style={styles.formContainer}>
                    {/* What did you practice */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>What did you practice? *</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputIcon}>🎵</Text>
                            <TextInput
                                style={styles.input}
                                value={itemName}
                                onChangeText={setItemName}
                                placeholder="e.g., C Major Scale, Exercise"
                                placeholderTextColor="#94a3b8"
                                autoFocus
                            />
                        </View>
                    </View>

                    {/* Item Type */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Type</Text>
                        <View style={styles.typeGrid}>
                            {itemTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.value}
                                    style={styles.typeButton}
                                    onPress={() => setItemType(type.value)}
                                    activeOpacity={0.7}
                                >
                                    <LinearGradient
                                        colors={
                                            itemType === type.value
                                                ? ['#6366f1', '#8b5cf6']
                                                : ['#ffffff', '#ffffff']
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[
                                            styles.typeButtonGradient,
                                            itemType !== type.value && styles.typeButtonInactive
                                        ]}
                                    >
                                        <Text style={styles.typeEmoji}>{type.emoji}</Text>
                                        <Text
                                            style={[
                                                styles.typeText,
                                                itemType === type.value && styles.typeTextActive,
                                            ]}
                                        >
                                            {type.label}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Tempo */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Tempo (BPM) - Optional</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputIcon}>🎶</Text>
                            <TextInput
                                style={styles.input}
                                value={tempoBpm}
                                onChangeText={setTempoBpm}
                                placeholder="e.g., 120"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Difficulty */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Difficulty</Text>
                        <View style={styles.difficultyButtons}>
                            {difficulties.map((diff) => (
                                <TouchableOpacity
                                    key={diff.value}
                                    style={styles.difficultyButton}
                                    onPress={() => setDifficulty(diff.value)}
                                    activeOpacity={0.7}
                                >
                                    <LinearGradient
                                        colors={
                                            difficulty === diff.value
                                                ? ['#6366f1', '#8b5cf6']
                                                : ['#ffffff', '#ffffff']
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[
                                            styles.difficultyButtonGradient,
                                            difficulty !== diff.value && styles.difficultyButtonInactive
                                        ]}
                                    >
                                        <Text style={styles.difficultyEmoji}>{diff.emoji}</Text>
                                        <Text
                                            style={[
                                                styles.difficultyText,
                                                difficulty === diff.value && styles.difficultyTextActive,
                                            ]}
                                        >
                                            {diff.label}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Notes */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Notes - Optional</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Text style={[styles.inputIcon, styles.textAreaIcon]}>📝</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="How did it go? Any observations?"
                                placeholderTextColor="#94a3b8"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveLap}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#10b981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveButtonGradient}
                        >
                            <Text style={styles.saveButtonIcon}>💾</Text>
                            <Text style={styles.saveButtonText}>Save Lap & Resume</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Cancel */}
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    durationBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    durationText: {
        fontSize: 15,
        color: 'white',
        fontWeight: '700',
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
    // Type Grid
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    typeButton: {
        flex: 1,
        minWidth: '30%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    typeButtonGradient: {
        padding: 14,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 12,
    },
    typeButtonInactive: {
        borderColor: '#e2e8f0',
    },
    typeEmoji: {
        fontSize: 28,
        marginBottom: 6,
    },
    typeText: {
        fontSize: 12,
        color: '#64748b',
        textTransform: 'capitalize',
        fontWeight: '700',
    },
    typeTextActive: {
        color: 'white',
    },
    // Difficulty Buttons
    difficultyButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    difficultyButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    difficultyButtonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 12,
    },
    difficultyButtonInactive: {
        borderColor: '#e2e8f0',
    },
    difficultyEmoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    difficultyText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    difficultyTextActive: {
        color: 'white',
    },
    // Save Button
    saveButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
        marginTop: 8,
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