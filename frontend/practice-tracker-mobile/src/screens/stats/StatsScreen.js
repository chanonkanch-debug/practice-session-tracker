import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your practice insights</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Stat Cards */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Practice Time</Text>
          <Text style={styles.cardValue}>450 minutes</Text>
          <Text style={styles.cardSubtitle}>7 hours 30 minutes</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Streak</Text>
          <Text style={styles.cardValue}>7 days 🔥</Text>
          <Text style={styles.cardSubtitle}>Keep it up!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sessions This Week</Text>
          <Text style={styles.cardValue}>12 sessions</Text>
          <Text style={styles.cardSubtitle}>Average: 37.5 min/session</Text>
        </View>
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
  scrollView: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    marginBottom: 15,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#999',
  },
});