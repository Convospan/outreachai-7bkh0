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
          <h2 className="text-2xl font-semibold mb-4">Connect & Explore</h2>
          <p className="text-gray-600 mb-2">Free</p>
          <ul className="list-disc list-inside mb-4">
            <li>Connect 1 LinkedIn profile</li>
            <li>Limited LinkedIn Outreach</li>
            <li>Basic Physical Outreach</li>
            <li>Standard Record Keeping</li>
          </ul>
          <Button onClick={() => alert('Connect & Explore plan selected (Not Implemented)')}>
            Select Connect & Explore
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="bg-card bg-opacity-80 rounded-lg p-4 shadow-md border border-border">
          <h2 className="text-2xl font-semibold mb-4">Engage & Grow</h2>
          <p className="text-gray-600 mb-2">₹99/month</p>
          <ul className="list-disc list-inside mb-4">
            <li>Connect 1 LinkedIn profile</li>
            <li>Enhanced LinkedIn Outreach</li>
            <li>Expanded Physical Outreach</li>
            <li>Basic message templates</li>
            <li>Extended Record Keeping</li>
          </ul>
          <Button onClick={() => alert('Engage & Grow plan selected (Not Implemented)')}>
            Select Engage & Grow
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-card bg-opacity-80 rounded-lg p-4 shadow-md border border-border">
          <h2 className="text-2xl font-semibold mb-4">Outreach Pro</h2>
          <p className="text-gray-600 mb-2">₹299/month</p>
          <ul className="list-disc list-inside mb-4">
            <li>Connect up to 3 LinkedIn profiles</li>
            <li>Advanced LinkedIn Outreach</li>
            <li>Comprehensive Physical Outreach</li>
            <li>Personalized message templates, advanced filtering</li>
            <li>Basic outreach performance metrics</li>
            <li>Full history of digital and physical outreach</li>
          </ul>
          <Button onClick={() => alert('Outreach Pro plan selected (Not Implemented)')}>
            Select Outreach Pro
          </Button>
        </div>
          {/* Enterprise Plan */}
          <div className="bg-card bg-opacity-80 rounded-lg p-4 shadow-md border border-border">
              <h2 className="text-2xl font-semibold mb-4">Scale & Impact</h2>
              <p className="text-gray-600 mb-2">₹599/month</p>
              <ul className="list-disc list-inside mb-4">
                  <li>Connect up to 5 LinkedIn profiles</li>
                  <li>Unlimited LinkedIn Outreach</li>
                  <li>Unlimited Physical Outreach</li>
                  <li>All features included</li>
                  <li>Detailed insights into all outreach activities, team performance, and conversion metrics</li>
                  <li>CRM integration (basic)</li>
              </ul>
              <Button onClick={() => alert('Scale & Impact plan selected (Not Implemented)')}>
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
