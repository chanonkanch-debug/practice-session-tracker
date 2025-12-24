import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}> Welcome Back! 👋 </Text>
                    <Text style={styles.date}> {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })} </Text>
                </View>
                    
                {/* Quick Stats */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}> Today's Practice </Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>45</Text>
                            <Text style={styles.statLabel}>Minutes</Text>
                        </View>
                        
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>2</Text>
                            <Text style={styles.statLabel}>Sessions</Text>
                        </View>
                        
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>7</Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </View>
                    </View>

                </View>

                {/* Quick Actions */}
                <View style={styles.actionsSection}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('SessionsTab')}
                    >
                        <Text style={styles.actionIcon}>📝</Text>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Start Practice Session</Text>
                            <Text style={styles.actionSubtitle}>Log your practice now</Text>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('StatsTab')}
                    >
                        <Text style={styles.actionIcon}>📊</Text>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>View Statistics</Text>
                            <Text style={styles.actionSubtitle}>See your progress</Text>
                        </View>

                    </TouchableOpacity>
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
  scrollView: {
    flex: 1,
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
  statsSection: {
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
  actionsSection: {
    padding: 20,
    paddingTop: 10,
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