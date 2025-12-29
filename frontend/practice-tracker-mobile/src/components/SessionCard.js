import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function SessionCard({ date, duration, actualDuration, instrument, notes, onPress }) {
  // Check if this was a timer session
  const wasTimerSession = actualDuration !== null && actualDuration !== undefined;
  const endedEarly = wasTimerSession && actualDuration < duration;
  const displayDuration = wasTimerSession ? actualDuration : duration;

  // Get instrument emoji
  const getInstrumentEmoji = (inst) => {
    if (!inst) return '🎵';
    const lower = inst.toLowerCase();
    if (lower.includes('piano')) return '🎹';
    if (lower.includes('guitar')) return '🎸';
    if (lower.includes('drum')) return '🥁';
    if (lower.includes('violin')) return '🎻';
    if (lower.includes('bass')) return '🎸';
    return '🎵';
  };

  // Format date
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return {
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  const dateObj = formatDate(date);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Left Side - Date Badge */}
      <View style={styles.dateSection}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{dateObj.day}</Text>
          <Text style={styles.dateMonth}>{dateObj.month}</Text>
        </View>
        <Text style={styles.dateWeekday}>{dateObj.weekday}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Right Side - Session Info */}
      <View style={styles.infoSection}>
        {/* Top Row - Instrument & Duration */}
        <View style={styles.topRow}>
          <View style={styles.instrumentContainer}>
            <Text style={styles.instrumentEmoji}>
              {getInstrumentEmoji(instrument)}
            </Text>
            <Text style={styles.instrumentText}>
              {instrument || 'Practice'}
            </Text>
          </View>

          {/* Duration Badge */}
          <View style={[
            styles.durationBadge,
            endedEarly && styles.durationBadgeEarly
          ]}>
            <Text style={[
              styles.durationText,
              endedEarly && styles.durationTextEarly
            ]}>
              {displayDuration}m
            </Text>
            {wasTimerSession && (
              <Text style={styles.timerIcon}>⏱️</Text>
            )}
          </View>
        </View>

        {/* Early Ended Indicator */}
        {endedEarly && (
          <View style={styles.earlyBadge}>
            <Text style={styles.earlyText}>
              Goal: {duration}m • Ended early
            </Text>
          </View>
        )}

        {/* Notes */}
        {notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesIcon}>💭</Text>
            <Text style={styles.notesText} numberOfLines={2}>
              {notes}
            </Text>
          </View>
        )}
      </View>

      {/* Chevron */}
      <View style={styles.chevronContainer}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  // Date Section (Left)
  dateSection: {
    width: 80,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  dateBadge: {
    alignItems: 'center',
    marginBottom: 4,
  },
  dateDay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    lineHeight: 36,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateWeekday: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Divider
  divider: {
    width: 1,
    backgroundColor: '#e8e8e8',
  },
  // Info Section (Right)
  infoSection: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  instrumentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  instrumentEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  instrumentText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  durationBadgeEarly: {
    backgroundColor: '#fff3e0',
  },
  durationText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  durationTextEarly: {
    color: '#ff9800',
  },
  timerIcon: {
    fontSize: 12,
  },
  // Early Badge
  earlyBadge: {
    marginBottom: 8,
  },
  earlyText: {
    fontSize: 11,
    color: '#ff9800',
    fontWeight: '500',
  },
  // Notes
  notesContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  notesIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  // Chevron
  chevronContainer: {
    justifyContent: 'center',
    paddingRight: 12,
  },
  chevron: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
});