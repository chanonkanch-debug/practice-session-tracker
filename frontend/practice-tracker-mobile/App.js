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

// Timer screens
import StartSessionScreen from './src/screens/timer/StartSessionScreen';
import ActiveTimerScreen from './src/screens/timer/ActiveTimerScreen';
import AddLapScreen from './src/screens/timer/AddLapScreen';
import CompleteSessionScreen from './src/screens/timer/CompleteSessionScreen';

// Profile screens
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import NotificationsScreen from './src/screens/profile/NotificationScreens';
import PracticeGoalsScreen from './src/screens/profile/PracticeGoalsScreen';

// Sheet Analysis screens
import AnalyzeSheetScreen from './src/screens/sheet/AnalyzeSheetScreen';
import AnalysisResultScreen from './src/screens/sheet/AnalyzeResultScreen';

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

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          title: 'Edit Profile',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="PracticeGoals" 
        component={PracticeGoalsScreen}
        options={{ 
          title: 'Practice Goals',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
}

// Sessions Stack
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

      {/* Timer screens */}
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

// Sheet Analysis Stack (NEW)
function SheetAnalysisStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AnalyzeSheet" 
        component={AnalyzeSheetScreen}
        options={{ 
          title: 'Analyze Sheet Music',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="AnalysisResult" 
        component={AnalysisResultScreen}
        options={{ 
          title: 'Analysis Results',
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => null
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

      {/* NEW: Sheet Analysis Tab */}
      <Tab.Screen
        name="SheetTab"
        component={SheetAnalysisStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Analyze',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>📸</Text>
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
        component={ProfileStack}
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

// App Navigator
function AppNavigator() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Root App Component
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