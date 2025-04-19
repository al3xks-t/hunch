import { useAuth } from '../../../context/AuthContext';
import { Image, View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function ViewProfileScreen() {
  const { profile } = useAuth();
  const navigation = useNavigation();


  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
        },
      },
    ]);
  };

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
      now.getMonth() > dob.getMonth() ||
      (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
    if (!hasHadBirthdayThisYear) age--;
    return age;
  };
  

  const extras = profile?.extras || {};

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>

        {profile?.photoURL ? (
          <Image
            source={{ uri: profile.photoURL }}
            style={{ width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 20 }}
          />
        ) : (
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>No Photo</Text>
          </View>
        )}


      <Text style={styles.sectionTitle}>🧍 Basic Info</Text>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{profile?.name}</Text>

      <Text style={styles.label}>Pronouns:</Text>
      <Text style={styles.value}>{profile?.pronouns}</Text>

      <Text style={styles.label}>Age:</Text>
      <Text style={styles.value}>{profile?.dob ?`${calculateAge(profile.dob)} years old` : '—'}</Text>

      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{profile?.location}</Text>

      <Text style={styles.label}>Bio:</Text>
      <Text style={styles.value}>{profile?.bio || '—'}</Text>

      {extras?.prompts && Object.keys(extras.prompts).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🗣️ Personality Prompts</Text>
            {Object.entries(extras.prompts).map(([prompt, answer], index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.label}>{prompt}</Text>
                <Text style={styles.value}>{answer}</Text>
              </View>
            ))}
          </>
        )}


      <Text style={styles.sectionTitle}>✨ Extra Info</Text>
      <Text style={styles.label}>Sexuality:</Text>
      <Text style={styles.value}>
        {extras?.sexuality?.orientation || '—'} (prefers {extras?.sexuality?.preference || '—'})
      </Text>

      <Text style={styles.label}>Intentions:</Text>
      <Text style={styles.value}>{extras?.intentions || '—'}</Text>

      <Text style={styles.label}>Height:</Text>
      <Text style={styles.value}>{extras?.height || '—'}</Text>

      <Text style={styles.label}>Religion:</Text>
      <Text style={styles.value}>{extras?.religion || '—'}</Text>

      <Text style={styles.label}>Politics:</Text>
      <Text style={styles.value}>{extras?.politics || '—'}</Text>

      <Text style={styles.label}>Substance Use:</Text>
      <Text style={styles.value}>
        {extras?.substances?.drinks ? '🍷 Drinks' : ''}
        {extras?.substances?.smokes ? ' 🚬 Smokes' : ''}
        {extras?.substances?.cannabis ? ' 🌿 Cannabis' : ''}
        {!extras?.substances?.drinks && !extras?.substances?.smokes && !extras?.substances?.cannabis && '—'}
      </Text>

      <Text style={styles.label}>Interests:</Text>
      <Text style={styles.value}>
        {extras?.interests?.length ? extras.interests.join(', ') : '—'}
      </Text>

      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>


      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#ec4899',
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 14,
    color: '#444',
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  editText: {
    color: '#333',
    fontWeight: 'bold',
  },
  
});
