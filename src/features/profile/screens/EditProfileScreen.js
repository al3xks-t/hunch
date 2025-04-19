import { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import PromptManager from '../components/PromptManager';
import { useAuth } from '../../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';



function SubstanceToggle({ initialValues, onChange }) {
    const [drinks, setDrinks] = useState(initialValues.drinks || false);
    const [smokes, setSmokes] = useState(initialValues.smokes || false);
    const [cannabis, setCannabis] = useState(initialValues.cannabis || false);

  
    useEffect(() => {
      onChange({ drinks, smokes, cannabis });
    }, [drinks, smokes, cannabis]);
  
    return (
      <View>
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
      </View>
    );
  }
  

export default function EditProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [updated, setUpdated] = useState({});
  const [dobLocked, setDobLocked] = useState(false);
  const navigation = useNavigation();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const ref = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setUpdated(data);
        setDobLocked(data.dobChangeCount >= 1);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoUpdate = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Image],
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        const imageUri = asset.uri;
        const blob = await (await fetch(imageUri)).blob();
  
        const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}.jpg`);
        await uploadBytes(storageRef, blob);
  
        const downloadURL = await getDownloadURL(storageRef);
        setUpdated((prev) => ({ ...prev, photoURL: downloadURL }));
      }
    } catch (e) {
      console.error('❌ Failed to update photo:', e);
      alert('Failed to upload photo');
    }
  };
  

  const handleSave = async () => {
    try {
      const ref = doc(db, 'users', auth.currentUser.uid);
      
      const changes = {
        ...updated,
        extras: {
          ...(profile?.extras || {}),
          ...(updated.extras || {}),
        },
      };
  
      if (profile?.dob !== updated?.dob) {
        if (dobLocked) {
          Alert.alert('DOB Locked', 'You can only change your date of birth once.');
          return;
        } else {
          changes.dobChangeCount = (profile?.dobChangeCount || 0) + 1;
        }
      }
  
      await updateDoc(ref, changes);
      await refreshProfile(); // ✅ refresh context value
      Alert.alert('Profile updated!');
      navigation.goBack();
    } catch (e) {
      console.error('❌ Failed to save profile:', e);
      Alert.alert('Failed to update profile.');
    }
  };
  

  if (!profile) return <Text style={{ marginTop: 100, textAlign: 'center' }}>Loading...</Text>;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <Text style={styles.label}>Profile Photo</Text>

        <TouchableOpacity onPress={handlePhotoUpdate} style={{ alignItems: 'center' }}>
          {updated.photoURL ? (
            <Image
              source={{ uri: updated.photoURL }}
              style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 8 }}
            />
          ) : (
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#fff' }}>Add</Text>
            </View>
          )}
          <Text style={{ color: '#ec4899', fontWeight: 'bold' }}>Change Photo</Text>
        </TouchableOpacity>


      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={updated.name} onChangeText={(text) => setUpdated(prev => ({ ...prev, name: text }))} />

      <Text style={styles.label}>Pronouns</Text>
      <Picker selectedValue={updated.pronouns} onValueChange={(value) => setUpdated(prev => ({ ...prev, pronouns: value }))}>
        {['They/Them', 'She/Her', 'He/Him', 'Other'].map(opt => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>

      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={[styles.input, dobLocked && styles.locked]}
        value={new Date(updated.dob).toDateString()}
        editable={false} // disable input UI for now
      />
      {dobLocked && <Text style={styles.warning}>You can't change your birthday again.</Text>}

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.input}
        value={updated.bio}
        multiline
        maxLength={160}
        onChangeText={(text) => setUpdated(prev => ({ ...prev, bio: text }))}
      />

      <Text style={styles.sectionTitle}>🗣️ Personality Prompts</Text>

        <PromptManager
          initialPrompts={profile?.extras?.prompts || {}}
          onChange={(updatedPrompts) =>
            setUpdated(prev => ({
              ...prev,
              extras: {
                ...(prev.extras || {}),
                prompts: updatedPrompts,
              },
            }))
          }
        />


      <Text style={styles.sectionTitle}>✨ Extra Info</Text>
      <Text style={styles.label}>Sexual Orientation</Text>
        <Picker
          selectedValue={updated.extras?.sexuality?.orientation || ''}
          onValueChange={(value) =>
            setUpdated(prev => ({
              ...prev,
              extras: {
                ...(prev.extras || {}),
                sexuality: {
                  ...(prev.extras?.sexuality || {}),
                  orientation: value,
                  preference: prev.extras?.sexuality?.preference || '',
                },
              },
            }))
          }
        >
          {['Straight', 'Gay', 'Bisexual', 'Pansexual', 'Queer', 'Asexual', 'Other'].map(opt => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      
        <Text style={styles.label}>Preference</Text>
        <Picker
          selectedValue={updated.extras?.sexuality?.preference || ''}
          onValueChange={(value) =>
            setUpdated(prev => ({
              ...prev,
              extras: {
                ...(prev.extras || {}),
                sexuality: {
                  ...(prev.extras?.sexuality || {}),
                  preference: value,
                },
              },
            }))
          }
        >
          {['Men', 'Women', 'Everyone', 'Nonbinary', 'Other'].map(opt => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>

    <Text style={styles.label}>Dating Intentions</Text>
        <Picker
          selectedValue={updated.extras?.intentions || ''}
          onValueChange={(value) =>
            setUpdated(prev => ({
              ...prev,
              extras: {
                ...(prev.extras || {}),
                intentions: value,
              },
            }))
          }
        >
          {['Just for fun', 'Something casual', 'Open to serious', 'Looking for serious', 'Long-term only'].map(opt => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>

    <Text style={styles.label}>Height</Text>
        <Picker
          selectedValue={updated.extras?.height || ''}
          onValueChange={(value) =>
            setUpdated(prev => ({
              ...prev,
              extras: {
                ...(prev.extras || {}),
                height: value,
              },
            }))
          }
        >
          {Array.from({ length: 23 }, (_, i) => {
            const feet = 4 + Math.floor(i / 12);
            const inches = i % 12;
            const label = `${feet}'${inches}"`;
            return <Picker.Item key={label} label={label} value={label} />;
          })}
        </Picker>

    <Text style={styles.label}>Religion</Text>
        <Picker
          selectedValue={updated.extras?.religion || ''}
          onValueChange={(value) =>
            setUpdated(prev => ({
              ...prev,
              extras: {
                ...(prev.extras || {}),
                religion: value,
              },
            }))
          }
        >
          {['Atheist', 'Agnostic', 'Christian', 'Jewish', 'Muslim', 'Spiritual', 'Hindu', 'Buddhist', 'Other'].map(opt => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
    <Text style={styles.label}>Politics</Text>
        <Picker
          selectedValue={updated.extras?.politics || ''}
          onValueChange={(value) =>
            setUpdated((prev) => ({
              ...prev,
              extras: {
                ...(prev.extras || {}),
                politics: value,
              },
            }))
          }
        >
          {['Liberal', 'Moderate', 'Conservative', 'Libertarian', 'Apolitical', 'Other'].map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>

    <Text style={styles.sectionTitle}>Substance Usage</Text>

        <SubstanceToggle
          initialValues={profile?.extras?.substances || {}}
          onChange={(updatedValues) =>
            setUpdated(prev => ({
              ...prev,
              extras: {
                ...(prev.extras || {}),
                substances: updatedValues,
              },
            }))
          }
        />
    


      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 60,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  saveBtn: {
    marginTop: 40,
    backgroundColor: '#ec4899',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  locked: {
    backgroundColor: '#f5f5f5',
  },
  warning: {
    color: '#dc2626',
    marginTop: 4,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 12,
    color: '#ec4899',
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
    
});
