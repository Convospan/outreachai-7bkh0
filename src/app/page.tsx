"use client";

import {useState, useEffect} from 'react';
import {Code, Link, MessageSquare, PhoneCall} from "lucide-react";
import { motion } from 'framer-motion';
import PaymentForm from '@/components/PaymentForm';
import CampaignForm from './CampaignForm';
import {Button} from "@/components/ui/button";


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
      <main className="mt-4 flex flex-col px-4 pb-4 sm:mt-6 sm:px-6 sm:pb-6">
        <section className="relative mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center bg-accent-blue bg-opacity-80 p-8 rounded-xl text-white"
          >
            <h1 className="text-4xl sm:text-5xl font-semibold mb-6">Hey, Let’s Grow Together with ConvoSpan!</h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              I am here to skyrocket your lead generation by turning digital outreach into real world wins with AI magic.
            </p>
            <Code className="w-24 h-24 mx-auto mb-4" />
            <Link href="/pricing" passHref>
              <Button variant="default"
                    size="lg">
                Start for Free Today!
              </Button>
            </Link>
          </motion.div>

        </section>

        {/* Easy Prospecting Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <MessageSquare className="w-24 h-24 mx-auto mb-4" />
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
                <Link className="w-12 h-12 mx-auto block mb-4" />
                <h3 className="text-xl font-medium">Smart Sequences</h3>
                <p className="text-gray-600">AI-crafted outreach plans tailored to your goals.</p>
              </motion.div>
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <MessageSquare className="w-12 h-12 mx-auto block mb-4" />
                <h3 className="text-xl font-medium">Lead Tracking</h3>
                <p className="text-gray-600">Real-time insights into your connections.</p>
              </motion.div>
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <PhoneCall className="w-12 h-12 mx-auto block mb-4" />
                <h3 className="text-xl font-medium">AI-Powered Calls</h3>
                <p className="text-gray-600">Connect with leads using personalized AI calls.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

{/* Add section for Steps: Sign Up, Plan, Build & Test, Meet AI Caller, Launch, Tweak, Celebrate! */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">How We Start, Launch, and Win Together</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            {/* Step 1: Sign Up and Explore */}
            <div className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 flex items-center justify-center h-10 w-10 text-gray-600">
                {/* Arrow Icon */}
              </div>
              <h3 className="text-xl font-medium mb-2">Step 1: Sign Up and Explore with Me</h3>
              <p className="text-gray-600">Hey! Let’s get you started—sign up for free with ConvoSpan.ai (no credit card needed for a 7-day trial!). Once you’re in, I’ll show you around my easy dashboard where you can see all the cool tools I’ve got for reaching out on LinkedIn, Twitter/X, and email.</p>
              {/* Add more content or button here if needed */}
            </div>

            {/* Step 2: Plan Your Outreach Together */}
            <div className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
             <div className="absolute top-0 right-0 flex items-center justify-center h-10 w-10 text-gray-600">
                {/* Arrow Icon */}
              </div>
              <h3 className="text-xl font-medium mb-2">Step 2: Plan Your Outreach Together</h3>
              <p className="text-gray-600">I’ll help you pick your audience! Tell me who you want to connect with—add their profiles or let me suggest leads. We’ll create a simple plan with personalized messages and AI call scripts, all set up in a few clicks. It’s like planning a fun chat party!</p>
              {/* Add more content or button here if needed */}
            </div>
            
             {/* Step 3: Build and Test with My AI Magic */}
            <div className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              
              <h3 className="text-xl font-medium mb-2">Step 3: Build and Test with My AI Magic</h3>
              <p className="text-gray-600">Now, let’s make it perfect! I’ll use my AI to craft smart messages and let my virtual AI caller practice the scripts for you. You can tweak the words or approve them—I’ll even run a quick trial call to make sure my voice sounds friendly and ready to go!</p>
              {/* Add more content or button here if needed */}
            </div>
          </div>
        </section>


        {/* Lead Management Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <MessageSquare className="w-24 h-24 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold mb-4">Keep Track of Leads with Me—Simple and Fun!</h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              My dashboard organizes everything for your success!
            </p>
          </motion.div>
        </section>

        {/* Payment Plan Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center bg-gray-950/5 rounded-xl shadow-sm">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <PhoneCall className="w-24 h-24 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold mb-6 text-center">Choose a Plan That Fits Us!</h2>
            <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
              Basic ₹999, Pro ₹2,999, Enterprise ₹9,999+—let’s grow together!
            </p>
            <PaymentForm />
            <CampaignForm />
          </motion.div>
        </section>

        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
           <Link href="/pricing" passHref>
              <Button variant="default"
                    size="lg">
                Start for Free Today!
              </Button>
            </Link>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 text-white py-6 text-center">
          <p className="text-lg">
            © 2025 ConvoSpan.ai |{' '}
            <Link href="/contact" className="underline text-primary-orange hover:text-opacity-80 transition duration-300">
              Contact
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
