
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { firebaseService } from '@/services/firebaseService';

interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  studentIdUrl?: string;
  points: number;
  notesUploaded: number;
  questionsUploaded: number;
  badge: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinedAt: Date;
  lastActive: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // Create new user profile if it doesn't exist
            const newProfile = {
              uid: user.uid,
              fullName: user.displayName || '',
              email: user.email || '',
              phoneNumber: user.phoneNumber || ''
            };
            
            await firebaseService.createOrUpdateUserProfile(newProfile);
            
            // Fetch the created profile
            const newUserDoc = await getDoc(doc(db, 'users', user.uid));
            if (newUserDoc.exists()) {
              setUserProfile(newUserDoc.data() as UserProfile);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
