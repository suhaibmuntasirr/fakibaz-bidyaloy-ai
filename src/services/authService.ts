
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { firebaseService } from './firebaseService';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
}

class AuthService {
  async signUp(email: string, password: string, fullName: string, phoneNumber?: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: fullName
      });

      // Create user profile in Firestore
      await firebaseService.createOrUpdateUserProfile({
        uid: user.uid,
        fullName,
        email: user.email!,
        phoneNumber: phoneNumber || '',
        points: 0,
        notesUploaded: 0,
        questionsUploaded: 0,
        badge: 'Bronze',
        joinedAt: new Date(),
        lastActive: new Date()
      });

      return {
        uid: user.uid,
        email: user.email!,
        displayName: fullName,
        photoURL: user.photoURL,
        phoneNumber: phoneNumber
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last active
      await firebaseService.createOrUpdateUserProfile({
        uid: user.uid,
        lastActive: new Date()
      });

      return {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  async updateUserProfile(updates: Partial<AuthUser>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    try {
      if (updates.displayName || updates.photoURL) {
        await updateProfile(user, {
          displayName: updates.displayName,
          photoURL: updates.photoURL
        });
      }

      // Update Firestore profile
      await firebaseService.createOrUpdateUserProfile({
        uid: user.uid,
        ...updates
      });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
