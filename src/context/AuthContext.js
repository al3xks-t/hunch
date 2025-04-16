// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext({ user: null, profile: null, refreshProfile: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid) => {
    console.log('🔎 Checking Firestore for profile:', uid);
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    console.log('📄 Firestore doc exists:', docSnap.exists());
    console.log('📄 Firestore doc data:', docSnap.data());
  
    setProfile(docSnap.exists() ? docSnap.data() : null);
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👤 onAuthStateChanged:', firebaseUser?.uid);
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile: () => fetchUserProfile(user?.uid) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
