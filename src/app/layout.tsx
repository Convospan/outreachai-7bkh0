'use client';

import type { Metadata } from 'next/metadata';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
// siteConfig import might be unused now if metadata is removed, but let's keep it for now.
// If it's truly unused after this change, it can be cleaned up later.
import {siteConfig} from "@/config/site";
import { initializeFirebase } from '@/lib/firebase';
import { useEffect, useState } from 'react';

// Metadata cannot be exported from a Client Component.
// If static metadata is needed, it should be defined in a Server Component
// or handled dynamically in client components (e.g., document.title).
// For now, removing this export to resolve the conflict with 'use client'.
// export const metadata: Metadata = {
//     title: siteConfig.name,
//     description: siteConfig.description,
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
      if (typeof window !== 'undefined' && !isInitialized) {
        initializeFirebase();
        setIsInitialized(true);
      }
    }, [isInitialized]);

  return (
    <html lang="en">
      <head>
        {/* It's generally better to let Next.js handle title and meta descriptions
            through its metadata API in Server Components (page.tsx or layout.tsx if server).
            Since this layout is now a client component, this is a way to set a default title.
            For per-page titles, individual pages should manage their own or use a client-side solution.
        */}
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
        <Footer />
      </body>
    </html>
  );
}
