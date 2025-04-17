import { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';

export default function Step_SubstanceUsage({ onNext }) {
  const [drinks, setDrinks] = useState(false);
  const [smokes, setSmokes] = useState(false);
  const [cannabis, setCannabis] = useState(false);

  const handleNext = () => {
    onNext({ drinks, smokes, cannabis });
  };

  return (
    <View>
      <Text style={styles.label}>Substance Usage</Text>

      <View style={styles.row}>
        <Text style={styles.text}>Do you drink?</Text>
        <Switch value={drinks} onValueChange={setDrinks} />
      </View>

      <View style={styles.row}>
        <Text style={styles.text}>Do you smoke?</Text>
        <Switch value={smokes} onValueChange={setSmokes} />
      </View>

      <View style={styles.row}>
        <Text style={styles.text}>Use cannabis?</Text>
        <Switch value={cannabis} onValueChange={setCannabis} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ec4899',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
