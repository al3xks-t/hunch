import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, getDocs, doc, deleteDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function LikesScreen() {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUid = auth.currentUser?.uid;
  const navigation = useNavigation();

  useEffect(() => {
    if (!currentUid) return;

    const fetchLikes = async () => {
      try {
        const receivedRef = collection(db, 'likes', currentUid, 'received');
        const snapshot = await getDocs(receivedRef);

        const likedUsers = await Promise.all(snapshot.docs.map(async (docSnap) => {
          const likerUid = docSnap.id;
          const userSnap = await getDoc(doc(db, 'users', likerUid));
          return userSnap.exists() ? { id: likerUid, ...userSnap.data() } : null;
        }));

        setLikes(likedUsers.filter(u => u));
        setLoading(false);
      } catch (e) {
        console.error('❌ Error loading likes:', e);
        setLoading(false);
      }
    };

    fetchLikes();
  }, [currentUid]);

  const handleLikeBack = async (likedUser) => {
    const likedUid = likedUser.id;
    const matchId = [currentUid, likedUid].sort().join('_');

    try {
      // ✅ Create match
      await setDoc(doc(db, 'matches', matchId), {
        users: [currentUid, likedUid],
        createdAt: serverTimestamp(),
        chatId: matchId,
      });

      // ✅ Clean up sent/received likes
      await deleteDoc(doc(db, 'likes', currentUid, 'received', likedUid));
      await deleteDoc(doc(db, 'likes', likedUid, 'sent', currentUid));

      setLikes((prev) => prev.filter(user => user.id !== likedUid));
    } catch (e) {
      console.error('❌ Like back failed:', e);
    }
  };

  const handleReject = async (likedUser) => {
    try {
      await deleteDoc(doc(db, 'likes', currentUid, 'received', likedUser.id));
      setLikes((prev) => prev.filter(user => user.id !== likedUser.id));
    } catch (e) {
      console.error('❌ Rejection failed:', e);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;

  if (likes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No one has liked you yet 😭</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <FlatList
      data={likes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.photoURL }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.bio}>{item.bio || 'No bio yet.'}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.reject} onPress={() => handleReject(item)}>
                <Text style={styles.buttonText}>❌</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.accept} onPress={() => handleLikeBack(item)}>
                <Text style={styles.buttonText}>❤️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  reject: {
    backgroundColor: '#f87171',
    padding: 10,
    borderRadius: 10,
  },
  accept: {
    backgroundColor: '#4ade80',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
