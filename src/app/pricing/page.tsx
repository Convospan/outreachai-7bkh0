'use client';

import React from 'react';
import {Button} from "@/components/ui/button";
import Link from 'next/link';

const PricingPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <div className="bg-card bg-opacity-80 rounded-lg p-4 shadow-md border border-border">
          <h2 className="text-2xl font-semibold mb-4">Basic</h2>
          <p className="text-gray-600 mb-2">₹999/month</p>
          <ul className="list-disc list-inside mb-4">
            <li>100 Calls</li>
            <li>LinkedIn/Twitter/X Integration</li>
            <li>Campaign Scoring</li>
            <li>Email Integration</li>
            <li>Compliance Checks</li>
          </ul>
          <Button onClick={() => alert('Basic plan selected (Not Implemented)')}>
            Select Basic
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="bg-card bg-opacity-80 rounded-lg p-4 shadow-md border border-border">
          <h2 className="text-2xl font-semibold mb-4">Pro</h2>
          <p className="text-gray-600 mb-2">₹2,999/month</p>
          <ul className="list-disc list-inside mb-4">
            <li>500 Calls</li>
            <li>All Basic Features</li>
            <li>AI Calling</li>
            <li>Sentiment Analysis</li>
            <li>Forecasting</li>
          </ul>
          <Button onClick={() => alert('Pro plan selected (Not Implemented)')}>
            Select Pro
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-card bg-opacity-80 rounded-lg p-4 shadow-md border border-border">
          <h2 className="text-2xl font-semibold mb-4">Enterprise</h2>
          <p className="text-gray-600 mb-2">₹9,999+/month</p>
          <ul className="list-disc list-inside mb-4">
            <li>Unlimited Calls</li>
            <li>All Pro Features</li>
            <li>AI Marketplace</li>
            <li>Offline Mode</li>
            <li>Priority Support</li>
          </ul>
          <Button onClick={() => alert('Enterprise plan selected (Not Implemented)')}>
            Contact Us
          </Button>
        </div>
      </div>
       <div className="flex justify-start mt-4">
            <Link href="/" passHref>
                <Button variant="outline">Back to Dashboard</Button>
            </Link>
        </div>
    </div>
  );
};

export default PricingPage;
