import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Step_Religion({ onNext }) {
  const [religion, setReligion] = useState('');

  const options = [
    'Christianity', 'Islam', 'Judaism', 'Hinduism', 'Buddhism',
    'Spiritual', 'Agnostic', 'Atheist', 'None', 'Other'
  ];

  return (
    <View>
      <Text style={styles.label}>What’s your religion?</Text>
      <Picker
        selectedValue={religion}
        onValueChange={(value) => setReligion(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select one" value="" />
        {options.map(option => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>

      <TouchableOpacity
        style={[styles.button, !religion && styles.disabled]}
        onPress={() => religion && onNext(religion)}
        disabled={!religion}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
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
