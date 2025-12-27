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
        { value: 'scale', label: '🎼 Scale', emoji: '🎼' },
        { value: 'piece', label: '🎵 Piece', emoji: '🎵' },
        { value: 'technique', label: '💪 Technique', emoji: '💪' },
        { value: 'exercise', label: '📝 Exercise', emoji: '📝' },
        { value: 'warmup', label: '🔥 Warm-up', emoji: '🔥' },
        { value: 'other', label: '⭐ Other', emoji: '⭐' },
    ];

    const difficulties = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
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
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.emoji}>⏱️</Text>
                        <Text style={styles.title}>Log Practice Lap</Text>
                        <Text style={styles.duration}>Duration: ~{lapDuration} minutes</Text>
                    </View>

                    {/* What did you practice */}
                    <View style={styles.section}>
                        <Text style={styles.label}>What did you practice? *</Text>
                        <TextInput
                            style={styles.input}
                            value={itemName}
                            onChangeText={setItemName}
                            placeholder="e.g., C Major Scale, Moonlight Sonata"
                            autoFocus
                        />
                    </View>

                    {/* Item Type */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Type</Text>
                        <View style={styles.typeGrid}>
                            {itemTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.value}
                                    style={[
                                        styles.typeButton,
                                        itemType === type.value && styles.typeButtonActive,
                                    ]}
                                    onPress={() => setItemType(type.value)}
                                >
                                    <Text style={styles.typeEmoji}>{type.emoji}</Text>
                                    <Text
                                        style={[
                                            styles.typeText,
                                            itemType === type.value && styles.typeTextActive,
                                        ]}
                                    >
                                        {type.value}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Tempo */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Tempo (BPM) - Optional</Text>
                        <TextInput
                            style={styles.input}
                            value={tempoBpm}
                            onChangeText={setTempoBpm}
                            placeholder="e.g., 120"
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Difficulty */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Difficulty</Text>
                        <View style={styles.difficultyButtons}>
                            {difficulties.map((diff) => (
                                <TouchableOpacity
                                    key={diff.value}
                                    style={[
                                        styles.difficultyButton,
                                        difficulty === diff.value && styles.difficultyButtonActive,
                                    ]}
                                    onPress={() => setDifficulty(diff.value)}
                                >
                                    <Text
                                        style={[
                                            styles.difficultyText,
                                            difficulty === diff.value && styles.difficultyTextActive,
                                        ]}
                                    >
                                        {diff.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Notes */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Notes - Optional</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="How did it go? Any observations?"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveLap}>
                        <Text style={styles.saveButtonText}>💾 Save Lap & Resume</Text>
                    </TouchableOpacity>

                    {/* Cancel */}
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
        marginTop: 10,
    },
    emoji: {
        fontSize: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    duration: {
        fontSize: 16,
        color: '#6200ee',
        fontWeight: '600',
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
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    typeButton: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    typeButtonActive: {
        backgroundColor: '#6200ee',
        borderColor: '#6200ee',
    },
    typeEmoji: {
        fontSize: 24,
        marginBottom: 5,
    },
    typeText: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    typeTextActive: {
        color: 'white',
    },
    difficultyButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    difficultyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    difficultyButtonActive: {
        backgroundColor: '#6200ee',
        borderColor: '#6200ee',
    },
    difficultyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    difficultyTextActive: {
        color: 'white',
    },
    saveButton: {
        backgroundColor: '#4caf50',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
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