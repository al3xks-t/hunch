// navigation/AppNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import { useAuth } from '../context/AuthContext';

import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileSetupScreen from '../features/profile/screens/ProfileSetupScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function RouterScreen() {
  const { profile, loading, refreshProfile, user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!loading && user?.uid) {
      InteractionManager.runAfterInteractions(() => {
        const decide = async () => {
          console.log('🔁 RouterScreen - checking profile...');
          if (!profile) {
            const updated = await refreshProfile();
            if (updated) {
              console.log('✅ RouterScreen → updated profile found, routing to Home');
              navigation.replace('Home');
              return;
            }
          }

          if (profile) {
            console.log('✅ RouterScreen → going to Home');
            navigation.replace('Home');
          } else {
            console.log('⚠️ RouterScreen → STILL no profile, routing to ProfileSetup');
            navigation.replace('ProfileSetup');
          }
        };

        setTimeout(decide, 200); // add a slight delay to let everything mount
      });
    }
  }, [profile, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading your experience...</Text>
    </View>
  );
}




function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Router">
      <Stack.Screen name="Router" component={RouterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
}



export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
}
