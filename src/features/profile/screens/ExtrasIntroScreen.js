// src/features/profile/screens/ExtrasIntroScreen.js
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { InteractionManager } from 'react-native';

export default function ExtrasIntroScreen() {
  const navigation = useNavigation();

  const goToHome = () => {
    InteractionManager.runAfterInteractions(() => {
      navigation.replace('Home');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎉 Your Profile Is Complete!</Text>
      <Text style={styles.sub}>Want to share a little more about yourself?</Text>

      <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('OptionalExtras')}>
        <Text style={styles.primaryText}>Add More Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondary} onPress={goToHome}>
        <Text style={styles.secondaryText}>Skip For Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  sub: { fontSize: 16, textAlign: 'center', marginBottom: 32, color: '#555' },
  primary: {
    backgroundColor: '#ec4899',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryText: { color: 'white', fontWeight: 'bold' },
  secondary: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ec4899',
  },
  secondaryText: { color: '#ec4899', fontWeight: 'bold' },
});
