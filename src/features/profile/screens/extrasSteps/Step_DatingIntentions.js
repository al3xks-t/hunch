// src/features/profile/screens/extrasSteps/Step_DatingIntentions.js
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Step_DatingIntentions({ onNext }) {
  const [intentions, setIntentions] = useState('');

  return (
    <View>
      <Text style={styles.label}>What are your dating intentions?</Text>
      <Picker
        selectedValue={intentions}
        onValueChange={(val) => setIntentions(val)}
        style={styles.picker}
      >
        <Picker.Item label="Select one" value="" />
        <Picker.Item label="Looking for something serious" value="Serious" />
        <Picker.Item label="Looking for something casual" value="Casual" />
        <Picker.Item label="Open to anything" value="Open" />
        <Picker.Item label="Not sure yet" value="Not Sure" />
      </Picker>

      <TouchableOpacity
        style={[styles.button, !intentions && styles.disabled]}
        onPress={() => intentions && onNext(intentions)}
        disabled={!intentions}
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
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
