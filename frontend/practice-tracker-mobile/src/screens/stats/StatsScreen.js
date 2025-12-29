import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatsApi } from '../../services/StatsApi';

export default function StatsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stats data
  const [totalTime, setTotalTime] = useState(null);
  const [streak, setStreak] = useState(null);
  const [consistency, setConsistency] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [instruments, setInstruments] = useState([]);

  // Filters
  const [timeframe, setTimeframe] = useState('all');

  // Fetch all stats when screen loads
  useEffect(() => {
    fetchAllStats();
  }, [timeframe]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAllStats();
    }, [timeframe])
  );

  // Fetch all stats from API
  const fetchAllStats = async () => {
    try {
      setIsLoading(true);

      const [
        totalTimeData,
        streakData,
        consistencyData,
        topItemsData,
        instrumentsData,
      ] = await Promise.all([
        StatsApi.getTotalTime(timeframe),
        StatsApi.getStreak(),
        StatsApi.getConsistency(30),
        StatsApi.getTopItems(5),
        StatsApi.getInstruments(),
      ]);

      setTotalTime(totalTimeData);
      setStreak(streakData);
      setConsistency(consistencyData);
      setTopItems(topItemsData.topItems || []);
      setInstruments(instrumentsData.instruments || []);

    } catch (error) {
      console.log('Error fetching stats:', error);
      Alert.alert('Error', 'Failed to load statistics. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAllStats();
  };

  // Change timeframe
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  // Get instrument emoji
  const getInstrumentEmoji = (instrument) => {
    if (!instrument) return '🎵';
    const lower = instrument.toLowerCase();
    if (lower.includes('piano')) return '🎹';
    if (lower.includes('guitar')) return '🎸';
    if (lower.includes('drum')) return '🥁';
    if (lower.includes('violin')) return '🎻';
    if (lower.includes('bass')) return '🎸';
    return '🎵';
  };

  // Get timeframe label
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'today': return '📅 Today';
      case 'week': return '📅 This Week';
      case 'month': return '📅 This Month';
      default: return '📅 All Time';
    }
  };

  // Loading state
  if (isLoading && !totalTime) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.title}>Statistics</Text>
            <Text style={styles.subtitle}>Your practice insights</Text>
          </LinearGradient>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Loading statistics...</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
          style={styles.header}
        >
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Your practice insights</Text>
        </LinearGradient>

        {/* Timeframe Filter - Overlapping Header */}
        <View style={styles.filterContainer}>
          <View style={styles.filterCard}>
            <Text style={styles.filterLabel}>Time Period</Text>
            <View style={styles.filterButtons}>
              {['today', 'week', 'month', 'all'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.filterButton,
                    timeframe === period && styles.filterButtonActive
                  ]}
                  onPress={() => handleTimeframeChange(period)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.filterButtonText,
                    timeframe === period && styles.filterButtonTextActive
                  ]}>
                    {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Total Practice Time - Hero Card */}
        {totalTime && (
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#ffffff', '#fafafa']}
              style={styles.heroGradient}
            >
              <View style={styles.heroHeader}>
                <Text style={styles.heroTitle}>Total Practice Time</Text>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>{getTimeframeLabel()}</Text>
                </View>
              </View>

              <View style={styles.heroTimeContainer}>
                <Text style={styles.heroTime}>
                  {totalTime.hours}h {totalTime.minutes}m
                </Text>
                <View style={styles.heroAccent} />
              </View>

              <Text style={styles.heroSubtitle}>
                {totalTime.totalMinutes} total minutes
              </Text>

              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>{totalTime.sessionCount}</Text>
                  <Text style={styles.heroStatLabel}>Sessions</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>{totalTime.averageMinutes}m</Text>
                  <Text style={styles.heroStatLabel}>Avg/Session</Text>
                </View>
              </View>

              <View style={styles.heroNote}>
                <Text style={styles.heroNoteText}>⏱️ Based on actual practice time</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Streak & Consistency Row */}
        <View style={styles.twoColumnRow}>
          {/* Streak Card */}
          {streak && (
            <View style={styles.smallCard}>
              <LinearGradient
                colors={['#fff7ed', '#ffedd5']}
                style={styles.smallCardGradient}
              >
                <View style={styles.smallCardIcon}>
                  <Text style={styles.smallCardEmoji}>🔥</Text>
                </View>
                <Text style={styles.smallCardLabel}>Current Streak</Text>
                <Text style={styles.smallCardValue}>
                  {streak.currentStreak}
                </Text>
                <Text style={styles.smallCardUnit}>
                  {streak.currentStreak === 1 ? 'day' : 'days'}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* Consistency Card */}
          {consistency && (
            <View style={styles.smallCard}>
              <LinearGradient
                colors={['#f0f9ff', '#e0f2fe']}
                style={styles.smallCardGradient}
              >
                <View style={styles.smallCardIcon}>
                  <Text style={styles.smallCardEmoji}>📊</Text>
                </View>
                <Text style={styles.smallCardLabel}>Consistency</Text>
                <Text style={styles.smallCardValue}>{consistency.percentage}%</Text>
                <Text style={styles.smallCardUnit}>
                  {consistency.practiceDays}/{consistency.totalDays} days
                </Text>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Most Practiced Items */}
        {topItems.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Most Practiced Items</Text>
            <Text style={styles.cardSubtitle}>Your top 5 focus areas</Text>

            {topItems.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankNumber}>#{index + 1}</Text>
                  </View>
                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemName}>{item.item_name}</Text>
                    <Text style={styles.listItemType}>{item.item_type}</Text>
                  </View>
                </View>
                <View style={styles.listItemRight}>
                  <Text style={styles.listItemCount}>{item.practice_count}×</Text>
                  {item.average_tempo && (
                    <Text style={styles.listItemTempo}>{Math.round(item.average_tempo)} BPM</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Instrument Breakdown */}
        {instruments.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Practice by Instrument</Text>
            <Text style={styles.cardSubtitle}>Time distribution across instruments</Text>

            {instruments.map((instrument, index) => (
              <View key={index} style={styles.instrumentItem}>
                <View style={styles.instrumentHeader}>
                  <View style={styles.instrumentLeft}>
                    <View style={styles.instrumentIconContainer}>
                      <Text style={styles.instrumentEmoji}>
                        {getInstrumentEmoji(instrument.instrument)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.instrumentName}>
                        {instrument.instrument || 'Not specified'}
                      </Text>
                      <Text style={styles.instrumentDetails}>
                        {instrument.total_minutes} min • {instrument.session_count} sessions
                      </Text>
                    </View>
                  </View>
                  <View style={styles.instrumentPercentageContainer}>
                    <Text style={styles.instrumentPercentage}>
                      {instrument.percentage}%
                    </Text>
                  </View>
                </View>

                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${instrument.percentage}%` }]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {totalTime && totalTime.sessionCount === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>📊</Text>
            </View>
            <Text style={styles.emptyTitle}>No Data Yet</Text>
            <Text style={styles.emptyText}>
              Start logging practice sessions to see your statistics!
            </Text>
          </View>
        )}

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
  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginHorizontal: -20,
    marginTop: -20,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  // Filter Container - Overlapping
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 8,
    zIndex: 10,
  },
  // Filter Card
  filterCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  // Hero Card
  heroCard: {
    marginBottom: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  heroGradient: {
    padding: 28,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.3,
  },
  heroBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  heroBadgeText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '700',
  },
  heroTimeContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  heroTime: {
    fontSize: 56,
    fontWeight: '900',
    color: '#6366f1',
    lineHeight: 64,
    letterSpacing: -2,
  },
  heroAccent: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#e0e7ff',
    borderRadius: 3,
    opacity: 0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 20,
  },
  heroStats: {
    flexDirection: 'row',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  heroNote: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  heroNoteText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  // Two Column Row
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  smallCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  smallCardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 160,
  },
  smallCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  smallCardEmoji: {
    fontSize: 28,
  },
  smallCardLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  smallCardValue: {
    fontSize: 40,
    fontWeight: '900',
    color: '#1e293b',
    lineHeight: 44,
    letterSpacing: -1,
  },
  smallCardUnit: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  // Regular Card
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
    fontWeight: '500',
  },
  // List Items
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6366f1',
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  listItemType: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  listItemCount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6366f1',
    marginBottom: 2,
  },
  listItemTempo: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  // Instrument Items
  instrumentItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  instrumentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  instrumentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  instrumentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instrumentEmoji: {
    fontSize: 24,
  },
  instrumentName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'capitalize',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  instrumentDetails: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  instrumentPercentageContainer: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  instrumentPercentage: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6366f1',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  // Empty State
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
});