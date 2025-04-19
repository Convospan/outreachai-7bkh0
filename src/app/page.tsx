"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import PaymentForm from '../components/PaymentForm';
import CampaignForm from '../app/CampaignForm';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#212121] font-inter">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0288D1] to-[#FF9800] text-white py-16 text-center relative">
        <Image
          src="/images/hero-ai-coder.jpg"
          alt="AI coder at work with social media icons"
          fill
          style={{ objectFit: 'cover', opacity: 0.2 }}
          className="absolute top-0 left-0 z-0"
        />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Hey, Let’s Grow Together with ConvoSpan!</h1>
          <p className="text-lg mb-6">
            I’m here to turn your digital chats into real-world wins with AI magic. Sign up for free and let’s get started!
          </p>
          <a
            href="/register"
            className="bg-[#D81B60] text-white px-6 py-3 rounded-full shadow-md hover:bg-opacity-90 transition duration-300 inline-block"
          >
            Start for Free Today!
          </a>
          <p className="mt-2 text-sm">No credit card needed—try me for 7 days!</p>
        </div>
      </section>

      {/* Easy Prospecting Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center">
        <Image
          src="/images/prospecting-dashboard.jpg"
          alt="Dashboard with AI script generation"
          width={600}
          height={400}
          className="mx-auto mb-6 rounded-lg shadow-md"
        />
        <h2 className="text-3xl font-semibold mb-4">Let Me Handle Your Prospecting—Super Easy!</h2>
        <p className="text-lg mb-6">
          I’ve got your back! I send personalized messages, connection requests, and even AI calls across LinkedIn, Twitter/X, and email with just a few clicks. No tech skills? Don’t worry—I’ll guide you every step!
        </p>
      </section>

      {/* Multi-Channel Magic Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center bg-[#F5F5F5] rounded-lg shadow-sm">
        <Image
          src="/images/multi-channel-ai.jpg"
          alt="Multi-platform AI outreach visual"
          width={600}
          height={400}
          className="mx-auto mb-6 rounded-lg shadow-md"
        />
        <h2 className="text-3xl font-semibold mb-4">Double Your Chances with My Multi-Channel Magic</h2>
        <p className="text-lg mb-6">
          Why stick to one platform when I can help you shine everywhere? I mix LinkedIn, Twitter/X, email, and AI calls to reach more people. It’s like having a friendly assistant chatting with your prospects while you do what you love!
        </p>
      </section>

      {/* Lead Management Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center">
        <Image
          src="/images/lead-management.jpg"
          alt="Lead flow chart with coder"
          width={600}
          height={400}
          className="mx-auto mb-6 rounded-lg shadow-md"
        />
        <h2 className="text-3xl font-semibold mb-4">Keep Track of Leads with Me—Simple and Fun!</h2>
        <p className="text-lg mb-6">
          I love organizing for you! My easy dashboard shows who’s responding, lets you tag your favorite leads, and keeps everything in one spot. Let’s make your outreach a success together!
        </p>
      </section>

      {/* Payment Plan Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center bg-[#F5F5F5] rounded-lg shadow-sm">
         <Image
          src="/images/payment-success.jpg"
          alt="Payment confirmation with coder"
          width={600}
          height={400}
          className="mx-auto mb-6 rounded-lg shadow-md"
        />
        <h2 className="text-3xl font-semibold mb-4">Choose a Plan That Fits Us Perfectly</h2>
        <p className="text-lg mb-6">
          I want to grow with you! Pick a plan that feels right—start with Basic for ₹999/month (100 calls), go Pro for ₹2,999/month (500 calls with AI magic), or go big with Enterprise for ₹9,999+/month (unlimited fun!). Sign up, and I’ll handle payments with a quick setup.
        </p>
        <PaymentForm />
         <CampaignForm />
      </section>

      {/* Footer */}
      <footer className="bg-[#0288D1] text-white py-6 text-center">
        <p>© 2025 ConvoSpan.ai | Let’s connect! Visit <a href="/contact" className="underline text-[#FF9800]">/contact</a></p>
      </footer>
    </div>
  );
}
