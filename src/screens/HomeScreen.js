// src/screens/HomeScreen.js
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../config/firebase';

export default function HomeScreen() {
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 You’re logged in!</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ec4899',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
