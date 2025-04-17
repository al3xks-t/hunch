import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Step_Height({ onNext }) {
  const [height, setHeight] = useState('');

  const heightOptions = [];
  for (let ft = 4; ft <= 6; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      const label = `${ft}'${inch}"`;
      const totalInches = ft * 12 + inch;
      if (totalInches >= 58 && totalInches <= 80) { // 4'10 to 6'8
        heightOptions.push(label);
      }
    }
  }

  return (
    <View>
      <Text style={styles.label}>What’s your height?</Text>
      <Picker
        selectedValue={height}
        onValueChange={(value) => setHeight(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select your height" value="" />
        {heightOptions.map(h => (
          <Picker.Item key={h} label={h} value={h} />
        ))}
      </Picker>

      <TouchableOpacity
        style={[styles.button, !height && styles.disabled]}
        onPress={() => height && onNext(height)}
        disabled={!height}
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
