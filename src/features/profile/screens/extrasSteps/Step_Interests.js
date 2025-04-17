import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Step_Interests({ onNext }) {
  const [selected, setSelected] = useState([]);

  const allInterests = [
    'Anime', 'Cooking', 'Photography', 'Fitness', 'K-pop',
    'Reading', 'Gaming', 'Travel', 'Memes', 'Music',
    'Dancing', 'Late Night Talks', 'Art', 'Volleyball', 'Cats', 'Dogs'
  ];

  const toggle = (item) => {
    setSelected(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  return (
    <View>
      <Text style={styles.label}>Select your interests</Text>
      <View style={styles.tagsContainer}>
        {allInterests.map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.tag, selected.includes(item) && styles.tagSelected]}
            onPress={() => toggle(item)}
          >
            <Text style={{ color: selected.includes(item) ? '#fff' : '#000' }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, selected.length === 0 && styles.disabled]}
        onPress={() => selected.length > 0 && onNext(selected)}
        disabled={selected.length === 0}
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
    margin: 4,
  },
  tagSelected: {
    backgroundColor: '#ec4899',
  },
  button: {
    backgroundColor: '#ec4899',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
});
