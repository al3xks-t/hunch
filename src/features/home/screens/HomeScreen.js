import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), where('__name__', '!=', currentUid));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(fetched);
      } catch (e) {
        console.error('Error fetching users:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emoji}>😢</Text>
        <Text style={styles.message}>No one is around just yet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={users}
        renderCard={(user) => (
          <View style={styles.card}>
            {user.photoURL && (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            )}
            <Text style={styles.name}>{user.name}</Text>
            {user.pronouns && <Text style={styles.meta}>{user.pronouns}</Text>}
            {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
          </View>
        )}
        backgroundColor="#f4f4f4"
        stackSize={3}
        cardIndex={0}
        showSecondCard
        animateCardOpacity
        disableTopSwipe
        disableBottomSwipe
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: SCREEN_WIDTH * 0.9,
    height: 480,
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
});
