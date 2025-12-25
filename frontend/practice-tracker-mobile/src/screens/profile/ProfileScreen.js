import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext'; // for logout

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with user info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.username || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity 
            style={styles.option}
            onPress={() => alert('Edit Profile coming soon!')}
          >
            <Text style={styles.optionText}>Edit Profile</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.option}
            onPress={() => alert('Notifications coming soon!')}
          >
            <Text style={styles.optionText}>Notifications</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.option}
            onPress={() => alert('Practice Goals coming soon!')}
          >
            <Text style={styles.optionText}>Practice Goals</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity 
            style={styles.option}
            onPress={() => alert('Help coming soon!')}
          >
            <Text style={styles.optionText}>Help & Support</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.option}
            onPress={() => alert('Terms coming soon!')}
          >
            <Text style={styles.optionText}>Terms of Service</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
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
    padding: 30,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    padding: 15,
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionArrow: {
    fontSize: 24,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 30,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d32f2f',
  },
  logoutText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 20,
  },
});