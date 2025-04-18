'use client';

import type { Metadata } from 'next/metadata';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">

      {/* Hero Section */}
      <section className="relative py-16 text-center bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <Image
          src="/logo.svg"
          alt="ConvoSpan.ai Logo"
          fill
          style={{ objectFit: 'cover', opacity: 0.3 }}
          className="absolute top-0 left-0 z-0"
        />
        <div className="relative z-10">
          <h1 className="mb-4 text-4xl font-bold">
            Hey, Let’s Grow Together with ConvoSpan!
          </h1>
          <p className="mb-6 text-lg">
            I’m here to turn your digital chats into real-world wins with AI magic. Sign up for
            free and let’s get started!
          </p>
          <Button onClick={() => router.push('/pricing')}
            className="inline-block rounded-full bg-accent px-6 py-3 shadow-md transition duration-300 hover:bg-opacity-90"
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
          <div className="card w-full md:w-56 mb-4 md:mb-0 shadow-md">
            <h3 className="text-xl font-semibold">Step 1: Sign Up and Explore with Me</h3>
            <p className="text-sm">Hey! Let’s get you started—sign up for free with ConvoSpan.ai (no credit card needed for a 7-day trial!). Once you’re in, I’ll show you around my easy dashboard where you can see all the cool tools I’ve got for reaching out on LinkedIn, Twitter/X, and email.</p>
              <Link href="/pricing" passHref>
            <Button className="mt-4">Learn More</Button>
            </Link>
          </div>
            <div className="md:block hidden self-center"><Icons.arrowRight className="h-8 w-8 text-gray-500 drop-shadow-md" /></div>

          {/* Step 2 */}
          <div className="card w-full md:w-56 mb-4 md:mb-0 shadow-md">
            <h3 className="text-xl font-semibold">Step 2: Plan Your Outreach Together</h3>
            <p className="text-sm">I’ll help you pick your audience! Tell me who you want to connect with—add their profiles or let me suggest leads. We’ll create a simple plan with personalized messages and AI call scripts, all set up in a few clicks. It’s like planning a fun chat party!</p>
               <Link href="/campaign/create" passHref>
             <Button className="mt-4">Plan Now</Button>
               </Link>
          </div>
            <div className="md:block hidden self-center"><Icons.arrowRight className="h-8 w-8 text-gray-500 drop-shadow-md" /></div>

          {/* Step 3 */}
          <div className="card w-full md:w-56 shadow-md">
            <h3 className="text-xl font-semibold">Step 3: Build and Test with My AI Magic</h3>
            <p className="text-sm">Now, let’s make it perfect! I’ll use my AI to craft smart messages and let my virtual AI caller practice the scripts for you. You can tweak the words or approve them—I’ll even run a quick trial call to make sure my voice sounds friendly and ready to go!</p>
             <Link href="/call/approve" passHref>
              <Button className="mt-4">Test AI</Button>
              </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-around items-center text-center mt-8">
          {/* Step 4 */}
          <div className="card w-full md:w-56 mb-4 md:mb-0 shadow-md">
            <h3 className="text-xl font-semibold">Step 4: Meet My Virtual AI Caller</h3>
            <p className="text-sm">Say hi to my virtual AI caller! This smart assistant can make phone calls for you, chatting with your leads using the scripts we made. You just approve the call plan, and I’ll let my AI take over—talking naturally across platforms to build those connections!</p>
             <Link href="/call/approve" passHref>
               <Button className="mt-4">AI Caller</Button>
             </Link>
          </div>
            <div className="md:block hidden self-center"><Icons.arrowRight className="h-8 w-8 text-gray-500 drop-shadow-md" /></div>

          {/* Step 5 */}
          <div className="card w-full md:w-56 mb-4 md:mb-0 shadow-md">
            <h3 className="text-xl font-semibold">Step 5: Launch with a Click</h3>
            <p className="text-sm">Ready to shine? Hit the launch button with me, and I’ll start sending messages and letting my virtual AI caller make those calls across LinkedIn, Twitter/X, and email. I’ll handle the timing and follow-ups, so you can relax while I work my magic!</p>
              <Link href="/campaign" passHref>
              <Button className="mt-4" >Launch Campaign</Button>
                </Link>
          </div>
            <div className="md:block hidden self-center"><Icons.arrowRight className="h-8 w-8 text-gray-500 drop-shadow-md" /></div>

          {/* Step 6 */}
          <div className="card w-full md:w-56 shadow-md">
            <h3 className="text-xl font-semibold">Step 6: Watch and Tweak with Me</h3>
            <p className="text-sm">Let’s see how it’s going! I’ll show you a dashboard with real-time updates—who’s replying, who’s interested, and how my virtual AI caller is doing. We can adjust the plan together if needed, keeping everything on track for the best results.</p>
            <Link href="/risk-lead-visualization" passHref>
             <Button className="mt-4">Tweak AI</Button>
               </Link>
          </div>
        </div>

         <div className="flex flex-col md:flex-row justify-around items-center text-center mt-8">
          {/* Step 7 */}
           <div className="card w-full md:w-56 shadow-md">
            <h3 className="text-xl font-semibold">Step 7: Celebrate Your Results</h3>
            <p className="text-sm">Yay, we did it! Check out the graphs and numbers I’ve put together—more connections, better leads, and real-world impact thanks to my virtual AI caller. I’ll help you review what worked and plan our next big move!</p>
            <Link href="/risk-lead-visualization" passHref>
            <Button className="mt-4">Check AI Results</Button>
              </Link>
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
       <section className="py-16 text-center">
            <Button onClick={() => router.push('/pricing')}
              className="inline-block rounded-full bg-accent px-6 py-3 shadow-md transition duration-300 hover:bg-opacity-90"
            >
              Start for Free Today!
            </Button>
            <p className="mt-2 text-sm">No credit card needed—try me for 7 days!</p>
          </section>
    </div>
  );
}
