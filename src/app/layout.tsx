import type { Metadata} from 'next/metadata';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import {metadata} from './metadata';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased">
          <Navbar />
          <main className="flex-1">
          {children}
          </main>
          <Footer />
          <Toaster />
      </body>
    </html>
  );
}
