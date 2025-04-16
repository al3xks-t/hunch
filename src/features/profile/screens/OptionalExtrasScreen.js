// src/features/profile/screens/OptionalExtrasScreen.js
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { InteractionManager } from 'react-native';

export default function OptionalExtrasScreen() {
  const navigation = useNavigation();

  const [extras, setExtras] = useState({
    height: '',
    religion: '',
    politics: '',
    drinks: false,
    smokes: false,
    musicNow: '',
    interests: [],
    bio: '',
  });

  const allInterests = [
    'Anime', 'Cooking', 'Photography', 'Fitness', 'K-pop',
    'Reading', 'Gaming', 'Travel', 'Memes', 'Music', 'Dancing', 'Late Night Talks'
  ];

  const toggleInterest = (item) => {
    setExtras(prev => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter(i => i !== item)
        : [...prev.interests, item]
    }));
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { extras });

      InteractionManager.runAfterInteractions(() => {
        navigation.replace('Home');
      });
    } catch (e) {
      console.error('❌ Error saving extras:', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Optional Details</Text>

      {/* Height Picker */}
      <Text style={styles.label}>Height</Text>
      <Picker
        selectedValue={extras.height}
        onValueChange={(value) => setExtras(prev => ({ ...prev, height: value }))}
        style={styles.picker}
      >
        <Picker.Item label="Select height" value="" />
        <Picker.Item label="4'10" value="4'10" />
        <Picker.Item label="5'0" value="5'0" />
        <Picker.Item label="5'5" value="5'5" />
        <Picker.Item label="5'10" value="5'10" />
        <Picker.Item label="6'0" value="6'0" />
        <Picker.Item label="6'5" value="6'5" />
      </Picker>

      {/* Religion */}
      <Text style={styles.label}>Religion</Text>
      <Picker
        selectedValue={extras.religion}
        onValueChange={(value) => setExtras(prev => ({ ...prev, religion: value }))}
        style={styles.picker}
      >
        <Picker.Item label="Select religion" value="" />
        <Picker.Item label="Christianity" value="Christianity" />
        <Picker.Item label="Islam" value="Islam" />
        <Picker.Item label="Judaism" value="Judaism" />
        <Picker.Item label="Hinduism" value="Hinduism" />
        <Picker.Item label="Spiritual" value="Spiritual" />
        <Picker.Item label="None" value="None" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      {/* Politics */}
      <Text style={styles.label}>Politics</Text>
      <Picker
        selectedValue={extras.politics}
        onValueChange={(value) => setExtras(prev => ({ ...prev, politics: value }))}
        style={styles.picker}
      >
        <Picker.Item label="Select politics" value="" />
        <Picker.Item label="Liberal" value="Liberal" />
        <Picker.Item label="Moderate" value="Moderate" />
        <Picker.Item label="Conservative" value="Conservative" />
        <Picker.Item label="Apolitical" value="Apolitical" />
      </Picker>

      {/* Toggle Switches */}
      <View style={styles.toggleRow}>
        <Text style={styles.label}>Do you drink?</Text>
        <Switch
          value={extras.drinks}
          onValueChange={(value) => setExtras(prev => ({ ...prev, drinks: value }))}
        />
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.label}>Do you smoke?</Text>
        <Switch
          value={extras.smokes}
          onValueChange={(value) => setExtras(prev => ({ ...prev, smokes: value }))}
        />
      </View>

      {/* Music & Bio */}
      <Text style={styles.label}>What's playing right now?</Text>
      <TextInput
        style={styles.input}
        placeholder="Song or Artist"
        onChangeText={(text) => setExtras(prev => ({ ...prev, musicNow: text }))}
        value={extras.musicNow}
      />

      <Text style={styles.label}>Your Interests</Text>
      <View style={styles.tagsContainer}>
        {allInterests.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.tag,
              extras.interests.includes(item) && styles.tagSelected
            ]}
            onPress={() => toggleInterest(item)}
          >
            <Text style={{ color: extras.interests.includes(item) ? '#fff' : '#000' }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>One-line Bio</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Tell us something quirky"
        multiline
        onChangeText={(text) => setExtras(prev => ({ ...prev, bio: text }))}
        value={extras.bio}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save & Enter Hunch</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#f9f9f9'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
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
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
