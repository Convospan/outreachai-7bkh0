'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* Hero Section */}
      <section className="relative py-16 text-center bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="relative z-10">
          <h1 className="mb-4 text-4xl font-bold">
            Hey, Let’s Grow Together with ConvoSpan!
          </h1>
          <p className="mb-6 text-lg">
            I’m here to turn your digital chats into real-world wins with AI magic. Sign up for
            free and let’s get started!
          </p>
          <a
            href="/pricing"
            className="inline-block rounded-full bg-accent px-6 py-3 shadow-md transition duration-300 hover:bg-opacity-90 text-primary-foreground"
          >
            Start for Free Today!
          </a>
          <p className="mt-2 text-sm">No credit card needed—try me for 7 days!</p>
        </div>
      </section>

      {/* Easy Prospecting Section */}
      <section className="py-12 px-4 mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-semibold">Let Me Handle Your Prospecting—Super Easy!</h2>
        <p className="mb-6 text-lg">
          I’ve got your back! I send personalized messages, connection requests, and even AI calls
          across LinkedIn, Twitter/X, and email with just a few clicks. No tech skills? Don’t worry—I’ll
          guide you every step!
        </p>
      </section>

      {/* Multi-Channel Magic Section */}
      <section className="py-12 px-4 mx-auto max-w-4xl text-center rounded-lg shadow-sm">
        <h2 className="mb-4 text-3xl font-semibold">Double Your Chances with My Multi-Channel Magic</h2>
        <p className="mb-6 text-lg">
          Why stick to one platform when I can help you shine everywhere? I mix LinkedIn, Twitter/X, email,
          and AI calls to reach more people. It’s like having a friendly assistant chatting with your
          prospects while you do what you love!
        </p>
      </section>

      {/* Lead Management Section */}
      <section className="py-12 px-4 mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-semibold">Keep Track of Leads with Me—Simple and Fun!</h2>
        <p className="mb-6 text-lg">
          I love organizing for you! My easy dashboard shows who’s responding, lets you tag your favorite
          leads, and keeps everything in one spot. Let’s make your outreach a success together!
        </p>
      </section>
    </div>
  );
}
