import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-4 text-center text-sm">
      {/* Replace Image with Text */}
      <div className="font-bold uppercase inline-block border px-2 py-1 rounded mb-2">
        CONVOSPAN
      </div>
      <div>
        Copyright 2025 ConvoSpan - part of Sudhisha Digital Private Limited
      </div>
        <div>
            <Link href="/sitemap.xml">Sitemap</Link> | <Link href="/contact">Contact Us</Link>
        </div>
    </footer>
  );
};

export default Footer;
