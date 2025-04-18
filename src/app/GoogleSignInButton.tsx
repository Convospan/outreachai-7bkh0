'use client';

import {useState, useEffect} from 'react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { initializeFirebase } from '@/lib/firebase';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';

export default function GoogleSignInButton() {
  const [user, setUser] = useState(null);
  const {toast} = useToast();
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    const app = initializeFirebase();
    if (app) {
      setFirebaseInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!firebaseInitialized) return;

    const app = initializeFirebase();
    if (!app) return;

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, [firebaseInitialized]);

  const signInWithGoogle = async () => {
    try {
      const app = initializeFirebase();
      if (!app) {
        toast({
          title: 'Error',
          description: 'Firebase not initialized',
          variant: 'destructive',
        });
        return;
      }
      const auth = getAuth(app); // Get auth within the signInWithGoogle function
      const googleAuthProvider = new GoogleAuthProvider();
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
      const app = initializeFirebase();
      if (!app) {
        toast({
          title: 'Error',
          description: 'Firebase not initialized',
          variant: 'destructive',
        });
        return;
      }
      const auth = getAuth(app); // Get auth within the signOutGoogle function
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
        <Button onClick={signInWithGoogle} disabled={!firebaseInitialized}>
          Sign In with Google
        </Button>
      )}
    </div>
  );
}
