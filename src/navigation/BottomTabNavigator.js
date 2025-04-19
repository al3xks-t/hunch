import { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { collection, collectionGroup, query, where, onSnapshot, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

import HomeScreen from '../features/home/screens/HomeScreen';
import ViewProfileScreen from '../features/profile/screens/ViewProfileScreen';
import MatchesScreen from '../features/matches/screens/MatchesScreen';
import LikesScreen  from '../features/likes/screens/LikesScreen';


// Placeholder screens

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const [likeCount, setLikeCount] = useState(0);
    const currentUid = auth.currentUser?.uid;
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!currentUid) return;
      
        const matchQuery = query(
          collection(db, 'matches'),
          where('users', 'array-contains', currentUid)
        );
      
        const unsubscribeMatches = onSnapshot(matchQuery, (snapshot) => {
          const chatIds = snapshot.docs.map(doc => doc.data().chatId);
      
          if (chatIds.length === 0) {
            setUnreadCount(0);
            return;
          }
      
          let unsubMessages = [];
      
          // Instead of using a local mutable counter, use a ref or recalc
          let allUnsubs = chatIds.map((chatId) => {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'desc'));
      
            return onSnapshot(q, (msgSnap) => {
              let total = 0;
              msgSnap.docs.forEach(doc => {
                const msg = doc.data();
                if (msg.sender !== currentUid && !msg.seen) {
                  total += 1;
                }
              });
      
              // Dynamically re-check unread count every time one chat changes
              setUnreadCount(prev => {
                // We could improve this with a `Map<chatId, count>` if needed
                const allCounts = unsubMessages.map(fn => fn.latestCount || 0);
                const newTotal = allCounts.reduce((a, b) => a + b, total); // Use current as override
                return newTotal;
              });
            });
          });
      
          unsubMessages = allUnsubs;
          return () => unsubMessages.forEach(unsub => unsub());
        });
      
        return () => unsubscribeMatches();
      }, [currentUid]);
      
      

    useEffect(() => {
        if (!currentUid) return;
      
        const q = collectionGroup(db, 'liked');
      
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          let count = 0;
      
          for (const docSnap of snapshot.docs) {
            if (docSnap.id === currentUid) {
              const likerUid = docSnap.ref.parent.parent.id;
      
              // Check if YOU liked them back
              const youLikedRef = doc(db, 'likes', currentUid, 'liked', likerUid);
              const youLikedSnap = await getDoc(youLikedRef);
      
              if (!youLikedSnap.exists()) {
                count++;
              }
            }
          }
      
          setLikeCount(count);
        }, (err) => {
          console.error('❌ Live like listener failed:', err);
        });
      
        return () => unsubscribe();
      }, [currentUid]);      

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ec4899',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let icon;

          switch (route.name) {
            case 'Home':
              icon = 'home';
              break;
            case 'Likes':
              icon = 'heart';
              break;
            case 'Matches':
              icon = 'chatbubbles';
              break;
            case 'Profile':
              icon = 'person';
              break;
          }

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Likes" component={LikesScreen} options={{ tabBarBadge: likeCount > 0 ? likeCount : null, tabBarBadgeStyle: {backgroundColor: '#ec4899', color: '#fff'}}}/>
      <Tab.Screen name="Matches" component={MatchesScreen} options={{ tabBarBadge: unreadCount > 0 ? unreadCount : null, tabBarBadgeStyle: {backgroundColor: '#ec4899', color: '#fff'}}}/>
      <Tab.Screen name="Profile" component={ViewProfileScreen} />
    </Tab.Navigator>
  );
}
