'use client';

import type { Metadata } from 'next/metadata';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import {siteConfig} from "@/config/site";
// import { initializeFirebase } from '@/lib/firebase'; // This was commented out
import { getFirebaseApp } from '@/lib/firebase'; // Switched to getFirebaseApp
import { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/nextjs'; // Correct import
import { usePathname } from 'next/navigation';


// Metadata is in src/app/metadata.ts

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';


    useEffect(() => {
      if (typeof window !== 'undefined' && !isInitialized) {
        getFirebaseApp(); // Initialize Firebase
        setIsInitialized(true);
      }
    }, [isInitialized]);

  // The ClerkProvider should ideally get the publishableKey from process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  // If this is not working, it means the environment variable is not set correctly or not accessible.
  // The error "Publishable key not valid" points to the VALUE of the key being wrong or the variable not being loaded.
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <head>
          {/* Metadata can be set directly in head for client components or via metadata export in server components */}
          <title>{siteConfig.name}</title>
          <meta name="description" content={siteConfig.description} />
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body
          className="font-sans text-foreground antialiased bg-background min-h-screen flex flex-col"
          suppressHydrationWarning // Suppress hydration warnings for this element
        >
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Toaster />
          <Footer isHomePage={isHomePage} />
        </body>
      </html>
    </ClerkProvider>
  );
}

