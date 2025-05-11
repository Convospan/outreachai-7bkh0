// src/app/layout.tsx
'use client';

// import type { Metadata } from 'next/metadata'; // Metadata export removed due to 'use client'
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import {siteConfig} from "@/config/site";
import { initializeFirebase } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname

// Metadata is now typically handled by a parent Server Component or a `generateMetadata` function in a Server Component.
// For 'use client' layouts, you'd put <title> and <meta> tags directly in the <head>.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname(); // Use usePathname hook
  const isHomePage = pathname === '/';


    useEffect(() => {
      if (typeof window !== 'undefined' && !isInitialized) {
        initializeFirebase(); // Initialize Firebase
        setIsInitialized(true);
      }
    }, [isInitialized]);

  return (
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
