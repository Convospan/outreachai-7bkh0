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
import {firebaseApp} from '@/lib/firebase';

export default function GoogleSignInButton() {
  const [user, setUser] = useState(null);
  const {toast} = useToast();

  const auth = getAuth(firebaseApp);
  const googleAuthProvider = new GoogleAuthProvider();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
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
