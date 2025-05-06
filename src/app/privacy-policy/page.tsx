
'use client';

import type React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-lg leading-relaxed bg-card p-6 md:p-8 rounded-xl shadow-lg drop-shadow-md">
          <p>
            Your privacy is important to us. It is ConvoSpan AI&apos;s policy to respect your privacy regarding any information we may collect from you across our website, convospan.ai, and other sites we own and operate.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">1. Information We Collect</h2>
          <p>
            Log data: When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.
          </p>
          <p>
            Personal Information: We may ask for personal information, such as your name, email, social media profiles, payment information, or phone/mobile number.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">2. Legal Bases for Processing</h2>
          <p>
            We will process your personal information lawfully, fairly, and in a transparent manner. We collect and process information about you only where we have legal bases for doing so.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">3. Use of Information</h2>
          <p>
            We may use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>Provide, operate, and maintain our website and services.</li>
            <li>Improve, personalize, and expand our website and services.</li>
            <li>Understand and analyze how you use our website and services.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
            <li>Process your transactions.</li>
            <li>Find and prevent fraud.</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">4. Security of Your Personal Information</h2>
          <p>
            The security of your personal information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">5. Your Rights</h2>
          <p>
            You have the right to be informed about how your personal information is being used, access your personal information, correct any inaccurate personal information, request the deletion of your personal information, and object to the processing of your personal information.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          <p className="mt-8">
            Last updated: April 30, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
