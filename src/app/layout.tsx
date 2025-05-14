// src/app/layout.tsx
'use client';

import type { Metadata } from 'next/metadata'; // Keep for potential future use if some metadata is static
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
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!isFirebaseInitialized) {
        console.log("Attempting Firebase initialization in RootLayout...");
        const app = initializeFirebase(); // This function now handles missing env vars gracefully
        if (app) {
          console.log("Firebase initialized successfully in RootLayout.");
          setIsFirebaseInitialized(true);
          const auth = getAuth(app);
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed:", user ? `User UID: ${user.uid}` : "No user");
            setCurrentUser(user);
            setIsLoadingAuth(false);
          });
          return () => {
            console.log("Cleaning up auth listener.");
            unsubscribe();
          };
        } else {
          console.error("🔴 Firebase initialization FAILED in RootLayout. App features relying on Firebase may not work.");
          setIsLoadingAuth(false); // Stop loading even if init fails
        }
      } else if (isFirebaseInitialized && isLoadingAuth) {
        const app = getFirebaseApp();
        if (app) {
            const auth = getAuth(app);
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setIsLoadingAuth(false);
            });
            return () => unsubscribe();
        } else {
            console.error("🔴 Firebase was marked as initialized, but getFirebaseApp() returned null.");
            setIsLoadingAuth(false);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirebaseInitialized]);

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
        {isLoadingAuth || !isFirebaseInitialized ? (
          <div className="flex-grow flex justify-center items-center min-h-screen bg-background text-foreground">
            Initializing Application...
          </div>
        ) : (
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
