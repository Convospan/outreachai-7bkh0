// src/app/layout.tsx
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
// siteConfig import might be used for title/description if metadata is handled differently
// import {siteConfig} from "@/config/site";
import { initializeFirebase } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Metadata should be defined in a Server Component or src/app/metadata.ts
// export const metadata: Metadata = {
//   title: siteConfig.name,
//   description: siteConfig.description,
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (typeof window !== 'undefined' && !isFirebaseInitialized) {
      initializeFirebase();
      setIsFirebaseInitialized(true);
    }
  }, [isFirebaseInitialized]);

  return (
      <html lang="en">
        <head>
          {/* Dynamic title and meta tags can be set here if needed, or via next/head in child components */}
          <title>ConvoSpan AI</title>
          <meta name="description" content="AI-Powered Outreach Automation" />
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
