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
import { LinearGradient } from 'expo-linear-gradient';
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Text style={styles.heroLabel}>Practice Session</Text>
            <Text style={styles.heroDuration}>
              {session.actual_duration || session.total_duration}
            </Text>
            <Text style={styles.heroMinutes}>minutes</Text>
          </LinearGradient>
        </View>

        {/* Date Card */}
        <View style={styles.card}>
          <View style={styles.cardIconContainer}>
            <Text style={styles.cardIcon}>📅</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Date</Text>
            <Text style={styles.cardValue}>
              {new Date(session.practice_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>

        {/* Duration Details */}
        <View style={styles.card}>
          <View style={styles.cardIconContainer}>
            <Text style={styles.cardIcon}>⏱️</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Duration</Text>
            <Text style={styles.cardValue}>
              {session.actual_duration || session.total_duration} minutes
            </Text>
            {session.actual_duration && session.actual_duration !== session.total_duration && (
              <Text style={styles.cardSubtext}>
                Goal: {session.total_duration} min • Actual: {session.actual_duration} min
              </Text>
            )}
            {!session.actual_duration && (
              <Text style={styles.cardSubtext}>
                {Math.floor(session.total_duration / 60)}h {session.total_duration % 60}m
              </Text>
            )}
          </View>
        </View>

        {/* Instrument */}
        {session.instrument && (
          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>🎵</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Instrument</Text>
              <Text style={styles.cardValue}>{session.instrument}</Text>
            </View>
          </View>
        )}

        {/* Notes */}
        {session.session_notes && (
          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>📝</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Notes</Text>
              <Text style={styles.cardValue}>{session.session_notes}</Text>
            </View>
          </View>
        )}

        {/* Session Items / Laps */}
        {isLoadingItems ? (
          <View style={styles.card}>
            <ActivityIndicator color="#6366f1" />
            <Text style={styles.loadingText}>Loading practice items...</Text>
          </View>
        ) : sessionItems.length > 0 ? (
          <View style={styles.itemsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {isTimerSession ? `Practice Laps (${sessionItems.length})` : `Practice Items (${sessionItems.length})`}
              </Text>
              {isTimerSession && session.started_at && (
                <View style={styles.timerBadge}>
                  <Text style={styles.timerBadgeText}>⏱️ Timer Session</Text>
                </View>
              )}
            </View>

            {sessionItems.map((item, index) => (
              <View key={item.id || index} style={styles.itemCard}>
                <LinearGradient
                  colors={['#ffffff', '#fafafa']}
                  style={styles.itemGradient}
                >
                  {/* Lap Number (if timer session) */}
                  {item.lap_number && (
                    <View style={styles.itemHeader}>
                      <View style={styles.lapBadge}>
                        <Text style={styles.lapNumber}>Lap {item.lap_number}</Text>
                      </View>
                      <Text style={styles.itemDuration}>{item.time_spent_minutes}m</Text>
                    </View>
                  )}

                  {/* Item Name */}
                  <Text style={styles.itemName}>{item.item_name}</Text>

                  {/* Item Details */}
                  <View style={styles.itemDetails}>
                    <View style={styles.itemTag}>
                      <Text style={styles.itemType}>{item.item_type}</Text>
                    </View>
                    
                    {item.tempo_bpm && (
                      <View style={styles.itemTag}>
                        <Text style={styles.itemDetail}>{item.tempo_bpm} BPM</Text>
                      </View>
                    )}
                    
                    {item.difficulty_level && (
                      <View style={styles.itemTag}>
                        <Text style={styles.itemDetail}>{item.difficulty_level}</Text>
                      </View>
                    )}

                    {!item.lap_number && item.time_spent_minutes && (
                      <View style={styles.itemTag}>
                        <Text style={styles.itemDetail}>{item.time_spent_minutes}m</Text>
                      </View>
                    )}
                  </View>

                  {/* Lap Times */}
                  {item.lap_started_at && item.lap_ended_at && (
                    <Text style={styles.lapTimes}>
                      {item.lap_started_at} → {item.lap_ended_at}
                    </Text>
                  )}

                  {/* Item Notes */}
                  {item.notes && (
                    <View style={styles.itemNotesContainer}>
                      <Text style={styles.itemNotes}>{item.notes}</Text>
                    </View>
                  )}
                </LinearGradient>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>📋</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Practice Items</Text>
              <Text style={styles.noItems}>No specific items logged for this session</Text>
            </View>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadataCard}>
          <Text style={styles.metadataTitle}>Session Details</Text>
          
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Created</Text>
            <Text style={styles.metadataValue}>
              {new Date(session.created_at).toLocaleString()}
            </Text>
          </View>
          
          {session.started_at && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Started At</Text>
              <Text style={styles.metadataValue}>
                {new Date(session.started_at).toLocaleString()}
              </Text>
            </View>
          )}

          {session.completed_at && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Completed At</Text>
              <Text style={styles.metadataValue}>
                {new Date(session.completed_at).toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEdit}
            disabled={isDeleting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonIcon}>✏️</Text>
              <Text style={styles.buttonText}>Edit Session</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isDeleting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {isDeleting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.buttonIcon}>🗑️</Text>
                  <Text style={styles.buttonText}>Delete Session</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  // Hero Card
  heroCard: {
    margin: 20,
    marginBottom: 16,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  heroGradient: {
    padding: 32,
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroDuration: {
    fontSize: 64,
    fontWeight: '900',
    color: 'white',
    lineHeight: 72,
    letterSpacing: -2,
  },
  heroMinutes: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  // Info Cards
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '700',
    lineHeight: 22,
  },
  cardSubtext: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  noItems: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  // Items Section
  itemsSection: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.3,
  },
  timerBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerBadgeText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700',
  },
  itemCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  itemGradient: {
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lapBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lapNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6366f1',
  },
  itemDuration: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '700',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  itemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  itemType: {
    fontSize: 12,
    color: '#475569',
    textTransform: 'capitalize',
    fontWeight: '700',
  },
  itemDetail: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  lapTimes: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 10,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  itemNotesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  itemNotes: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  // Metadata Card
  metadataCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  metadataTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  metadataLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  metadataValue: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  // Action Buttons
  actionButtons: {
    marginHorizontal: 20,
    gap: 12,
  },
  editButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  deleteButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});