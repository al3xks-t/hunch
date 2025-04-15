import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💘 Welcome to Hunch</Text>
      <Text style={styles.subtitle}>Where smart connections meet good vibes.</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe4e6', // pink-50
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937', // gray-800
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: '#1f2937',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#ec4899', // pink-500
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginRight: 8,
  },
  primaryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryBtn: {
    borderColor: '#ec4899',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  secondaryText: {
    color: '#ec4899',
    fontWeight: 'bold',
  },
});
