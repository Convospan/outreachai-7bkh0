import type { Metadata } from 'next/metadata';

export const metadata: Metadata = {
  title: 'ConvoSpan: AI Conversations That Convert to Real-World Impact',
  description: 'Join me on ConvoSpan.ai for smart outreach with AI calls and sequences!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-text-dark antialiased bg-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
