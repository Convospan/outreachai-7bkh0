import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4">
      <Image
        src="/logo.png"
        alt="ConvoSpan Logo"
        width={120}
        height={24}
        className="mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold mb-4">About ConvoSpan.ai</h1>
      <p>ConvoSpan.ai is a platform to streamline LinkedIn, Twitter/X, and email outreach for lead generation and networking.</p>
      {/* Add more content as needed */}
    </div>
  );
}
