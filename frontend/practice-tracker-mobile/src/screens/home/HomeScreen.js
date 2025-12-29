import { useState, useEffect, useCallback, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { StatsApi } from '../../services/StatsApi';
import { CombinedApi } from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dashboard data
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [todaySessionCount, setTodaySessionCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
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

  // Navigate to Sessions Screen
  const handleStartPractice = () => {
    navigation.navigate('SessionsTab', {
      screen: 'StartPracticeTimer'
    });
  };

  // Navigate to stats
  const handleViewStats = () => {
    navigation.navigate('Stats');
  };

  // Navigate to sessions
  const handleViewSessions = () => {
    navigation.navigate('SessionsTab');
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get motivational message
  const getMotivationMessage = () => {
    if (currentStreak > 0) {
      return `Keep your ${currentStreak}-day streak alive! 🔥`;
    }
    if (todaySessionCount > 0) {
      return `Great start today! Keep going! 💪`;
    }
    return "Ready to make today count? 🎵";
  };

  // Loading state
  if (isLoading && !weekStats) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#a855f7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.content}>
          
          {/* Today's Overview - Hero Card */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#ffffff', '#fafafa']}
              style={styles.todayCard}
            >
              {/* Main Stats */}
              <View style={styles.todayMain}>
                <View style={styles.todayPrimary}>
                  <View style={styles.bigNumberContainer}>
                    <Text style={styles.todayBigNumber}>{todayMinutes}</Text>
                    <View style={styles.minutesAccent} />
                  </View>
                  <Text style={styles.todayBigLabel}>minutes practiced today</Text>
                </View>
              </View>

              {/* Secondary Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statPill}>
                  <View style={styles.statPillIcon}>
                    <Text style={styles.statEmoji}>🎯</Text>
                  </View>
                  <View style={styles.statPillContent}>
                    <Text style={styles.statPillNumber}>{todaySessionCount}</Text>
                    <Text style={styles.statPillLabel}>Sessions</Text>
                  </View>
                </View>

                <View style={[styles.statPill, styles.streakPill]}>
                  <View style={styles.statPillIcon}>
                    <Text style={styles.statEmoji}>🔥</Text>
                  </View>
                  <View style={styles.statPillContent}>
                    <Text style={styles.statPillNumber}>{currentStreak}</Text>
                    <Text style={styles.statPillLabel}>Day Streak</Text>
                  </View>
                </View>
              </View>

              {/* Motivation Banner */}
              <View style={styles.motivationBanner}>
                <Text style={styles.motivationText}>{getMotivationMessage()}</Text>
              </View>

              {/* Primary CTA */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleStartPractice}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonIcon}>⏱️</Text>
                  <Text style={styles.primaryButtonText}>Start Practice Session</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* This Week Stats */}
          {weekStats && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>This Week</Text>
                  <Text style={styles.sectionSubtitle}>Your progress at a glance</Text>
                </View>
                <TouchableOpacity onPress={handleViewStats} style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Text style={styles.viewAllArrow}>→</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.weekCard}>
                <View style={styles.weekItem}>
                  <View style={styles.weekIconContainer}>
                    <Text style={styles.weekIcon}>⏰</Text>
                  </View>
                  <Text style={styles.weekValue}>
                    {weekStats.hours}h {weekStats.minutes}m
                  </Text>
                  <Text style={styles.weekLabel}>Total Time</Text>
                </View>
                
                <View style={styles.weekDivider} />
                
                <View style={styles.weekItem}>
                  <View style={styles.weekIconContainer}>
                    <Text style={styles.weekIcon}>📝</Text>
                  </View>
                  <Text style={styles.weekValue}>{weekStats.sessionCount}</Text>
                  <Text style={styles.weekLabel}>Sessions</Text>
                </View>
                
                <View style={styles.weekDivider} />
                
                <View style={styles.weekItem}>
                  <View style={styles.weekIconContainer}>
                    <Text style={styles.weekIcon}>📊</Text>
                  </View>
                  <Text style={styles.weekValue}>{weekStats.averageMinutes}m</Text>
                  <Text style={styles.weekLabel}>Avg Length</Text>
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={handleViewSessions}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#f0f9ff', '#e0f2fe']}
                  style={styles.actionGradient}
                >
                  <View style={styles.actionIconContainer}>
                    <Text style={styles.actionIcon}>📖</Text>
                  </View>
                  <Text style={styles.actionTitle}>View Sessions</Text>
                  <Text style={styles.actionSubtitle}>Browse history</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={handleViewStats}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#fef3c7', '#fde68a']}
                  style={styles.actionGradient}
                >
                  <View style={styles.actionIconContainer}>
                    <Text style={styles.actionIcon}>📈</Text>
                  </View>
                  <Text style={styles.actionTitle}>Statistics</Text>
                  <Text style={styles.actionSubtitle}>Track progress</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* Bottom spacing */}
        <View style={{ height: 60 }} />
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
  
  // Header
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  username: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
  
  // Content
  content: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  
  // Hero Section
  heroSection: {
    marginBottom: 32,
  },
  todayCard: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  todayMain: {
    marginBottom: 24,
  },
  todayPrimary: {
    alignItems: 'center',
  },
  bigNumberContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  todayBigNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: '#6366f1',
    lineHeight: 80,
    letterSpacing: -2,
  },
  minutesAccent: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#e0e7ff',
    borderRadius: 3,
    opacity: 0.5,
  },
  todayBigLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  streakPill: {
    backgroundColor: '#fff7ed',
  },
  statPillIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 20,
  },
  statPillContent: {
    flex: 1,
  },
  statPillNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 26,
  },
  statPillLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Motivation Banner
  motivationBanner: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 15,
    color: '#1e40af',
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // Primary Button
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  primaryButtonIcon: {
    fontSize: 24,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },
  
  // Section
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '700',
  },
  viewAllArrow: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '700',
  },
  
  // Week Card
  weekCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  weekItem: {
    flex: 1,
    alignItems: 'center',
  },
  weekIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  weekIcon: {
    fontSize: 20,
  },
  weekValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  weekLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weekDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#e2e8f0',
  },
  
  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionGradient: {
    padding: 24,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
});