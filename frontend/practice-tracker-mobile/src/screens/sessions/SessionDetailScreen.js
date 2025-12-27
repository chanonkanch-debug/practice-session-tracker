import { useState, useEffect } from 'react';
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
  const [sessionItems, setSessionItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Fetch session items when screen loads
  useEffect(() => {
    fetchSessionItems();
  }, []);

  const fetchSessionItems = async () => {
    try {
      setIsLoadingItems(true);
      const data = await SessionApi.getSessionWithItems(session.id);
      setSessionItems(data.items || []);
    } catch (error) {
      console.log('Error fetching session items:', error);
      // Don't show error - some sessions may not have items
    } finally {
      setIsLoadingItems(false);
    }
  };

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
  };

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

  // Check if this is a timer-based session (has laps)
  const isTimerSession = sessionItems.length > 0 && sessionItems[0].lap_number !== null;

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
          <Text style={styles.value}>
            {session.actual_duration || session.total_duration} minutes
          </Text>
          {session.actual_duration && session.actual_duration !== session.total_duration && (
            <Text style={styles.sublabel}>
              Goal: {session.total_duration} min • Actual: {session.actual_duration} min
            </Text>
          )}
          {!session.actual_duration && (
            <Text style={styles.sublabel}>
              {Math.floor(session.total_duration / 60)} hours {session.total_duration % 60} minutes
            </Text>
          )}
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

        {/* Session Items / Laps */}
        {isLoadingItems ? (
          <View style={styles.card}>
            <ActivityIndicator color="#6200ee" />
            <Text style={styles.loadingText}>Loading practice items...</Text>
          </View>
        ) : sessionItems.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.itemsHeader}>
              <Text style={styles.label}>
                {isTimerSession ? `Practice Laps (${sessionItems.length})` : `Practice Items (${sessionItems.length})`}
              </Text>
              {isTimerSession && session.started_at && (
                <Text style={styles.timerBadge}>⏱️ Timer Session</Text>
              )}
            </View>

            {sessionItems.map((item, index) => (
              <View key={item.id || index} style={styles.itemCard}>
                {/* Lap Number (if timer session) */}
                {item.lap_number && (
                  <View style={styles.itemHeader}>
                    <Text style={styles.lapNumber}>Lap {item.lap_number}</Text>
                    <Text style={styles.itemDuration}>{item.time_spent_minutes}m</Text>
                  </View>
                )}

                {/* Item Name */}
                <Text style={styles.itemName}>{item.item_name}</Text>

                {/* Item Details */}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemType}>{item.item_type}</Text>
                  
                  {item.tempo_bpm && (
                    <>
                      <Text style={styles.itemDot}>•</Text>
                      <Text style={styles.itemDetail}>{item.tempo_bpm} BPM</Text>
                    </>
                  )}
                  
                  {item.difficulty_level && (
                    <>
                      <Text style={styles.itemDot}>•</Text>
                      <Text style={styles.itemDetail}>{item.difficulty_level}</Text>
                    </>
                  )}

                  {!item.lap_number && item.time_spent_minutes && (
                    <>
                      <Text style={styles.itemDot}>•</Text>
                      <Text style={styles.itemDetail}>{item.time_spent_minutes}m</Text>
                    </>
                  )}
                </View>

                {/* Lap Times (if timer session) */}
                {item.lap_started_at && item.lap_ended_at && (
                  <Text style={styles.lapTimes}>
                    {item.lap_started_at} → {item.lap_ended_at}
                  </Text>
                )}

                {/* Item Notes */}
                {item.notes && (
                  <Text style={styles.itemNotes}>{item.notes}</Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.label}>Practice Items</Text>
            <Text style={styles.noItems}>No specific items logged for this session</Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.card}>
          <Text style={styles.label}>Created</Text>
          <Text style={styles.sublabel}>
            {new Date(session.created_at).toLocaleString()}
          </Text>
          
          {session.started_at && (
            <>
              <Text style={[styles.label, {marginTop: 10} ]}>Started At</Text>
              <Text style={styles.sublabel}>
                {new Date(session.started_at).toLocaleString()}
              </Text>
            </>
          )}

          {session.completed_at && (
            <>
              <Text style={[styles.label, {marginTop: 10} ]}>Completed At</Text>
              <Text style={styles.sublabel}>
                {new Date(session.completed_at).toLocaleString()}
              </Text>
            </>
          )}
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
  loadingText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  timerBadge: {
    fontSize: 12,
    color: '#6200ee',
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lapNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  itemDuration: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  itemType: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  itemDot: {
    fontSize: 13,
    color: '#ccc',
  },
  itemDetail: {
    fontSize: 13,
    color: '#666',
  },
  lapTimes: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    fontFamily: 'monospace',
  },
  itemNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  noItems: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
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