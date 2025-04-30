'use client'; // Keep 'use client' for useEffect

import type { Metadata } from 'next/metadata';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { metadata as siteMetadata } from './metadata'; // Import metadata
import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/lib/firebase';


// Removed metadata export from here

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
      if (!isInitialized) {
        initializeFirebase();
        setIsInitialized(true);
      }
    }, [isInitialized]);

  return (
    <html lang="en">
      <head>
        {/* Metadata tags will be injected by Next.js based on src/app/metadata.ts */}
      </head>
      <body
        className="font-sans text-foreground antialiased bg-background min-h-screen" // Use theme variables
        suppressHydrationWarning // Suppress hydration warnings for this element
      >
        <Navbar />
        <div className="flex-grow">{children}</div> {/* Ensure children take up space */}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}