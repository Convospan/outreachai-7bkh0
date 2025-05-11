'use client';

import type { Metadata } from 'next/metadata';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import {siteConfig} from "@/config/site";
import { initializeFirebase } from '@/lib/firebase'; 
import { useEffect, useState } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';


// This is the structure needed to get type checking with this setup
// export const metadata: Metadata = {
//   title: siteConfig.name,
//   description: siteConfig.description,
// };


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
        initializeFirebase(); // Initialize Firebase
        setIsInitialized(true);
      }
    }, [isInitialized]);

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Metadata can be set directly in head for client components or via metadata export in server components */}
          <title>{siteConfig.name}</title>
          <meta name="description" content={siteConfig.description} />
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

