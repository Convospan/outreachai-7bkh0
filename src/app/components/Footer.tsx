import Link from 'next/link';
import type React from 'react';

interface FooterProps {
  isHomePage?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isHomePage }) => {
  return (
    <footer className="bg-background border-t py-4 text-center text-sm text-foreground">
      <div className="font-bold uppercase inline-block border px-2 py-1 rounded mb-2 text-primary">
        CONVOSPAN
      </div>
      <div>
        Copyright 2025 ConvoSpan - part of Sudhisha Digital Private Limited
      </div>
      <div className="mt-2 space-x-2">
        <Link href="/sitemap.xml" className="hover:text-primary hover:underline">Sitemap</Link>
        <span className="text-muted-foreground">|</span>
        <Link href="/contact" className="hover:text-primary hover:underline">Contact Us</Link>
        {isHomePage && (
          <>
            <span className="text-muted-foreground">|</span>
            <Link href="/terms-of-service" className="hover:text-primary hover:underline">Terms & Conditions</Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/refund-policy" className="hover:text-primary hover:underline">Refund Policy</Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/privacy-policy" className="hover:text-primary hover:underline">Privacy Policy</Link>
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
