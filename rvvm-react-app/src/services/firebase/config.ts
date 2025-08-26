// Firebase configuration for React app
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA3ysGTUgUrKSTS5XH8Nvb_NlstbSlPHE4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "rv-visitor-management.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "rv-visitor-management",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "rv-visitor-management.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "659878986292",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:659878986292:web:10e0f58c20029d16084061",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-34Y88G8X56"
};

// Initialize Firebase
let app: any;
let auth: any;
let db: any;
let storage: any;
let googleProvider: any;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.warn('⚠️ Firebase initialization failed:', error);
  // Create mock objects for development
  auth = { onAuthStateChanged: () => () => {}, signInWithEmailAndPassword: () => Promise.resolve() };
  db = {};
  storage = {};
  googleProvider = {};
}

export { auth, googleProvider, db, storage };

export default app;
