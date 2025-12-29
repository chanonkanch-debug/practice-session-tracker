import { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SessionCard from '../../components/SessionCard';
import { SessionApi } from '../../services/SessionApi';

export default function SessionsScreen({ navigation }) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch sessions when screen loads
  useEffect(() => {
    fetchSessions();
  }, []);

  // Refetch when screen comes into focus (after creating/editing)
  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [])
  );

  // Fetch sessions from API
  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const response = await SessionApi.getSessions();
      setSessions(response.sessions || []);
    } catch (error) {
      console.log('Error fetching sessions:', error);
      Alert.alert('Error', 'Failed to load sessions. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchSessions();
  };

  // Navigate to session detail
  const handleSessionPress = (session) => {
    navigation.navigate('SessionDetail', { session });
  };

  // Navigate to timer
  const handleStartPractice = () => {
    navigation.navigate('StartPracticeTimer');
  };

  // Calculate quick stats
  const getTodayCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(s => {
      const sessionDate = new Date(s.practice_date).toISOString().split('T')[0];
      return sessionDate === today;
    }).length;
  };

  const getWeekCount = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessions.filter(s => new Date(s.practice_date) >= weekAgo).length;
  };

  const getTotalMinutes = () => {
    return sessions.reduce((sum, s) => {
      return sum + (s.actual_duration || s.total_duration);
    }, 0);
  };

  // Loading state
  if (isLoading && sessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Practice Sessions</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Sessions</Text>
          <Text style={styles.headerSubtitle}>Your practice history</Text>
        </View>
        
        {sessions.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessions.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getTodayCount()}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getWeekCount()}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(getTotalMinutes() / 60)}h</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
          </View>
        )}
      </View>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyContent}>
            <Text style={styles.emptyIcon}>⏱️</Text>
            <Text style={styles.emptyTitle}>No Sessions Yet</Text>
            <Text style={styles.emptyText}>
              Start tracking your practice journey!
            </Text>
            <Text style={styles.emptySubtext}>
              Tap the timer button below to begin your first session
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView 
          style={styles.sessionsList}
          contentContainerStyle={styles.sessionsListContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#6200ee']}
              tintColor="#6200ee"
            />
          }
        >
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              date={session.practice_date}
              duration={session.total_duration}
              actualDuration={session.actual_duration}
              instrument={session.instrument}
              notes={session.session_notes}
              onPress={() => handleSessionPress(session)}
            />
          ))}
          {/* Extra padding at bottom so FAB doesn't cover last item */}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleStartPractice}
        activeOpacity={0.8}
      >
        <View style={styles.fabContent}>
          <Text style={styles.fabIcon}>⏱️</Text>
          <Text style={styles.fabText}>Start</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Header
  header: {
    backgroundColor: '#6200ee',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 280,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  // Sessions List
  sessionsList: {
    flex: 1,
  },
  sessionsListContent: {
    padding: 16,
  },
  // Floating Action Button (FAB)
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabContent: {
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 28,
    marginBottom: 2,
  },
  fabText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
