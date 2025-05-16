'use client';

import type { Metadata } from 'next/metadata'; // Keep for potential future use
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { siteConfig } from "@/config/site";
import { app } from '@/lib/firebase'; // Import the 'app' instance
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Metadata for client components is typically handled via <Head> or next/head.
// Static metadata export is best done from a Server Component or src/app/metadata.ts.

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  const [firebaseInitStatus, setFirebaseInitStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    console.log("RootLayout: useEffect for Firebase auth state triggered.");
    if (app) { // Firebase app is initialized when src/lib/firebase.ts is imported
      console.log("RootLayout: Firebase app instance is available.");
      setFirebaseInitStatus('success');
      const auth = getAuth(app);
      console.log("RootLayout: Setting up onAuthStateChanged listener.");
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("RootLayout: Auth state changed:", user ? `User UID: ${user.uid}` : "No user");
        setCurrentUser(user);
      }, (error) => {
        console.error("RootLayout: Error in onAuthStateChanged listener:", error);
        setCurrentUser(null); 
        setFirebaseInitStatus('failed'); // Potentially set to failed if auth listener setup fails
      });
      return () => {
        console.log("RootLayout: Cleaning up auth listener.");
        unsubscribe();
      };
    } else {
      console.error("RootLayout: Firebase app instance is NOT available. Firebase might not have initialized correctly in src/lib/firebase.ts.");
      setFirebaseInitStatus('failed');
    }
  }, []); // Empty dependency array ensures this runs once on mount

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
            Initializing Application...
          </div>
        )}
        {firebaseInitStatus === 'failed' && (
          <div className="flex-grow flex justify-center items-center min-h-screen bg-destructive text-destructive-foreground p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Application Initialization Failed</h2>
              <p>Could not properly connect to Firebase services. Please check the console for more details.</p>
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
