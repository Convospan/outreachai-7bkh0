'use client';

import type { Metadata } from 'next/metadata';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import '../app/globals.css';
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

