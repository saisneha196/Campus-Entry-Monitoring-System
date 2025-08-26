import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string, username: string) => Promise<void>;
  signInWithGoogle: (role: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Loading while checking auth state
    error: undefined
  });

  // Helper function to convert Firebase user to our User type
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      // Try to get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      if (userData) {
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: userData.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: (userData.role || localStorage.getItem('userRole') || 'host') as 'visitor' | 'host' | 'security' | 'admin',
          photoUrl: firebaseUser.photoURL || userData.photoUrl
        };
      } else {
        // If no user document, create basic user data
        const userRole = localStorage.getItem('userRole') || 'host';
        const newUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: userRole,
          photoUrl: firebaseUser.photoURL
        };
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          email: newUserData.email,
          name: newUserData.name,
          role: newUserData.role,
          photoUrl: newUserData.photoUrl,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        }, { merge: true });
        
        return {
          ...newUserData,
          role: userRole as 'visitor' | 'host' | 'security' | 'admin',
          photoUrl: newUserData.photoUrl || undefined
        };
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      // Fall back to basic user data from Firebase Auth
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: (localStorage.getItem('userRole') || 'host') as 'visitor' | 'host' | 'security' | 'admin',
        photoUrl: firebaseUser.photoURL || undefined
      };
    }
  };

  // Auth state listener
  useEffect(() => {
    if (!auth) {
      console.log('Firebase auth not available, using mock authentication');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: undefined
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email || 'No user');
      try {
        if (firebaseUser) {
          const user = await convertFirebaseUser(firebaseUser);
          setAuthState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            error: undefined
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: undefined
          });
        }
      } catch (error: any) {
        console.error('Auth state change error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error.message
        });
      }
    });

    return unsubscribe;
  }, []);

  // Real Firebase Authentication
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }));
      
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      // Validate RVCE email in development
      if (process.env.NODE_ENV === 'production' && !email.endsWith('@rvce.edu.in')) {
        throw new Error('Only RVCE email addresses (@rvce.edu.in) are allowed');
      }
      
      const credential = await signInWithEmailAndPassword(auth, email, password);
      
      if (credential.user) {
        // Update last login time
        const userRole = localStorage.getItem('userRole') || 'host';
        await setDoc(doc(db, 'users', credential.user.uid), {
          lastLogin: serverTimestamp(),
          role: userRole
        }, { merge: true });
      }
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: handleAuthError(error)
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: string, username: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }));
      
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      // Validate RVCE email in production
      if (process.env.NODE_ENV === 'production' && !email.endsWith('@rvce.edu.in')) {
        throw new Error('Only RVCE email addresses (@rvce.edu.in) are allowed');
      }
      
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (credential.user) {
        // Create user document in Firestore
        await setDoc(doc(db, 'users', credential.user.uid), {
          email,
          name: username || credential.user.email?.split('@')[0] || 'User',
          role: role || 'host', // Default to host for new signups
          photoUrl: credential.user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      }
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: handleAuthError(error)
      }));
      throw error;
    }
  };

  const signInWithGoogle = async (role: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }));
      
      if (!auth || !googleProvider) {
        throw new Error('Google Sign-In not available');
      }
      
      const result = await signInWithPopup(auth, googleProvider);
      
      if (result.user) {
        // Validate RVCE email in production
        if (process.env.NODE_ENV === 'production' && !result.user.email?.endsWith('@rvce.edu.in')) {
          await firebaseSignOut(auth);
          throw new Error('Only RVCE email addresses (@rvce.edu.in) are allowed');
        }
        
        // Create/update user document in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          name: result.user.displayName || result.user.email?.split('@')[0] || 'User',
          role: role || 'host',
          photoUrl: result.user.photoURL,
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: handleAuthError(error)
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      } else {
        // Handle mock sign out
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: undefined
        });
      }
      localStorage.removeItem('userRole');
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Failed to sign out' 
      }));
      throw error;
    }
  };

  // Error handling helper
  const handleAuthError = (error: any): string => {
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'No user found with this email';
        case 'auth/wrong-password':
          return 'Incorrect password';
        case 'auth/invalid-email':
          return 'Please enter a valid RVCE email address';
        case 'auth/email-already-in-use':
          return 'This email is already registered';
        case 'auth/weak-password':
          return 'Password is too weak. Password must be at least 6 characters';
        case 'auth/user-disabled':
          return 'This account has been disabled';
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later';
        case 'auth/operation-not-allowed':
          return 'Email/password sign in is not enabled';
        case 'auth/invalid-credential':
          return 'Invalid email or password';
        case 'auth/popup-closed-by-user':
          return 'Sign-in was cancelled';
        case 'auth/popup-blocked':
          return 'Please allow popups for this website';
        default:
          return error.message || 'Authentication failed';
      }
    }
    return error.message || 'An unexpected error occurred';
  };

  const value: AuthContextType = {
    ...authState,
    currentUser: authState.user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    logout: signOut // Alias for compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
