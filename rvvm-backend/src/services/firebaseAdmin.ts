import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    try {
      // For development without service account
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'rv-visitor-management',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'rv-visitor-management.firebasestorage.app'
      });
      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.warn('⚠️ Firebase Admin initialization failed:', error);
      console.log('💡 Running in development mode without Firebase Admin');
    }
  }
  return admin;
};

const firebaseAdmin = initializeFirebaseAdmin();
export const adminAuth = firebaseAdmin.auth();
export const adminDb = firebaseAdmin.firestore();
export const adminStorage = firebaseAdmin.storage();

export default firebaseAdmin;
