// Firebase configuration for RVCE Visitor Management System
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const requiredConfig = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN', 
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingConfig = requiredConfig.filter(key => !process.env[key]);

// Declare exports at top level
let db: any;
let auth: any;
let storage: any;
let googleProvider: any;

if (missingConfig.length > 0) {
  console.warn('⚠️ Missing Firebase configuration variables:', missingConfig);
  console.warn('🔧 Using mock Firebase for development. Please set up environment variables for production.');
  
  // Fall back to mock services if configuration is incomplete
  const mockDb = {
    collection: (collectionName: string) => ({
      add: async (data: any) => ({ id: `mock_${Date.now()}` }),
      doc: (id: string) => ({
        update: async (data: any) => Promise.resolve(),
        delete: async () => Promise.resolve(),
      }),
    }),
  };
  
  db = mockDb;
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: async (email: string, password: string) => {
      return { user: { uid: 'mock-uid', email } };
    },
    signOut: async () => Promise.resolve(),
  };
  googleProvider = null;
  
} else {
  // Initialize Firebase with real configuration
  console.log('🔥 Initializing Firebase with project:', firebaseConfig.projectId);
  
  const app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  
  // Configure Google provider
  googleProvider.setCustomParameters({
    hd: 'rvce.edu.in' // Restrict to RVCE domain
  });
  
  console.log('✅ Firebase initialized successfully');
}

// Export the Firebase services
export { auth, db, storage, googleProvider };
// Export the Firebase config as default
export default firebaseConfig;
