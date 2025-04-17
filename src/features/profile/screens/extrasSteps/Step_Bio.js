import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Step_Bio({ onNext }) {
  const [bio, setBio] = useState('');
  const maxLength = 160;

  return (
    <View>
      <Text style={styles.label}>Write a one-line bio</Text>
      <TextInput
        style={styles.input}
        placeholder="Tell us something interesting about you"
        multiline
        maxLength={maxLength}
        onChangeText={setBio}
        value={bio}
      />
      <Text style={styles.charCount}>{bio.length} / {maxLength}</Text>

      <TouchableOpacity
        style={[styles.button, bio.length === 0 && styles.disabled]}
        onPress={() => bio.length > 0 && onNext(bio)}
        disabled={bio.length === 0}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    height: 100,
    marginBottom: 8,
  },
  charCount: {
    textAlign: 'right',
    color: '#888',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ec4899',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
});
