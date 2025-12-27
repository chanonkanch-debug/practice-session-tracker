import { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { TimerProvider } from './src/context/TimerContext';

// Import screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import SessionsScreen from './src/screens/sessions/SessionsScreen';
import SessionDetailScreen from './src/screens/sessions/SessionDetailScreen';
import AddEditSessionScreen from './src/screens/sessions/AddSessionScreen';
import StatsScreen from './src/screens/stats/StatsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';

// Add timer screen imports
import StartSessionScreen from './src/screens/timer/StartSessionScreen';
import ActiveTimerScreen from './src/screens/timer/ActiveTimerScreen';
import AddLapScreen from './src/screens/timer/AddLapScreen';
import CompleteSessionScreen from './src/screens/timer/CompleteSessionScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Auth Stack (Login/Register)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Create Timer Stack Navigator
function TimerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StartSession"
        component={StartSessionScreen}
        options={{
          title: 'Start Practice',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen
        name="ActiveTimer"
        component={ActiveTimerScreen}
        options={{
          title: 'Practice Session',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => null, // Prevent going back
        }}
      />
      <Stack.Screen
        name="AddLap"
        component={AddLapScreen}
        options={{
          title: 'Add Lap',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen
        name="CompleteSession"
        component={CompleteSessionScreen}
        options={{
          title: 'Session Complete',
          headerStyle: { backgroundColor: '#4caf50' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => null, // Prevent going back
        }}
      />
    </Stack.Navigator>
  );
}

// Sessions Stack (List -> Detail -> Edit/Add)
function SessionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SessionsList"
        component={SessionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{
          title: 'Session Details',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen
        name="AddSession"
        component={AddEditSessionScreen}
        options={{
          title: 'Add Session',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen
        name="EditSession"
        component={AddEditSessionScreen}
        options={{
          title: 'Edit Session',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />

      {/* ADD TIMER SCREENS HERE */}
      <Stack.Screen
        name="StartPracticeTimer"
        component={StartSessionScreen}
        options={{
          title: 'Start Practice',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen
        name="ActiveTimer"
        component={ActiveTimerScreen}
        options={{
          title: 'Practice Session',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="AddLap"
        component={AddLapScreen}
        options={{
          title: 'Add Lap',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen
        name="CompleteSession"
        component={CompleteSessionScreen}
        options={{
          title: 'Session Complete',
          headerStyle: { backgroundColor: '#4caf50' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => null,
        }}
      />

    </Stack.Navigator>
  );
}

// Main Tabs (Authenticated)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>🏠</Text>
          ),
        }}
      />

      <Tab.Screen
        name="SessionsTab"
        component={SessionsStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Sessions',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>📝</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>📊</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// App Navigator (decides between Auth or Main based on auth state)
function AppNavigator() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  // Show loading screen while checking for stored token
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // Show Auth screens if not authenticated, Main tabs if authenticated
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Root App Component (wrapped with AuthProvider)
export default function App() {
  return (
    <AuthProvider>
      <TimerProvider>
        <AppNavigator />
      </TimerProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});