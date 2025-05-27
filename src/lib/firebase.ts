
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-GmdiQ762QaWp7Lw_iZMrPCiwKFi0QIk",
  authDomain: "fakibaz-f8afb.firebaseapp.com",
  projectId: "fakibaz-f8afb",
  storageBucket: "fakibaz-f8afb.firebasestorage.app",
  messagingSenderId: "323925967726",
  appId: "1:323925967726:web:03042f3649724eddb2777f",
  measurementId: "G-NB2QSQN6JE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
