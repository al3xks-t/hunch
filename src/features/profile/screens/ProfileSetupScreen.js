import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import PromptPickerScreen from './PromptPickerScreen';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { auth, db } from '../../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileSetupScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [profileData, setProfileData] = useState({});
  const { refreshProfile } = useAuth();

  const handleNext = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setStep(prev => prev + 1);
  };

  const handlePromptSubmit = async (promptAnswers) => {
    const fullProfile = { ...profileData, prompts: promptAnswers };
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), fullProfile);
      
      await refreshProfile();
      navigation.replace('Home'); // 👈 simple and clean now
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };
  

  const steps = [
    <NameStep onNext={(name) => handleNext('name', name)} />,
    <BirthdayStep onNext={(dob) => handleNext('dob', dob)} />,
    <GenderStep onNext={(gender) => handleNext('gender', gender)} />,
    <PronounsStep onNext={(pronouns) => handleNext('pronouns', pronouns)} />,
    <LocationStep onNext={(location) => handleNext('location', location)} />,
    <PhotoStep onNext={(photoURL) => handleNext('photoURL', photoURL)} />,
    <PromptPickerScreen onSubmit={handlePromptSubmit} />
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Step {step + 1} of {steps.length}</Text>
      {steps[step]}
    </View>
  );
}

function NameStep({ onNext }) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  return (
    <View>
      <Text style={styles.label}>What's your name?</Text>
      <TextInput style={styles.input} placeholder="First Name" onChangeText={setFirst} value={first} />
      <TextInput style={styles.input} placeholder="Last Name" onChangeText={setLast} value={last} />
      <TouchableOpacity style={styles.button} onPress={() => onNext(`${first} ${last}`)}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function BirthdayStep({ onNext }) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  return (
    <View>
      <Text style={styles.label}>When's your birthday?</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(e, selectedDate) => {
            setShow(Platform.OS === 'ios');
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={() => onNext(date.toISOString())}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function GenderStep({ onNext }) {
  const [gender, setGender] = useState('');
  return (
    <View>
      <Text style={styles.label}>What’s your gender?</Text>
      <TextInput style={styles.input} placeholder="Enter gender" onChangeText={setGender} value={gender} />
      <TouchableOpacity style={styles.button} onPress={() => onNext(gender)}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function PronounsStep({ onNext }) {
  const [pronouns, setPronouns] = useState('');
  return (
    <View>
      <Text style={styles.label}>What are your pronouns?</Text>
      <TextInput style={styles.input} placeholder="e.g. they/them" onChangeText={setPronouns} value={pronouns} />
      <TouchableOpacity style={styles.button} onPress={() => onNext(pronouns)}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function LocationStep({ onNext }) {
  const [location, setLocation] = useState('');
  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return alert('Permission to access location was denied');
    }
    let loc = await Location.getCurrentPositionAsync({});
    const city = `Lat: ${loc.coords.latitude.toFixed(2)}, Long: ${loc.coords.longitude.toFixed(2)}`;
    setLocation(city);
  };

  return (
    <View>
      <Text style={styles.label}>Where are you located?</Text>
      <TouchableOpacity style={styles.input} onPress={fetchLocation}>
        <Text>{location || 'Tap to get your location'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => onNext(location)}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function PhotoStep({ onNext }) {
  const [photo, setPhoto] = useState(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaType.Images, allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Text style={styles.label}>Upload a profile photo</Text>
      <TouchableOpacity style={styles.input} onPress={pickImage}>
        <Text>{photo ? 'Change photo' : 'Tap to select a photo'}</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 10, marginVertical: 10 }} />}
      <TouchableOpacity style={styles.button} onPress={() => onNext(photo)}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
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
  progress: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: '#888',
  },
});