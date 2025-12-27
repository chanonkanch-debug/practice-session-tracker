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

  // Navigate to timer (changed from AddSession)
  const handleStartPractice = () => {
    navigation.navigate('StartPracticeTimer');
  };

  // Loading state
  if (isLoading && sessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Practice Sessions</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Practice Sessions</Text>
        <Text style={styles.subtitle}>{sessions.length} sessions</Text>
      </View>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⏱️</Text>
          <Text style={styles.emptyTitle}>No Sessions Yet</Text>
          <Text style={styles.emptyText}>
            Start your first practice session by tapping the timer button below!
          </Text>
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
            />
          }
        >
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              date={new Date(session.practice_date).toLocaleDateString()}
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

      {/* Floating Action Button (FAB) - Changed to Timer */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleStartPractice}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>⏱️</Text>
      </TouchableOpacity>
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
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  sessionsList: {
    flex: 1,
  },
  sessionsListContent: {
    padding: 15,
  },
  // Floating Action Button (FAB)
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
});