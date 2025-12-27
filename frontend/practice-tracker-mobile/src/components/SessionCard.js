import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function SessionCard({ date, duration, actualDuration, instrument, notes, onPress }) {
  // Check if this was a timer session that ended early
  const wasTimerSession = actualDuration !== null && actualDuration !== undefined;
  const endedEarly = wasTimerSession && actualDuration < duration;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{date}</Text>
        <View style={styles.durationContainer}>
          {endedEarly ? (
            // Show actual duration with goal crossed out
            <View>
              <Text style={styles.durationActual}>{actualDuration} min</Text>
              <Text style={styles.durationGoal}>Goal: {duration}m</Text>
            </View>
          ) : (
            // Show regular duration
            <Text style={styles.duration}>
              {wasTimerSession ? actualDuration : duration} min
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.cardBody}>
        {instrument && (
          <Text style={styles.instrument}>🎹 {instrument}</Text>
        )}
        {notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  durationContainer: {
    alignItems: 'flex-end',
  },
  duration: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: '600',
  },
  durationActual: {
    fontSize: 16,
    color: '#ff9800',  // Orange for early-ended sessions
    fontWeight: '600',
  },
  durationGoal: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  cardBody: {
    gap: 5,
  },
  instrument: {
    fontSize: 16,
    color: '#666',
  },
  notes: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});