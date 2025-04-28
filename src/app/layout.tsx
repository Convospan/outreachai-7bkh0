import type { Metadata } from 'next/metadata';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { metadata as siteMetadata } from './metadata'; // Import metadata

export const metadata: Metadata = siteMetadata; // Use imported metadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
