
'use client';

import type React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">
          Terms of Service
        </h1>
        <div className="space-y-6 text-lg leading-relaxed bg-card p-6 md:p-8 rounded-xl shadow-lg drop-shadow-md">
          <p>
            Welcome to ConvoSpan AI! These terms and conditions outline the rules and regulations for the use of ConvoSpan AI&apos;s Website, located at convospan.ai.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use ConvoSpan AI if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">1. Definitions</h2>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: &quot;Client&quot;, &quot;You&quot; and &quot;Your&quot; refers to you, the person log on this website and compliant to the Company’s terms and conditions. &quot;The Company&quot;, &quot;Ourselves&quot;, &quot;We&quot;, &quot;Our&quot; and &quot;Us&quot;, refers to our Company. &quot;Party&quot;, &quot;Parties&quot;, or &quot;Us&quot;, refers to both the Client and ourselves.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">2. Use of the Service</h2>
          <p>
            You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any &quot;junk mail,&quot; &quot;chain letter,&quot; &quot;spam,&quot; or any other similar solicitation.</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">3. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of ConvoSpan AI and its licensors.
          </p>
           <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">4. Community Program</h2>
          <p>
            If you sign up using Google or Microsoft authentication, you will be enrolled in our Community Program. Specific terms for the Community Program will be provided and must be agreed to. These terms may include guidelines on community conduct, data sharing within the community features, and other program-specific rules.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">5. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p className="mt-8">
            Last updated: April 30, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
