import type { Metadata } from 'next/metadata';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'ConvoSpan: AI Conversations That Convert to Real-World Impact',
  description: 'Join me on ConvoSpan.ai to streamline LinkedIn, Twitter/X, and email outreach with AI-powered calls and easy management!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="font-sans text-text-dark antialiased bg-white min-h-screen"
        suppressHydrationWarning 
      >
        <Navbar />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
