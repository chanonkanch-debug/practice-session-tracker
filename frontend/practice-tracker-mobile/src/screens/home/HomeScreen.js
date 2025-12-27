import { useState, useEffect, useCallback, useContext } from 'react';
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
import { AuthContext } from '../../context/AuthContext';
import { StatsApi } from '../../services/StatsApi';
import { CombinedApi } from '../../services/api';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dashboard data
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [todaySessionCount, setTodaySessionCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [recentSessions, setRecentSessions] = useState([]);
  const [weekStats, setWeekStats] = useState(null);

  // Fetch dashboard data when screen loads
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch today's summary and week stats
      const [summaryData, weekData] = await Promise.all([
        CombinedApi.getTodaySummary(),
        StatsApi.getTotalTime('week'),
      ]);

      setTodayMinutes(summaryData.todayMinutes);
      setTodaySessionCount(summaryData.todaySessionCount);
      setCurrentStreak(summaryData.currentStreak);
      setRecentSessions(summaryData.recentSessions);
      setWeekStats(weekData);

    } catch (error) {
      console.log('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  // Navigate to timer (instead of static add session)
  const handleStartPractice = () => {
    navigation.navigate('SessionsTab', {
      screen: 'StartPracticeTimer'  // Changed from 'AddSession'
    });
  };

  // Navigate to stats
  const handleViewStats = () => {
    navigation.navigate('Stats');
  };

  // Navigate to session detail
  const handleSessionPress = (session) => {
    navigation.navigate('SessionsTab', {
      screen: 'SessionDetail',
      params: { session }
    });
  };

  // Loading state
  if (isLoading && !weekStats) {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#6200ee']}
          />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome Back, {user?.username}! 👋</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>

        {/* Today's Practice Summary */}
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Practice</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{todayMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{todaySessionCount}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          {todaySessionCount === 0 && (
            <View style={styles.motivationBox}>
              <Text style={styles.motivationText}>
                {currentStreak > 0
                  ? `🔥 Keep your ${currentStreak}-day streak alive!`
                  : "🎵 Start your practice for today!"
                }
              </Text>
            </View>
          )}
        </View>

        {/* This Week Summary */}
        {weekStats && (
          <View style={styles.weekSection}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.weekCard}>
              <View style={styles.weekStat}>
                <Text style={styles.weekLabel}>Total Time</Text>
                <Text style={styles.weekValue}>
                  {weekStats.hours}h {weekStats.minutes}m
                </Text>
              </View>
              <View style={styles.weekDivider} />
              <View style={styles.weekStat}>
                <Text style={styles.weekLabel}>Sessions</Text>
                <Text style={styles.weekValue}>{weekStats.sessionCount}</Text>
              </View>
              <View style={styles.weekDivider} />
              <View style={styles.weekStat}>
                <Text style={styles.weekLabel}>Avg/Session</Text>
                <Text style={styles.weekValue}>{weekStats.averageMinutes}m</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SessionsTab')}>
                <Text style={styles.seeAllText}>See All →</Text>
              </TouchableOpacity>
            </View>

            {recentSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={styles.recentSessionCard}
                onPress={() => handleSessionPress(session)}
              >
                <View style={styles.sessionLeft}>
                  <Text style={styles.sessionInstrument}>
                    {session.instrument || '🎵'}
                  </Text>
                  <View>
                    <Text style={styles.sessionDate}>
                      {new Date(session.practice_date).toLocaleDateString()}
                    </Text>
                    {session.session_notes && (
                      <Text style={styles.sessionNotes} numberOfLines={1}>
                        {session.session_notes}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={styles.sessionDuration}>
                  {session.total_duration}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleStartPractice}
          >
            <Text style={styles.actionIcon}>📝</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Start Practice Session</Text>
              <Text style={styles.actionSubtitle}>Log your practice now</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewStats}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>View Statistics</Text>
              <Text style={styles.actionSubtitle}>See your progress</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
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
  welcomeSection: {
    backgroundColor: '#6200ee',
    padding: 25,
    paddingTop: 60,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  // Today's Practice
  todaySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  motivationBox: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  motivationText: {
    fontSize: 16,
    color: '#e65100',
    fontWeight: '600',
    textAlign: 'center',
  },
  // This Week
  weekSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  weekCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekStat: {
    flex: 1,
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  weekValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  weekDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  // Recent Sessions
  recentSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600',
  },
  recentSessionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionInstrument: {
    fontSize: 32,
    marginRight: 15,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  sessionNotes: {
    fontSize: 12,
    color: '#999',
  },
  sessionDuration: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  // Quick Actions
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});