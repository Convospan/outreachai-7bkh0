'use client';

import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#2D3436] font-inter">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4A5D6D] to-[#6EBF8B] text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Hey, Let’s Grow Together with ConvoSpan!</h1>
        <p className="text-lg mb-6">
          I’m here to turn your digital chats into real-world wins with AI magic. Sign up for free and let’s get started!
        </p>
        <Button onClick={() => router.push('/pricing')}>
          Start for Free Today!
        </Button>
        <p className="mt-2 text-sm">No credit card needed—try me for 7 days!</p>
      </section>

      {/* Easy Prospecting Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">Let Me Handle Your Prospecting—Super Easy!</h2>
        <p className="text-lg mb-6">
          I’ve got your back! I send personalized messages, connection requests, and even AI calls across LinkedIn, Twitter/X, and email with just a few clicks. No tech skills? Don’t worry—I’ll guide you every step!
        </p>
      </section>

      {/* Multi-Channel Magic Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center bg-[#F5F7FA] rounded-lg shadow-sm">
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

      {/* Footer */}
      <footer className="bg-[#4A5D6D] text-white py-6 text-center">
        <p>&copy; 2025 ConvoSpan.ai | Let’s connect! Visit <a href="/contact" className="underline">/contact</a></p>
      </footer>
    </div>
  );
}
