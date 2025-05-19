'use client'; // Keep if needed for other client-side hooks in this file

import type { Metadata } from 'next/metadata'; // Assuming this will be handled if 'use client' is removed
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { siteConfig } from "@/config/site";
// import { initializeFirebase, app as firebaseAppInstance } from '@/lib/firebase'; // Firebase app already initialized in firebase.ts
import { app as firebaseAppInstance } from '@/lib/firebase'; // Import the initialized app
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// If 'use client' is active, metadata should be handled differently or this export removed/conditional.
// For now, assuming it might become a server component or metadata is handled via file conventions.
// export const metadata: Metadata = {
//     title: siteConfig.name,
//     description: siteConfig.description,
// };

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  const [firebaseInitStatus, setFirebaseInitStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    console.log("RootLayout: useEffect for Firebase auth state triggered.");
    if (firebaseAppInstance) {
      console.log("RootLayout: Firebase app instance is available from import.");
      setFirebaseInitStatus('success'); // Assume success if app instance is available
      const auth = getAuth(firebaseAppInstance);
      console.log("RootLayout: Setting up onAuthStateChanged listener.");
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("RootLayout: Auth state changed:", user ? `User UID: ${user.uid}` : "No user");
        setCurrentUser(user);
      }, (error) => {
        console.error("RootLayout: Error in onAuthStateChanged listener:", error);
        setCurrentUser(null);
        setFirebaseInitStatus('failed'); // Set to failed if auth listener errors
      });
      return () => {
        console.log("RootLayout: Cleaning up auth listener.");
        unsubscribe();
      };
    } else {
      // This case should ideally not be reached if firebase.ts initializes correctly
      console.error("RootLayout: Firebase app instance is NOT available from import. Firebase might not have initialized correctly in src/lib/firebase.ts.");
      setFirebaseInitStatus('failed');
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add Google Fonts link for Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        {/* Site metadata can be defined here or in a separate metadata.ts/js file if RootLayout is a Server Component */}
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
      </head>
      <body
        className="font-sans text-foreground antialiased bg-background min-h-screen flex flex-col"
        suppressHydrationWarning={true} 
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
              <p>Could not properly connect to Firebase services. Please check the console for more details and ensure your environment variables are correctly set.</p>
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
