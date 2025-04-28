'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <Image
          src="/logo.png"
          alt="ConvoSpan Logo"
          width={200}
          height={40}
          className="mx-auto mb-8"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">About ConvoSpan.ai</h1>

        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            In today's fast-paced digital landscape, scaling sales and marketing efforts while maintaining a genuine human connection is a significant challenge. Traditional outreach methods often fall short, becoming time-consuming, impersonal, and difficult to manage effectively. Founders, witnessing these struggles firsthand, sought a better way – a solution that leverages the power of technology without sacrificing the crucial element of human touch.
          </p>
          <p>
            This vision led to the creation of ConvoSpan.ai. We believe that technology, particularly AI and automation, should empower human connection, not replace it. Our platform is designed to streamline and enhance your outreach across key digital channels like LinkedIn, Twitter/X, and email, making lead generation and networking more efficient and impactful.
          </p>
          <p>
            ConvoSpan.ai utilizes cutting-edge AI, including sophisticated models like Gemini 2.0 and XGBoost, to generate personalized scripts, prioritize leads, assess campaign risks, and even facilitate AI-powered calling – always with user review and approval to ensure authenticity and compliance. We aim to free up your valuable time, allowing you to focus on building meaningful relationships and closing deals.
          </p>
          <p>
            ConvoSpan.ai is proud to be part of <strong className="font-semibold">Sudhisha Digital Private Limited</strong>, a technology group committed to driving digital innovation. Our sister company,{' '}
            <a
              href="https://stepupdigiworld.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              StepUp DigiWorld
            </a>
            , is a boutique digital marketing agency dedicated to helping clients unleash their potential through tailored solutions and comprehensive strategies for industry dominance. Together, we provide a holistic approach to digital growth.
          </p>
          <p>
            Our mission at ConvoSpan.ai is clear: to provide a sophisticated, compliant, and effective outreach automation platform that bridges the gap between technology and genuine human interaction, helping businesses scale their sales and marketing efforts ethically and successfully.
          </p>
        </div>
        <div className="text-center mt-8">
          <Link href="/contact" passHref>
             <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-md hover:bg-primary/90 focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-primary transition duration-300">
                Get in Touch
             </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
