import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../features/home/screens/HomeScreen';
import ViewProfileScreen from '../features/profile/screens/ViewProfileScreen';

// Placeholder screens
const MatchesScreen = () => <></>;
const MessagesScreen = () => <></>;

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ec4899',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let icon;

          switch (route.name) {
            case 'Home':
              icon = 'home';
              break;
            case 'Matches':
              icon = 'heart';
              break;
            case 'Messages':
              icon = 'chatbubbles';
              break;
            case 'Profile':
              icon = 'person';
              break;
          }

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ViewProfileScreen} />
    </Tab.Navigator>
  );
}
