import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { auth, db } from '../../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../config/firebase';


export default function ProfileSetupScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [profileData, setProfileData] = useState({});
  const { refreshProfile } = useAuth();

  const handleNext = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setStep(prev => prev + 1);
  };

  const handleSubmitProfile = async (bio) => {
    const fullProfile = { ...profileData, bio }; // ✅ merge directly
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), fullProfile);
      console.log('✅ Profile written to Firestore:', fullProfile);
  
      await refreshProfile();
      navigation.replace('ExtrasIntro');
    } catch (e) {
      console.error('❌ Error saving profile:', e);
    }
  };
  

  const steps = [
    <NameStep onNext={(name) => handleNext('name', name)} />,
    <BirthdayStep onNext={(dob) => handleNext('dob', dob)} />,
    <GenderStep onNext={(gender) => handleNext('gender', gender)} />,
    <PronounsStep onNext={(pronouns) => handleNext('pronouns', pronouns)} />,
    <LocationStep onNext={(location) => handleNext('location', location)} />,
    <PhotoStep onNext={(photoURL) => handleNext('photoURL', photoURL)} />,
    <BioStep onSubmit={(bio) => handleSubmitProfile(bio)} />,
    
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
  const [month, setMonth] = useState('January');
  const [day, setDay] = useState('1');
  const [year, setYear] = useState('2000');

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 80 }, (_, i) => (2025 - i).toString());

  return (
    <View>
      <Text style={styles.label}>When's your birthday?</Text>
      <Text style={{ marginBottom: 8 }}>Month</Text>
      <Picker selectedValue={month} onValueChange={setMonth}>{months.map((m, i) => <Picker.Item label={m} value={m} key={i} />)}</Picker>
      <Text style={{ marginBottom: 8 }}>Day</Text>
      <Picker selectedValue={day} onValueChange={setDay}>{days.map((d, i) => <Picker.Item label={d} value={d} key={i} />)}</Picker>
      <Text style={{ marginBottom: 8 }}>Year</Text>
      <Picker selectedValue={year} onValueChange={setYear}>{years.map((y, i) => <Picker.Item label={y} value={y} key={i} />)}</Picker>
      <TouchableOpacity
  style={styles.button}
  onPress={() => {
    const monthIndex = months.indexOf(month);
    const safeYear = parseInt(year);
    const safeDay = parseInt(day);

    if (
      isNaN(safeYear) ||
      monthIndex === -1 ||
      isNaN(safeDay) ||
      safeDay < 1 ||
      safeDay > 31
    ) {
      alert('Please select a valid date.');
      return;
    }

    const safeDate = new Date(safeYear, monthIndex, safeDay);

    // Final sanity check
    if (isNaN(safeDate.getTime())) {
      alert('Oops! Something went wrong with your date.');
      return;
    }

    onNext(safeDate.toISOString());
  }}
>
  <Text style={styles.buttonText}>Next</Text>
</TouchableOpacity>


    </View>
  );
}

function GenderStep({ onNext }) {
  const [gender, setGender] = useState('');
  const options = ['Male', 'Female', 'Prefer not to say'];
  return (
    <View>
      <Text style={styles.label}>What's your gender?</Text>
      <Picker selectedValue={gender} onValueChange={setGender}>
        {options.map((opt, i) => <Picker.Item label={opt} value={opt} key={i} />)}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={() => onNext(gender)}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function PronounsStep({ onNext }) {
  const [pronouns, setPronouns] = useState('');
  const options = ['They/Them', 'She/Her', 'He/Him', 'Other'];
  return (
    <View>
      <Text style={styles.label}>What are your pronouns?</Text>
      <Picker selectedValue={pronouns} onValueChange={setPronouns}>
        {options.map((opt, i) => <Picker.Item label={opt} value={opt} key={i} />)}
      </Picker>
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
    let geocode = await Location.reverseGeocodeAsync(loc.coords);
    const cityRegion = `${geocode[0].city}, ${geocode[0].region}`;
    setLocation(cityRegion);
  };

  return (
    <View>
      <Text style={styles.label}>Where are you located?</Text>
      <TouchableOpacity style={styles.input} onPress={fetchLocation}>
        <Text>{location || 'Tap to detect city'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => onNext(location)}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function PhotoStep({ onNext }) {
  const [photo, setPhoto] = useState(null);
  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets?.length > 0) {
      try {
        const asset = result.assets[0];
        const imageUri = asset.uri;
        const blob = await uriToBlob(imageUri); // ✅ safely convert to blob
    
        const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}.jpg`);
        const uploadResult = await uploadBytes(storageRef, blob); // upload
    
        const downloadURL = await getDownloadURL(uploadResult.ref);
        setPhoto(downloadURL);
        onNext(downloadURL);
      } catch (err) {
        console.error('❌ Upload error (real device):', err);
        alert('Upload failed on device — please try another photo.');
      }
    }
  };
  
  
  

  return (
    <View>
      <Text style={styles.label}>Upload a profile photo</Text>
      <TouchableOpacity
  style={styles.input}
  onPress={() => {
    console.log('🖼️ Photo picker button tapped');
    pickImage();
  }}
>
  <Text>{photo ? 'Change photo' : 'Tap to select a photo'}</Text>
</TouchableOpacity>

      {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 10, marginVertical: 10 }} />}
      <TouchableOpacity style={styles.button} onPress={() => onNext(photo)}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function BioStep({ onSubmit }) {
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
      <Text style={{ textAlign: 'right', color: '#888' }}>{bio.length} / {maxLength}</Text>

      <TouchableOpacity
        style={[styles.button, !bio && styles.disabled]}
        onPress={() => onSubmit(bio)} // ✅ Submit now
        disabled={!bio}
      >
        <Text style={styles.buttonText}>Finish Setup</Text>
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
  disabled: {
    backgroundColor: '#ccc',
  },  
});