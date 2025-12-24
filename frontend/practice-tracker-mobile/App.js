import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import SessionCard from './src/components/SessionCard';  // Import component

export default function App() {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      date: '2024-12-17',
      duration: 45,
      instrument: 'Piano',
      notes: 'Worked on C major scale and Moonlight Sonata'
    },
    {
      id: 2,
      date: '2024-12-16',
      duration: 30,
      instrument: 'Guitar',
      notes: 'Practiced chord progressions'
    },
    {
      id: 3,
      date: '2024-12-15',
      duration: 60,
      instrument: 'Piano',
      notes: 'Scales, arpeggios, and sight reading practice'
    },
    {
      id: 4,
      date: '2024-12-14',
      duration: 25,
      instrument: 'Guitar',
      notes: 'Practice It Runs Through Me - Tom Misch'
    },
  ]);

  const [selectedSession, setSelectedSession] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSessionPress = (session) => {
    setSelectedSession(session);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Practice Sessions</Text>
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
            onPress={() => handleSessionPress(session)}
          />
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Session</Text>
      </TouchableOpacity>

      {/* Modal for Session Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSession && (
              <>
                <Text style={styles.modalTitle}>Session Details</Text>
                <Text style={styles.modalText}>Date: {selectedSession.date}</Text>
                <Text style={styles.modalText}>Duration: {selectedSession.duration} minutes</Text>
                <Text style={styles.modalText}>Instrument: {selectedSession.instrument}</Text>
                <Text style={styles.modalText}>Notes: {selectedSession.notes}</Text>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: '#6200ee',
    margin: 15,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 8,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});