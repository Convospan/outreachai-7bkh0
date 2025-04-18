'use client';

import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/hero.svg"
              alt="ConvoSpan AI Robot"
              width={500}
              height={500}
              className="absolute left-0 bottom-0 transform -translate-x-1/4 translate-y-1/4 opacity-20 md:opacity-40 lg:opacity-60 xl:opacity-80"
            />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Hey, Let’s Grow Together with ConvoSpan!</h1>
          <p className="text-lg mb-6">
            I’m here to turn your digital chats into real-world wins with AI magic. Sign up for free and let’s get started!
          </p>
          <Button onClick={() => router.push('/pricing')}>
            Start for Free Today!
          </Button>
          <p className="mt-2 text-sm">No credit card needed—try me for 7 days!</p>
        </div>
      </section>

      {/* Easy Prospecting Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">Let Me Handle Your Prospecting—Super Easy!</h2>
        <p className="text-lg mb-6">
          I’ve got your back! I send personalized messages, connection requests, and even AI calls across LinkedIn, Twitter/X, and email with just a few clicks. No tech skills? Don’t worry—I’ll guide you every step!
        </p>
      </section>

      {/* Multi-Channel Magic Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center bg-white rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold mb-4">Double Your Chances with My Multi-Channel Magic</h2>
        <p className="text-lg mb-6">
          Why stick to one platform when I can help you shine everywhere? I mix LinkedIn, Twitter/X, email, and AI calls to reach more people. It’s like having a friendly assistant chatting with your prospects while you do what you love!
        </p>
      </section>

      {/* Lead Management Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">Keep Track of Leads with Me—Simple and Fun!</h2>
        <p className="text-lg mb-6">
          I love organizing for you! My easy dashboard shows who’s responding, lets you tag your favorite leads, and keeps everything in one spot. Let’s make your outreach a success together!
        </p>
      </section>
    </div>
  );
}
