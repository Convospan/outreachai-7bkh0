'use client';

import type { Metadata } from 'next/metadata'; // Keep for potential future use
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { siteConfig } from "@/config/site";
import { initializeFirebase, getFirebaseApp } from '@/lib/firebase';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Metadata for client components is typically handled via <Head> or next/head.
// Static metadata export is best done from a Server Component or src/app/metadata.ts.
// We'll keep siteConfig for dynamic title/description in <head> below.

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  const [firebaseInitStatus, setFirebaseInitStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    console.log("RootLayout: useEffect for Firebase initialization triggered.");
    if (typeof window !== 'undefined' && firebaseInitStatus === 'pending') {
      console.log("RootLayout: Attempting Firebase initialization...");
      const app = initializeFirebase();
      if (app) {
        console.log("RootLayout: Firebase initialized successfully.");
        setFirebaseInitStatus('success');
        const auth = getAuth(app);
        console.log("RootLayout: Setting up onAuthStateChanged listener.");
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log("RootLayout: Auth state changed:", user ? `User UID: ${user.uid}` : "No user");
          setCurrentUser(user);
        }, (error) => {
          console.error("RootLayout: Error in onAuthStateChanged listener:", error);
          setCurrentUser(null); // Ensure user is null on auth error
        });
        return () => {
          console.log("RootLayout: Cleaning up auth listener.");
          unsubscribe();
        };
      } else {
        console.error("RootLayout: Firebase initialization FAILED. App features relying on Firebase may not work.");
        setFirebaseInitStatus('failed');
      }
    }
  }, [firebaseInitStatus]); // Rerun if status changes, e.g., to retry if needed, or just on mount

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className="font-sans text-foreground antialiased bg-background min-h-screen flex flex-col"
      >
        {firebaseInitStatus === 'pending' && (
          <div className="flex-grow flex justify-center items-center min-h-screen bg-background text-foreground">
            Initializing Application... (Firebase Pending)
          </div>
        )}
        {firebaseInitStatus === 'failed' && (
          <div className="flex-grow flex justify-center items-center min-h-screen bg-destructive text-destructive-foreground p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Application Initialization Failed</h2>
              <p>Could not connect to Firebase. Please ensure your environment variables (NEXT_PUBLIC_FIREBASE_...) are correctly set and try again.</p>
              <p className="mt-2 text-sm">Check the browser console for more details.</p>
            </div>
          </div>
        )}
        {firebaseInitStatus === 'success' && (
          <>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Toaster />
            <Footer isHomePage={pathname === '/'} />
          </>
        )}
      </body>
    </html>
  );
}
