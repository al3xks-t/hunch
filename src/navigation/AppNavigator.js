// navigation/AppNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/LandingScreen';
// Import LoginScreen and SignupScreen as you build them

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        {/* Replace with real screens later */}
        <Stack.Screen name="Login" component={Placeholder} />
        <Stack.Screen name="Signup" component={Placeholder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Placeholder() {
  return <Text style={{ marginTop: 50, textAlign: 'center' }}>Coming Soon!</Text>;
}
