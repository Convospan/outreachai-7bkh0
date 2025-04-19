"use client";

import type { Metadata } from 'next/metadata';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PaymentForm from '@/components/PaymentForm';
import CampaignForm from '@/components/CampaignForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ConvoSpan: AI Conversations That Convert to Real-World Impact',
  description: 'Join me on ConvoSpan.ai to streamline LinkedIn, Twitter/X, and email outreach with AI-powered calls and easy management!',
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="grid grid-cols-[1fr_auto] items-center px-6 py-4 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
        <div>
          <div className="flex gap-x-1.5 text-sm/6 max-sm:flex-col">
            <h1 className="font-semibold">
              <a href="/" className="hover:text-primary-orange transition-colors">ConvoSpan</a>
            </h1>
            <div className="max-sm:hidden" aria-hidden="true">·</div>
            <p>AI Outreach Platform</p>
          </div>
          <div className="max-sm:hidden overflow-x-auto max-sm:-mx-6 max-sm:pl-6 mt-2">
            <ul className="flex gap-1.5 text-xs/6 whitespace-nowrap">
              <li className="flex gap-1.5 text-gray-600 after:text-gray-300 not-last:after:content-['/']">Next.js</li>
              <li className="flex gap-1.5 text-gray-600 after:text-gray-300 not-last:after:content-['/']">Tailwind CSS</li>
              <li className="flex gap-1.5 text-gray-600 after:text-gray-300 not-last:after:content-['/']">React</li>
            </ul>
          </div>
        </div>
        <div className="justify-self-end">
          <a
            href="/register"
            className="inline-flex justify-center rounded-full text-sm/6 font-semibold bg-gray-950 text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 px-4 py-2"
          >
            Get Started
          </a>
        </div>
      </header>
      <main className="mt-4 flex grow px-4 pb-4 sm:mt-6 sm:px-6 sm:pb-6">
        <section className="relative mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center bg-accent-blue bg-opacity-80 p-8 rounded-xl text-white"
          >
            <h1 className="text-4xl sm:text-5xl font-semibold mb-6">Hey, Let’s Grow Together with ConvoSpan!</h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              I’ll turn your chats into wins with AI magic. Sign up free and let’s get started!
            </p>
            <a
              href="/register"
              className="bg-cta-pink text-white px-6 py-3 rounded-full shadow-md hover:bg-opacity-90 transition duration-300 inline-block"
            >
              Start for Free!
            </a>
            <p className="mt-4 text-sm">No card, 7-day trial!</p>
          </motion.div>
          <Image
            src="/images/hero-ai-coder.jpg"
            alt="AI coder at work"
            fill
            style={{ objectFit: 'cover', opacity: 0.2 }}
            className="absolute top-0 left-0 z-0 rounded-xl"
          />
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
              alt="Dashboard"
              width={600}
              height={400}
              className="mx-auto mb-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            />
            <h2 className="text-3xl font-semibold mb-4">Let Me Handle Your Prospecting—Super Easy!</h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              I send personalized messages and AI calls across platforms with ease!
            </p>
          </motion.div>
        </section>

        {/* Multi-Channel Magic Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto bg-gray-950/5 rounded-xl shadow-sm">
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
              alt="Lead flow chart"
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
        <section className="py-12 px-4 max-w-6xl mx-auto bg-gray-950/5 rounded-xl shadow-sm">
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
            <h2 className="text-3xl font-semibold mb-6 text-center">Choose a Plan That Fits Us!</h2>
            <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
              Basic ₹999, Pro ₹2,999, Enterprise ₹9,999+—let’s grow together!
            </p>
            <PaymentForm />
            <CampaignForm />
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 text-white py-6 text-center">
          <p className="text-lg">
            © 2025 ConvoSpan.ai |{' '}
            <a href="/contact" className="underline text-primary-orange hover:text-opacity-80 transition duration-300">
              Contact
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
