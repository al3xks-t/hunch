import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Step_Sexuality({ onNext }) {
  const [orientation, setOrientation] = useState('');
  const [preference, setPreference] = useState('');

  const isComplete = orientation && preference;

  return (
    <View>
      <Text style={styles.label}>What’s your sexual orientation?</Text>
      <Picker
        selectedValue={orientation}
        onValueChange={(value) => setOrientation(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select one" value="" />
        <Picker.Item label="Straight" value="Straight" />
        <Picker.Item label="Gay" value="Gay" />
        <Picker.Item label="Bisexual" value="Bisexual" />
        <Picker.Item label="Pansexual" value="Pansexual" />
        <Picker.Item label="Asexual" value="Asexual" />
        <Picker.Item label="Queer" value="Queer" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>Who are you interested in?</Text>
      <Picker
        selectedValue={preference}
        onValueChange={(value) => setPreference(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select one" value="" />
        <Picker.Item label="Men" value="Men" />
        <Picker.Item label="Women" value="Women" />
        <Picker.Item label="Everyone" value="Everyone" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <TouchableOpacity
        style={[styles.button, !isComplete && styles.disabled]}
        onPress={() => isComplete && onNext({ orientation, preference })}
        disabled={!isComplete}
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
