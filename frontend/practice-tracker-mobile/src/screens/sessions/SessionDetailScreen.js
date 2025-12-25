import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SessionApi } from '../../services/SessionApi';

export default function SessionDetailScreen({ route, navigation }) {
    const { session } = route.params;
    const [isDeleting, setIsDeleting] = useState(false);

    // Handle edit
    const handleEdit = () => {
        navigation.navigate('EditSession', { session });
    };

    // Handle delete
    const handleDelete = () => {
        Alert.alert(
            'Delete Session',
            'Are you sure you want to delete this session? This cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: confirmDelete
                }
            ]
        );
    }

    // Confirm and delete
    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            await SessionApi.deleteSession(session.id);

            Alert.alert('Success', 'Session deleted successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to delete session');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Session Info Cards */}
                <View style={styles.card}>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>
                        {new Date(session.practice_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Duration</Text>
                    <Text style={styles.value}>{session.total_duration} minutes</Text>
                    <Text style={styles.sublabel}>
                        {Math.floor(session.total_duration / 60)} hours {session.total_duration % 60} minutes
                    </Text>
                </View>

                {session.instrument && (
                    <View style={styles.card}>
                        <Text style={styles.label}>Instrument</Text>
                        <Text style={styles.value}>{session.instrument}</Text>
                    </View>
                )}

                {session.session_notes && (
                    <View style={styles.card}>
                        <Text style={styles.label}>Notes</Text>
                        <Text style={styles.value}>{session.session_notes}</Text>
                    </View>
                )}

                {/* Metadata */}
                <View style={styles.card}>
                    <Text style={styles.label}>Created</Text>
                    <Text style={styles.sublabel}>
                        {new Date(session.created_at).toLocaleString()}
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={handleEdit}
                        disabled={isDeleting}
                    >
                        <Text style={styles.actionButtonText}>✏️  Edit Session</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.actionButtonText}>🗑️  Delete Session</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  sublabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#6200ee',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});