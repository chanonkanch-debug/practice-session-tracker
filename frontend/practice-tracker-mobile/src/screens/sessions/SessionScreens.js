import { StyleSheet, Text, View, ScrollView } from 'react-native';
import SessionCard from '../../components/SessionCard';

export default function SessionsScreen() {
  const sessions = [
    {
      id: 1,
      date: '2024-12-18',
      duration: 45,
      instrument: 'Piano',
      notes: 'Worked on C major scale'
    },
    {
      id: 2,
      date: '2024-12-17',
      duration: 30,
      instrument: 'Guitar',
      notes: 'Practiced chord progressions'
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Practice Sessions</Text>
        <Text style={styles.subtitle}>{sessions.length} sessions</Text>
      </View>

      {/* Sessions List */}
      <ScrollView style={styles.sessionsList}>
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            date={session.date}
            duration={session.duration}
            instrument={session.instrument}
            notes={session.notes}
            onPress={() => alert(`Tapped session ${session.id}`)}
          />
        ))}
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
  sessionsList: {
    flex: 1,
    padding: 15,
  },
});