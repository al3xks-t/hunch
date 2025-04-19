// App.js
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
      <Toast />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
