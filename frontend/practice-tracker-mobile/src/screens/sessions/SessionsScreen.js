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
import { LinearGradient } from 'expo-linear-gradient';
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
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#a855f7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>Sessions</Text>
            <Text style={styles.subtitle}>Your practice history</Text>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyContent}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>⏱️</Text>
            </View>
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
              colors={['#6366f1']}
              tintColor="#6366f1"
            />
          }
        >

          {/* Header with Gradient */}
          <LinearGradient
            colors={['#6366f1', '#8b5cf6', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={styles.title}>Sessions</Text>
              <Text style={styles.subtitle}>Your practice history</Text>
            </View>

            {sessions.length > 0 && (
              <View style={styles.statsCard}>
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
                  <Text style={styles.statLabel}>Total</Text>
                </View>
              </View>
            )}
          </LinearGradient>

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
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>⏱️</Text>
          <Text style={styles.fabText}>Start</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafb',
  },
  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginHorizontal: -20,
    marginTop: -20,
  },
  headerContent: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 18,
    justifyContent: 'space-around',
    backdropFilter: 'blur(10px)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: -40,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Sessions List
  sessionsList: {
    flex: 1,
    marginTop: -20,
  },
  sessionsListContent: {
    padding: 20,
  },
  // Floating Action Button (FAB)
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    borderRadius: 28,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  fabGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 32,
    marginBottom: 2,
  },
  fabText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});