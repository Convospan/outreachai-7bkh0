'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        {/* Replace Image with Text */}
        <div className="font-bold uppercase inline-block border px-2 py-1 rounded mx-auto mb-8 text-center block w-fit">
          CONVOSPAN AI
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">About ConvoSpan AI</h1>

        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">The Challenge: Scaling Sales with a Human Touch</h2>
            <p>
              In today's fast-paced digital landscape, scaling sales and marketing efforts while maintaining a genuine human connection is a significant challenge. Traditional outreach methods often fall short, becoming time-consuming, impersonal, and difficult to manage effectively. Founders, witnessing these struggles firsthand, sought a better way – a solution that leverages the power of technology without sacrificing the crucial element of human touch.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">Our Vision: Empowering Connection Through Technology</h2>
            <p>
              This vision led to the creation of ConvoSpan AI. We believe that technology, particularly AI and automation, should empower human connection, not replace it. Our platform is designed to streamline and enhance your outreach across key digital channels like LinkedIn, Twitter/X, and email, making lead generation and networking more efficient and impactful.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">Our Solution: Intelligent Outreach Automation</h2>
            <p>
              ConvoSpan AI utilizes cutting-edge AI, including sophisticated models like Gemini 2.0 and XGBoost, to generate personalized scripts, prioritize leads, assess campaign risks, and even facilitate AI-powered calling – always with user review and approval to ensure authenticity and compliance. We aim to free up your valuable time, allowing you to focus on building meaningful relationships and closing deals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">Our Family: Part of a Digital Innovation Group</h2>
            <p>
              ConvoSpan AI is proud to be part of <strong className="font-semibold">Sudhisha Digital Private Limited</strong>, a technology group committed to driving digital innovation. Our sister company,{' '}
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">Our Mission: Bridging Technology and Human Interaction</h2>
            <p>
              Our mission at ConvoSpan AI is clear: to provide a sophisticated, compliant, and effective outreach automation platform that bridges the gap between technology and genuine human interaction, helping businesses scale their sales and marketing efforts ethically and successfully.
            </p>
          </section>
        </div>

        <div className="text-center mt-12">
          <Link href="/contact" passHref>
             <Button size="lg">
                Get in Touch
             </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
