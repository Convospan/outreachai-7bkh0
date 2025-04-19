"use client";

import type { Metadata } from 'next/metadata';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PaymentForm from './PaymentForm';
import CampaignForm from './CampaignForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ConvoSpan: AI Conversations That Convert to Real-World Impact',
  description: 'Join me on ConvoSpan.ai to streamline LinkedIn, Twitter/X, and email outreach with AI-powered calls and easy management!',
};

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
          className="absolute top-0 left-0 z-0 rounded-xl"
        />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Hey, Let’s Grow Together with ConvoSpan!</h1>
          <p className="text-lg mb-6">
            I’m here to turn your digital chats into real-world wins with AI magic. Sign up for free and let’s get started!
          </p>
          <a
            href="/register"
            className="bg-[#D81B60] text-white px-6 py-3 rounded-full shadow-md hover:bg-opacity-90 transition duration-300"
          >
            Start for Free Today!
          </a>
          <p className="mt-4 text-sm">No credit card needed—try me for 7 days!</p>
        </div>
      </section>

      {/* Easy Prospecting Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/prospecting-dashboard.jpg"
            alt="Dashboard with AI script generation"
            width={600}
            height={400}
            className="mx-auto mb-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          />
          <h2 className="text-3xl font-semibold mb-4">Let Me Handle Your Prospecting—Super Easy!</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            I send personalized messages, connection requests, and even AI calls across LinkedIn, Twitter/X, and email with just a few clicks. No tech skills? Don’t worry—I’ll guide you every step!
          </p>
        </motion.div>
      </section>

      {/* Multi-Channel Magic Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto text-center bg-[#F5F5F5] rounded-xl shadow-sm">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">Double Your Chances with My Multi-Channel Magic</h2>
          <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
            I mix LinkedIn, Twitter/X, email, and AI calls, picking perfect sequences for you!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image src="/images/multi-channel-ai.jpg" alt="Multi-platform" width={300} height={200} className="rounded-lg mb-4" />
              <h3 className="text-xl font-medium">Smart Sequences</h3>
              <p className="text-gray-600">AI-crafted outreach plans tailored to your goals.</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image src="/images/lead-management.jpg" alt="Lead chart" width={300} height={200} className="rounded-lg mb-4" />
              <h3 className="text-xl font-medium">Lead Tracking</h3>
              <p className="text-gray-600">Real-time insights into your connections.</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image src="/images/payment-success.jpg" alt="Payment" width={300} height={200} className="rounded-lg mb-4" />
              <h3 className="text-xl font-medium">Flexible Plans</h3>
              <p className="text-gray-600">Choose a tier that grows with you.</p>
            </motion.div>
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-medium mb-4">How We Start, Launch, and Win Together</h3>
            <Image
              src="/images/campaign-process-infographic.jpg"
              alt="Process infographic"
              width={800}
              height={400}
              className="mx-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            />
            <p className="mt-4 text-sm">Steps: Sign Up, Plan, Build & Test, Meet AI Caller, Launch, Tweak, Celebrate!</p>
          </div>
        </motion.div>
      </section>

      {/* Lead Management Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/lead-management.jpg"
            alt="Lead flow chart with coder"
            width={600}
            height={400}
            className="mx-auto mb-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          />
          <h2 className="text-3xl font-semibold mb-4">Keep Track of Leads with Me—Simple and Fun!</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            My dashboard organizes everything for your success!
          </p>
        </motion.div>
      </section>

      {/* Payment Plan Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto text-center bg-[#F5F5F5] rounded-xl shadow-sm">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/payment-success.jpg"
            alt="Payment confirmation"
            width={600}
            height={400}
            className="mx-auto mb-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          />
          <h2 className="text-3xl font-semibold mb-6 text-center">Choose a Plan That Fits Us Perfectly</h2>
          <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
            Basic ₹999, Pro ₹2,999, Enterprise ₹9,999+—let’s grow together!
          </p>
          <PaymentForm />
          <CampaignForm />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0288D1] text-white py-6 text-center">
        <p>&copy; 2025 ConvoSpan.ai | Let’s connect! Visit <a href="/contact" className="underline text-[#FF9800]">/contact</a></p>
      </footer>
    </div>
  );
}
