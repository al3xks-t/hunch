import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { collection, getDocs, query, where, onSnapshot, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import Toast from 'react-native-toast-message'; // optional

const SCREEN_WIDTH = Dimensions.get('window').width;


export default function HomeScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUid) return;
  
    const q = query(collection(db, 'users'), where('__name__', '!=', currentUid));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(fetched);
      setLoading(false); // ✅ Stop loading once users are set
    }, (error) => {
      console.error('Error fetching users in real-time:', error);
      setLoading(false); // ✅ Fail-safe
    });
  
    return () => unsubscribe();
  }, [currentUid]);
  
  

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


  const handleSwipeRight = async (likedUser) => {
    try {
      const currentUid = auth.currentUser.uid;
      const likedUid = likedUser.id;
  
      // ✅ Write to 'sent' likes
      const sentRef = doc(db, 'likes', currentUid, 'sent', likedUid);
      await setDoc(sentRef, { likedAt: serverTimestamp() });
  
      // ✅ Write to 'received' likes (for likedUser)
      const receivedRef = doc(db, 'likes', likedUid, 'received', currentUid);
      await setDoc(receivedRef, { likedAt: serverTimestamp() });
  
      // ✅ Check for mutual interest
      const reverseLike = doc(db, 'likes', likedUid, 'sent', currentUid);
      const reverseSnap = await getDoc(reverseLike);
  
      if (reverseSnap.exists()) {
        const matchId = [currentUid, likedUid].sort().join('_');
        const matchRef = doc(db, 'matches', matchId);
  
        await setDoc(matchRef, {
          users: [currentUid, likedUid],
          createdAt: serverTimestamp(),
          chatId: matchId,
        });
  
        console.log('💘 MATCHED!');
        Toast.show({ type: 'success', text1: '💖 It’s a match!' });
      } else {
        console.log('👍 Liked! Waiting for mutual like');
      }
    } catch (e) {
      console.error('❌ Swipe error:', e);
    }
  };


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
        onSwipedRight={(cardIndex) => handleSwipeRight(users[cardIndex])}
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
