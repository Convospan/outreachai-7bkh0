import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-4 text-center text-sm">
      Copyright 2025 ConvoSpan - part of Sudhisha Digital Private Limited
        <div>
            <Link href="/sitemap.xml">Sitemap</Link> | <Link href="/contact">Contact Us</Link>
        </div>
    </footer>
  );
};

export default Footer;
