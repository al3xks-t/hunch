import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MatchesScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUid) {
      console.log('⛔ currentUid not ready yet');
      return;
    }

    const q = query(collection(db, 'matches'), where('users', 'array-contains', currentUid));
    console.log('✅ Listening for matches of UID:', currentUid);

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const fetched = await Promise.all(snapshot.docs.map(async (docSnap) => {
          const match = docSnap.data();
          const otherUid = match.users.find(uid => uid !== currentUid);
          try {
            const userSnap = await getDoc(doc(db, 'users', otherUid));
            return userSnap.exists() ? {
              id: docSnap.id,
              chatId: match.chatId,
              user: userSnap.data(),
            } : null;
          } catch (e) {
            console.error(`❌ Error fetching user ${otherUid}:`, e);
            return null;
          }
        }));

        const cleanMatches = fetched.filter(item => item !== null);
        setMatches(cleanMatches);
        setLoading(false);
      } catch (err) {
        console.error('🔥 Error processing match snapshot:', err);
        setLoading(false);
      }
    }, (error) => {
      console.error('🔥 Error with Firestore onSnapshot:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUid]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (matches.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No matches yet 😢</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.matchCard}
          onPress={() => navigation.navigate('Chat', { chatId: item.chatId, user: item.user })}
        >
          <Image
            source={{ uri: item.user.photoURL }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{item.user.name}</Text>
            <Text style={styles.meta}>Tap to chat 💬</Text>
          </View>
        </TouchableOpacity>
      )}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 18,
    color: '#888',
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  meta: {
    color: '#888',
  },
});
