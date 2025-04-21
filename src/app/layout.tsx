'use client';

import type { Metadata } from 'next/metadata';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
// Import Geist fonts
//import { GeistSans } from 'geist/font/sans'
//import { GeistMono } from 'geist/font/mono'
import {siteConfig} from "@/config/site";

//const geistSans = GeistSans({ variable: '--font-geist-sans' });
//const geistMono = GeistMono({ variable: '--font-geist-mono' });

// This is the structure needed to get type checking with this setup
// export const metadata: Metadata = {
//   title: siteConfig.name,
//   description: siteConfig.description,
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="font-sans text-text-dark antialiased bg-white min-h-screen"
        suppressHydrationWarning // Suppress hydration warnings for this element
      >
        <Navbar />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
