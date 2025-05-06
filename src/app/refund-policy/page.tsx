'use client';

import type React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <div className="font-bold uppercase inline-block border px-2 py-1 rounded mx-auto mb-8 text-center block w-fit text-primary">
          CONVOSPAN AI
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">
          Refund Policy
        </h1>
        <div className="space-y-6 text-lg leading-relaxed bg-card p-6 md:p-8 rounded-xl shadow-lg drop-shadow-md">
          <p>
            At ConvoSpan AI, part of Sudhisha Digital Private Limited, we strive to ensure our customers are satisfied with our services. This Refund Policy outlines the circumstances under which ConvoSpan AI may provide a refund.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">1. Subscription Services</h2>
          <p>
            Our services are offered on a subscription basis. When you subscribe to a plan, you are billed in advance on a recurring and periodic basis (e.g., monthly or annually).
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              <strong>Monthly Subscriptions:</strong> Refunds for monthly subscriptions are generally not provided. You can cancel your monthly subscription at any time, and your subscription will remain active until the end of the current billing cycle. You will not be charged for subsequent months.
            </li>
            <li>
              <strong>Annual Subscriptions:</strong> If you have subscribed to an annual plan, you may be eligible for a pro-rata refund for the unused portion of your subscription if you cancel within the first 30 days of your annual subscription period. After 30 days, annual subscriptions are non-refundable.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">2. Free Trial</h2>
          <p>
            ConvoSpan AI offers a 7-day free trial for new users. During the free trial, you can access the features of your selected plan without charge. If you do not cancel before the end of the free trial period, your paid subscription will begin, and you will be billed according to your chosen plan. No refunds are offered for charges incurred after the free trial period ends if the subscription was not canceled.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">3. How to Request a Refund</h2>
          <p>
            To request a refund, please contact our support team via the <Link href="/contact" className="text-primary hover:underline font-semibold">Contact Us</Link> page. Please include your account details, the reason for your refund request, and any relevant documentation.
          </p>
          <p>
            Refund requests will be reviewed on a case-by-case basis. We reserve the right to grant or deny a refund request at our sole discretion.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">4. Service Downtime or Issues</h2>
          <p>
            In the event of significant service downtime or critical bugs that materially affect your ability to use ConvoSpan AI, we may, at our discretion, offer a partial or full refund, or a service credit for a future billing period. Such cases will be evaluated individually.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary">5. Changes to Refund Policy</h2>
          <p>
            ConvoSpan AI reserves the right to modify this Refund Policy at any time. We will notify you of any significant changes by posting the new policy on our website or by other means of communication. Your continued use of our services after such changes constitutes your acceptance of the new Refund Policy.
          </p>

          <p className="mt-8">
            If you have any questions about our Refund Policy, please contact us.
          </p>
          <p>
            Last updated: April 30, 2025
          </p>
        </div>
         <div className="text-center mt-12">
          <Link href="/" passHref>
             <Button size="lg">
                Back to Home
             </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
