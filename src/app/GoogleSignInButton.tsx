'use client';

import {useState, useEffect} from 'react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {initializeApp, getApps, FirebaseApp} from 'firebase/app';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';

let firebaseApp: FirebaseApp;

export default function GoogleSignInButton() {
  const [user, setUser] = useState(null);
  const {toast} = useToast();

  const auth = getAuth(firebaseApp);
  const googleAuthProvider = new GoogleAuthProvider();

  // Initialize Firebase only once
  if (!getApps().length) {
  
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
  
    // Check for missing environment variables
    const missingKeys = Object.keys(firebaseConfig).filter(key => !firebaseConfig[key]);
    if (missingKeys.length > 0) {
      console.error('Missing Firebase environment variables:', missingKeys.join(', '));
      // Only throw an error in the client-side, after the component has mounted:
      if (typeof window !== 'undefined') {
          throw new Error(`Missing Firebase environment variables: ${missingKeys.join(', ')}`);
      } else {
          console.warn("Firebase environment variables missing on server, but will not throw error as this can prevent server side rendering.")
      }
    }
      
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0]; // Use existing app if already initialized
  }

  useEffect(() => {
    const auth = getAuth(firebaseApp); // Get auth within the useEffect
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const auth = getAuth(firebaseApp); // Get auth within the signInWithGoogle function
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error: any) {
      console.error('Error signing in with Google', error.message);
      toast({
        title: 'Error',
        description: 'Error signing in with Google',
        variant: 'destructive',
      });
    }
  };

  const signOutGoogle = async () => {
    try {
      const auth = getAuth(firebaseApp); // Get auth within the signOutGoogle function
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: 'Signed out Successfully!',
      });
    } catch (error: any) {
      console.error('Error signing out with Google', error.message);
      toast({
        title: 'Error',
        description: 'Error signing out with Google',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      {user ? (
        <Button variant="outline" onClick={signOutGoogle}>
          Sign Out
        </Button>
      ) : (
        <Button onClick={signInWithGoogle}>Sign In with Google</Button>
      )}
    </div>
  );
}

export {firebaseApp};
