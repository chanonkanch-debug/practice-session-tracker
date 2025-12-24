import { Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import screens
import HomeScreen from './src/screens/home/HomeScreen';
import SessionsScreen from './src/screens/sessions/SessionScreens';
import StatsScreen from './src/screens/stats/StatsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
        }}>

        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>,
          }}
        />

        <Tab.Screen
          name="Sessions"
          component={SessionsScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => <Text style= {{ fontSize: 24 }}>📝</Text>
          }}
        />

        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => <Text style= {{ fontSize: 24 }}>📊</Text>
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => <Text style= {{ fontSize: 24 }}>👤</Text>
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}