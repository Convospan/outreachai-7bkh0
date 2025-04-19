"use client";

import type { Metadata } from 'next/metadata';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

import { Icons } from "@/components/icons";
import Link from "next/link";
import CampaignForm from "@/app/CampaignForm";
import PaymentForm from "@/app/pricing/PaymentForm";

const siteConfig = {
  name: "ConvoSpan.ai",
  description:
    "Streamline LinkedIn, Twitter/X, and email outreach with AI-powered calls and easy management!",
  url: "https://convospan.ai",
  ogImage: "https://ui.shadcn.com/og.jpg",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
  },
}

export default function Home() {

  return (
    <>
      <div className="bg-white">
        <div className="relative overflow-hidden bg-gray-50 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-md px-4 text-center sm:px-6 sm:text-base lg:px-8">
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Let's grow together with ConvoSpan!
            </p>
            <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
              I’m here to turn your digital chats into real-world wins with AI magic. Sign up for free and let’s get started!
            </p>
            <div className="mt-12">
              <div className="mt-3 sm:mt-0">
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
                >
                  Start Free
                </a>
                <CampaignForm />
                <PaymentForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
