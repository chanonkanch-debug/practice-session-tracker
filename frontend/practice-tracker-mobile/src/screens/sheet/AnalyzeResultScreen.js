import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';

export default function AnalysisResultScreen({ route, navigation }) {
    const { analysis } = route.params;

    const handleAddToPractice = () => {
        Alert.alert(
            'Add to Practice',
            'This feature is coming soon! You will be able to add these recommendations directly to your practice session.',
            [{ text: 'OK' }]
        );
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner': return '#4caf50';
            case 'intermediate': return '#ff9800';
            case 'advanced': return '#f44336';
            default: return '#666';
        }
    };

    const getTypeEmoji = (type) => {
        switch (type) {
            case 'scale': return '🎵';
            case 'arpeggio': return '🎹';
            case 'exercise': return '💪';
            case 'technique': return '🎯';
            default: return '📝';
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            {/* Success Header */}
            <View style={styles.successHeader}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successTitle}>Analysis Complete!</Text>
            </View>

            {/* Key Information */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Sheet Music Details</Text>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Key:</Text>
                    <Text style={styles.detailValue}>{analysis.key_signature || 'Unknown'}</Text>
                </View>

                {analysis.tempo && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Tempo:</Text>
                        <Text style={styles.detailValue}>{analysis.tempo} BPM</Text>
                    </View>
                )}

                {analysis.time_signature && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Time:</Text>
                        <Text style={styles.detailValue}>{analysis.time_signature}</Text>
                    </View>
                )}

                {analysis.difficulty && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Difficulty:</Text>
                        <View style={[
                            styles.difficultyBadge,
                            { backgroundColor: getDifficultyColor(analysis.difficulty) }
                        ]}>
                            <Text style={styles.difficultyText}>
                                {analysis.difficulty.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Techniques */}
            {analysis.techniques && analysis.techniques.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Required Techniques</Text>
                    <View style={styles.techniquesList}>
                        {analysis.techniques.map((technique, index) => (
                            <View key={index} style={styles.techniqueBadge}>
                                <Text style={styles.techniqueText}>{technique}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Practice Recommendations</Text>

                    {analysis.recommendations.map((rec, index) => (
                        <View key={index} style={styles.recommendationCard}>
                            <View style={styles.recommendationHeader}>
                                <Text style={styles.recommendationEmoji}>
                                    {getTypeEmoji(rec.type)}
                                </Text>
                                <View style={styles.recommendationTitleContainer}>
                                    <Text style={styles.recommendationName}>{rec.name}</Text>
                                    <Text style={styles.recommendationType}>{rec.type}</Text>
                                </View>
                                {rec.suggested_tempo && (
                                    <Text style={styles.recommendationTempo}>
                                        {rec.suggested_tempo} BPM
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.recommendationDescription}>
                                {rec.description}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Analysis Notes */}
            {analysis.analysis_notes && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Analysis Notes</Text>
                    <Text style={styles.notesText}>{analysis.analysis_notes}</Text>
                </View>
            )}

            {/* Action Buttons */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToPractice}
            >
                <Text style={styles.addButtonText}>➕ Add to Practice Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.doneButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    successHeader: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 20,
    },
    successIcon: {
        fontSize: 60,
        marginBottom: 12,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    techniquesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    techniqueBadge: {
        backgroundColor: '#f3e5f5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    techniqueText: {
        color: '#6200ee',
        fontSize: 13,
        fontWeight: '600',
    },
    recommendationCard: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#6200ee',
    },
    recommendationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    recommendationEmoji: {
        fontSize: 24,
    },
    recommendationTitleContainer: {
        flex: 1,
    },
    recommendationName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    recommendationType: {
        fontSize: 12,
        color: '#999',
        textTransform: 'capitalize',
    },
    recommendationTempo: {
        fontSize: 14,
        color: '#6200ee',
        fontWeight: '600',
    },
    recommendationDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    notesText: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    addButton: {
        backgroundColor: '#6200ee',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 12,
    },
    addButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    doneButton: {
        padding: 16,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});