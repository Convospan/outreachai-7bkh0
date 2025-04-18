'use client';

import Image from 'next/image';
import {Button} from "@/components/ui/button";
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
          <Button onClick={() => router.push('/pricing')}
            className="inline-block rounded-full bg-accent px-6 py-3 shadow-md transition duration-300 hover:bg-opacity-90 text-accent-foreground"
          >
            Start for Free Today!
          </Button>
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

      {/* Flowchart Section */}
      <section className="py-12 px-4 mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold text-center mb-8">How ConvoSpan Works</h2>
        <div className="flex flex-col md:flex-row justify-around items-center text-center">
          {/* Step 1 */}
          <div className="card w-full md:w-56 mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Step 1: Sign Up and Explore</h3>
            <p className="text-sm">Hey! Let’s get you started—sign up for free with ConvoSpan.ai! Once you’re in, I’ll show you around my easy dashboard.</p>
          </div>

          {/* Step 2 */}
          <div className="card w-full md:w-56 mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Step 2: Plan Your Outreach Together</h3>
            <p className="text-sm">I’ll help you pick your audience! Tell me who you want to connect with—add their profiles or let me suggest leads.</p>
          </div>

          {/* Step 3 */}
          <div className="card w-full md:w-56">
            <h3 className="text-xl font-semibold">Step 3: Build and Test with My AI Magic</h3>
            <p className="text-sm">Now, let’s make it perfect! I’ll use my AI to craft smart messages and test them for you.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-around items-center text-center mt-8">
          {/* Step 4 */}
          <div className="card w-full md:w-56 mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Step 4: Launch with a Click</h3>
            <p className="text-sm">Ready to shine? Hit the launch button with me, and I’ll start sending messages and making AI calls across all platforms.</p>
          </div>

          {/* Step 5 */}
          <div className="card w-full md:w-56 mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Step 5: Watch and Tweak with Me</h3>
            <p className="text-sm">Let’s see how it’s going! I’ll show you a dashboard with real-time updates—who’s replying, who’s interested.</p>
          </div>

          {/* Step 6 */}
          <div className="card w-full md:w-56">
            <h3 className="text-xl font-semibold">Step 6: Celebrate Your Results</h3>
            <p className="text-sm">Yay, we did it! Check out the graphs and numbers I’ve put together—more connections, better leads, and real-world impact.</p>
          </div>
        </div>
      </section>

      {/* Lead Management Section */}
      <section className="py-12 px-4 mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold mb-4">Keep Track of Leads with Me—Simple and Fun!</h2>
        <p className="text-lg mb-6">
          I love organizing for you! My easy dashboard shows who’s responding, lets you tag your favorite
          leads, and keeps everything in one spot. Let’s make your outreach a success together!
        </p>
      </section>
    </div>
  );
}
