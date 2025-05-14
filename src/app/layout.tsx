'use client';

import type { Metadata } from 'next/metadata';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { siteConfig } from "@/config/site";
import { initializeFirebase, getFirebaseApp } from '@/lib/firebase';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

// Metadata should be defined in a Server Component or src/app/metadata.ts
// For client components, metadata is typically handled via <Head> or next/head
// This metadata object will be ignored in a 'use client' component.
// export const metadata: Metadata = {
//     title: siteConfig.name,
//     description: siteConfig.description,
// };

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const pathname = usePathname(); // To determine if it's the home page for the footer

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!isFirebaseInitialized) {
        console.log("Attempting Firebase initialization in RootLayout...");
        const app = initializeFirebase();
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
        // This case handles scenarios like hot-reloads where isFirebaseInitialized might be true
        // but we still need to set up the auth listener or confirm auth state.
        const app = getFirebaseApp();
        if (app) {
            const auth = getAuth(app);
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setIsLoadingAuth(false);
            });
            return () => unsubscribe();
        } else {
            // Should not happen if isFirebaseInitialized is true, but as a safeguard:
            console.error("🔴 Firebase was marked as initialized, but getFirebaseApp() returned null.");
            setIsLoadingAuth(false);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirebaseInitialized]); // Removed isLoadingAuth from dependencies to avoid potential loops if auth state changes rapidly

  if (isLoadingAuth && !isFirebaseInitialized) {
    // Initial loading state before Firebase is attempted
    return <div className="flex justify-center items-center min-h-screen bg-background text-foreground">Initializing Application...</div>;
  }

  return (
    <html lang="en">
      <head>
        {/* For Client Components, manage title/meta tags using next/head or a similar solution if needed */}
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className="font-sans text-foreground antialiased bg-background min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {/* We can conditionally render Navbar/Footer based on auth state or loading state if needed */}
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Toaster />
        <Footer isHomePage={pathname === '/'} />
      </body>
    </html>
  );
}
