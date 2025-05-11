'use client';

import type { Metadata } from 'next/metadata';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import {siteConfig} from "@/config/site";
import { getFirebaseApp } from '@/lib/firebase'; 
import { useEffect, useState } from 'react';
// import { ClerkProvider } from '@clerk/nextjs'; // Removed Clerk import

// Metadata is in src/app/metadata.ts

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''; // Defensively get pathname
  const isHomePage = pathname === '/';


    useEffect(() => {
      if (typeof window !== 'undefined' && !isInitialized) {
        getFirebaseApp(); // Initialize Firebase
        setIsInitialized(true);
      }
    }, [isInitialized]);

  return (
    // Removed ClerkProvider
      <html lang="en">
        <head>
          <title>{siteConfig.name}</title>
          <meta name="description" content={siteConfig.description} />
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body
          className="font-sans text-foreground antialiased bg-background min-h-screen flex flex-col"
          suppressHydrationWarning 
        >
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Toaster />
          <Footer isHomePage={isHomePage} />
        </body>
      </html>
  );
}
