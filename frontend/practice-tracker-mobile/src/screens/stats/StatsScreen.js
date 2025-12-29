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
  const [timeframe, setTimeframe] = useState('all'); // today, week, month, all

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

      // Fetch all stats in parallel
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

  // Loading state
  if (isLoading && !totalTime) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </View>
    );
  }

  // Inside StatsScreen component, add this helper
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your practice insights</Text>
      </View>

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
        {/* Timeframe Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Time Period:</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, timeframe === 'today' && styles.filterButtonActive]}
              onPress={() => handleTimeframeChange('today')}
            >
              <Text style={[styles.filterButtonText, timeframe === 'today' && styles.filterButtonTextActive]}>
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, timeframe === 'week' && styles.filterButtonActive]}
              onPress={() => handleTimeframeChange('week')}
            >
              <Text style={[styles.filterButtonText, timeframe === 'week' && styles.filterButtonTextActive]}>
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, timeframe === 'month' && styles.filterButtonActive]}
              onPress={() => handleTimeframeChange('month')}
            >
              <Text style={[styles.filterButtonText, timeframe === 'month' && styles.filterButtonTextActive]}>
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, timeframe === 'all' && styles.filterButtonActive]}
              onPress={() => handleTimeframeChange('all')}
            >
              <Text style={[styles.filterButtonText, timeframe === 'all' && styles.filterButtonTextActive]}>
                All Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Practice Time - ENHANCED */}
        {totalTime && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Total Practice Time</Text>
              <Text style={styles.cardBadge}>
                {timeframe === 'today' ? '📅 Today' :
                  timeframe === 'week' ? '📅 This Week' :
                    timeframe === 'month' ? '📅 This Month' : '📅 All Time'}
              </Text>
            </View>

            <Text style={styles.cardValue}>
              {totalTime.hours}h {totalTime.minutes}m
            </Text>

            <Text style={styles.cardSubtitle}>
              {totalTime.totalMinutes} total minutes
            </Text>

            <View style={styles.cardStats}>
              <View style={styles.cardStat}>
                <Text style={styles.cardStatValue}>{totalTime.sessionCount}</Text>
                <Text style={styles.cardStatLabel}>Sessions</Text>
              </View>
              <View style={styles.cardStatDivider} />
              <View style={styles.cardStat}>
                <Text style={styles.cardStatValue}>{totalTime.averageMinutes}</Text>
                <Text style={styles.cardStatLabel}>Avg/Session</Text>
              </View>
            </View>

            <Text style={styles.cardNote}>
              ⏱️ Based on actual practice time
            </Text>
          </View>
        )}

        {/* Current Streak */}
        {streak && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Streak</Text>
            <Text style={styles.cardValue}>
              {streak.currentStreak} {streak.currentStreak === 1 ? 'day' : 'days'} 🔥
            </Text>
            <Text style={styles.cardSubtitle}>
              {streak.currentStreak > 0 ? 'Keep it up!' : 'Start practicing to build a streak!'}
            </Text>
          </View>
        )}

        {/* Consistency Score */}
        {consistency && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Consistency Score (30 days)</Text>
            <Text style={styles.cardValue}>{consistency.percentage}%</Text>
            <Text style={styles.cardSubtitle}>
              {consistency.practiceDays} out of {consistency.totalDays} days
            </Text>
            <Text style={styles.cardInfo}>{consistency.grade}</Text>
          </View>
        )}

        {/* Most Practiced Items */}
        {topItems.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Most Practiced Items</Text>
            {topItems.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <Text style={styles.listItemRank}>#{index + 1}</Text>
                  <View>
                    <Text style={styles.listItemName}>{item.item_name}</Text>
                    <Text style={styles.listItemType}>{item.item_type}</Text>
                  </View>
                </View>
                <View style={styles.listItemRight}>
                  <Text style={styles.listItemCount}>{item.practice_count}x</Text>
                  {item.average_tempo && (
                    <Text style={styles.listItemTempo}>{Math.round(item.average_tempo)} BPM</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Instrument Breakdown - ENHANCED */}
        {instruments.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Practice by Instrument</Text>
            <Text style={styles.cardSubtitle}>
              Time distribution across instruments
            </Text>

            {instruments.map((instrument, index) => (
              <View key={index} style={styles.instrumentItem}>
                <View style={styles.instrumentHeader}>
                  <View style={styles.instrumentLeft}>
                    <Text style={styles.instrumentEmoji}>
                      {getInstrumentEmoji(instrument.instrument)}
                    </Text>
                    <Text style={styles.instrumentName}>
                      {instrument.instrument || 'Not specified'}
                    </Text>
                  </View>
                  <Text style={styles.instrumentPercentage}>
                    {instrument.percentage}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${instrument.percentage}%` }
                    ]}
                  />
                </View>
                <Text style={styles.instrumentDetails}>
                  {instrument.total_minutes} min • {instrument.session_count} sessions • Avg: {Math.round(instrument.avg_duration)}m
                </Text>
              </View>
            ))}
          </View>
        )}
        {/* Empty State */}
        {totalTime && totalTime.sessionCount === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No Data Yet</Text>
            <Text style={styles.emptyText}>
              Start logging practice sessions to see your statistics!
            </Text>
          </View>
        )}

      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  // Timeframe Filter
  filterContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#6200ee',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  // Stat Cards
  card: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  cardInfo: {
    fontSize: 14,
    color: '#999',
  },
  // List Items (Top Items)
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
    width: 35,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listItemType: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  listItemCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  listItemTempo: {
    fontSize: 12,
    color: '#999',
  },
  // Instrument Items
  instrumentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  instrumentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  instrumentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  instrumentPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200ee',
    borderRadius: 4,
  },
  instrumentDetails: {
    fontSize: 12,
    color: '#999',
  },
  // Empty State
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6200ee',
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardStats: {
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardStat: {
    flex: 1,
    alignItems: 'center',
  },
  cardStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  cardStatLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
  },
  cardStatDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  cardNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    fontStyle: 'italic',
  },
  instrumentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  instrumentEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
});