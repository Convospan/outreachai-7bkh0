
'use client';

import type React from 'react';

const CommunityProgramTermsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">
          Community Program Terms
        </h1>
        <div className="space-y-6 text-lg leading-relaxed bg-card p-6 md:p-8 rounded-xl shadow-lg drop-shadow-md">
          <p>
            Welcome to the ConvoSpan AI Community Program! These terms outline your participation in our community.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">1. Eligibility</h2>
          <p>
            By signing up for ConvoSpan AI using Google or Microsoft authentication, you are automatically enrolled in our Community Program.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">2. Purpose</h2>
          <p>
            The Community Program is designed to foster a collaborative environment where users can share insights, best practices, and feedback related to outreach and sales automation.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">3. Conduct</h2>
          <p>
            We expect all community members to interact respectfully and constructively. Prohibited conduct includes, but is not limited to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>Harassment, bullying, or discrimination of any kind.</li>
            <li>Posting spam, irrelevant, or malicious content.</li>
            <li>Sharing confidential information of others without consent.</li>
            <li>Violating any applicable laws or regulations.</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">4. Content Sharing</h2>
          <p>
            Any content you share within community features (e.g., forums, discussion groups) should be relevant and add value. By sharing content, you grant ConvoSpan AI a non-exclusive, royalty-free license to use, reproduce, and distribute that content within the platform for community purposes.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">5. Moderation</h2>
          <p>
            ConvoSpan AI reserves the right to moderate all community content and to remove any content or suspend/terminate user access to community features for violations of these terms, at our sole discretion.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">6. Changes to Program Terms</h2>
          <p>
            We may update these Community Program Terms from time to time. We will notify you of any significant changes. Continued participation in the Community Program after such changes constitutes your acceptance of the new terms.
          </p>
          <p className="mt-8">
            Last updated: April 30, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityProgramTermsPage;
