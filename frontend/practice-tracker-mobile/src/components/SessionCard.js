import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function SessionCard({ date, duration, instrument, notes, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.duration}>{duration} min</Text>
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
  duration: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: '600',
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