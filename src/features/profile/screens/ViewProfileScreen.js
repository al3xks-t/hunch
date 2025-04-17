import { useAuth } from '../../../context/AuthContext';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase';

export default function ViewProfileScreen() {
  const { profile } = useAuth();

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

  const extras = profile?.extras || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>🧍 Basic Info</Text>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{profile?.name}</Text>

      <Text style={styles.label}>Pronouns:</Text>
      <Text style={styles.value}>{profile?.pronouns}</Text>

      <Text style={styles.label}>Birthday:</Text>
      <Text style={styles.value}>{profile?.dob ? new Date(profile.dob).toDateString() : '—'}</Text>

      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{profile?.location}</Text>

      <Text style={styles.label}>Bio:</Text>
      <Text style={styles.value}>{profile?.bio || '—'}</Text>

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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
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
});
