"use client";

import {
  Button
} from "@/components/ui/button";
import {
  BrainCircuit,
  CheckCircle,
  CircleDollarSign,
  LineChart,
  PhoneCall,
  Rocket,
  Settings,
  Target,
  TrendingUp,
  Workflow,
  Bot
} from "lucide-react";
import Link from 'next/link';
import {motion} from "framer-motion";
import PaymentForm from '@/components/PaymentForm';
import CampaignForm from '@/components/CampaignForm';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col"> {/* Ensure full height and flex column for footer */}
      {/* Hero Section */}
      <header className="grid grid-cols-[1fr_auto] items-center px-6 py-4 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
        <div>
          <div className="flex gap-x-1.5 text-sm/6 max-sm:flex-col">
             {/* Replace Image with Text */}
             <div className="font-bold uppercase inline-block border-2 border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors duration-300 text-lg tracking-wider">
                CONVOSPAN
              </div>
            <div className="max-sm:hidden" aria-hidden="true">·</div>
            <p className="text-foreground">AI Outreach Platform</p>
          </div>
        </div>
        <div className="justify-self-end">
          <Button variant="default" size="lg" asChild>
            <Link href="/pricing">
              Get Started
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow px-4 pb-4 sm:mt-6 sm:px-6 sm:pb-6 space-y-12"> {/* Use flex-grow and vertical spacing */}
        {/* Hero Section */}
        <section className="relative mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center bg-accent bg-opacity-80 p-8 rounded-xl text-primary-foreground shadow-2xl drop-shadow-lg"
          >
            {/* Removed Hero Icon as requested */}
            <h1 className="text-4xl sm:text-5xl font-semibold mb-6">Hey, Let’s Grow Together with ConvoSpan!</h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              I am here to skyrocket your lead generation by turning digital outreach into real world wins with AI magic.
            </p>
            <Button variant="secondary" size="lg" asChild>
               <Link href="/pricing">
                Start for Free Today!
               </Link>
            </Button>
             <p className="mt-4 text-sm">No card, 7-day trial!</p>
          </motion.div>
        </section>

        {/* Easy Prospecting Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 drop-shadow-md"
          >
            <PhoneCall className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h2 className="text-3xl font-semibold mb-4">Let Me Handle Your Prospecting—Super Easy!</h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              I send personalized messages and AI calls across platforms with ease!
            </p>
          </motion.div>
        </section>

        {/* Multi-Channel Magic Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto bg-background rounded-xl shadow-sm drop-shadow-md">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-6"
          >
            <h2 className="text-3xl font-semibold mb-6 text-center">Double Your Chances with My Multi-Channel Magic</h2>
            <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
              I mix LinkedIn, Twitter/X, email, and AI calls, picking perfect sequences for you!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 drop-shadow-md"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Workflow className="h-8 w-8 text-primary mb-2 mx-auto" />
                <h3 className="text-xl font-medium text-center">Smart Sequences</h3>
                <p className="text-muted-foreground text-center">AI-crafted outreach plans tailored to your goals.</p>
              </motion.div>
              <motion.div
                className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 drop-shadow-md"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <TrendingUp className="h-8 w-8 text-primary mb-2 mx-auto" />
                <h3 className="text-xl font-medium text-center">Lead Tracking</h3>
                <p className="text-muted-foreground text-center">Real-time insights into your connections.</p>
              </motion.div>
              <motion.div
                className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 drop-shadow-md"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Settings className="h-8 w-8 text-primary mb-2 mx-auto" />
                <h3 className="text-xl font-medium text-center">Flexible Plans</h3>
                <p className="text-muted-foreground text-center">Choose a tier that grows with you.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How it Works Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
           <h3 className="text-3xl font-semibold mb-10 text-center">How We Start, Launch, and Win Together</h3>
           <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Arrow placeholders - adjusted positioning and added more */}
              <div className="hidden md:block absolute top-1/2 left-1/4 transform -translate-y-1/2 -translate-x-4 text-4xl text-muted-foreground">&#8594;</div>
              <div className="hidden md:block absolute top-1/2 right-1/4 transform -translate-y-1/2 translate-x-4 text-4xl text-muted-foreground">&#8594;</div>
              {/* Vertical arrows between rows */}
              <div className="hidden md:block absolute top-[calc(33%+2rem)] left-1/2 transform -translate-x-1/2 rotate-90 text-4xl text-muted-foreground">&#8595;</div>
              <div className="hidden md:block absolute top-[calc(66%+4rem)] left-1/2 transform -translate-x-1/2 rotate-90 text-4xl text-muted-foreground">&#8595;</div>


               {/* Step 1 */}
               <motion.div
                  className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}>
                   <div className="bg-primary text-primary-foreground rounded-full p-3 mb-4 shadow-md">
                     <Rocket className="h-6 w-6" />
                   </div>
                   <h4 className="text-lg font-medium mb-2">Step 1: Sign Up & Explore</h4>
                   <p className="text-muted-foreground text-sm text-center">Start free (7-day trial!). Explore the dashboard and tools for LinkedIn, Twitter/X, and email.</p>
                    <Button variant="link" size="sm" className="mt-4">Learn More</Button>
               </motion.div>

               {/* Step 2 */}
               <motion.div
                  className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}>
                    <div className="bg-primary text-primary-foreground rounded-full p-3 mb-4 shadow-md">
                        <Target className="h-6 w-6" />
                    </div>
                   <h4 className="text-lg font-medium mb-2">Step 2: Plan Outreach</h4>
                   <p className="text-muted-foreground text-sm text-center">Pick your audience or let me suggest leads. Create a simple plan with personalized messages and AI call scripts.</p>
                   <Button variant="link" size="sm" className="mt-4">Learn More</Button>
               </motion.div>

                {/* Step 3 */}
               <motion.div
                  className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}>
                   <div className="bg-primary text-primary-foreground rounded-full p-3 mb-4 shadow-md">
                        <BrainCircuit className="h-6 w-6" />
                   </div>
                   <h4 className="text-lg font-medium mb-2">Step 3: Build & Test</h4>
                    <p className="text-muted-foreground text-sm text-center">AI crafts smart messages. Let my virtual AI caller practice scripts. Tweak or approve, run a trial call!</p>
                    <Button variant="link" size="sm" className="mt-4">Learn More</Button>
               </motion.div>

                 {/* Step 4 */}
               <motion.div
                   className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                   whileHover={{ scale: 1.03 }}
                   transition={{ duration: 0.3 }}>
                     <div className="bg-primary text-primary-foreground rounded-full p-3 mb-4 shadow-md">
                         <Bot className="h-6 w-6" />
                     </div>
                     <h4 className="text-lg font-medium mb-2">Step 4: Meet AI Caller</h4>
                      <p className="text-muted-foreground text-sm text-center">My virtual assistant makes calls using our scripts. Approve the plan, and I'll let the AI connect naturally.</p>
                      <Button variant="link" size="sm" className="mt-4">Learn More</Button>
                 </motion.div>

                {/* Step 5 */}
               <motion.div
                   className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                   whileHover={{ scale: 1.03 }}
                   transition={{ duration: 0.3 }}>
                     <div className="bg-primary text-primary-foreground rounded-full p-3 mb-4 shadow-md">
                         <Rocket className="h-6 w-6" />
                     </div>
                     <h4 className="text-lg font-medium mb-2">Step 5: Launch</h4>
                     <p className="text-muted-foreground text-sm text-center">Hit launch! I'll send messages and my AI caller will make calls. I handle timing and follow-ups.</p>
                      <Button variant="link" size="sm" className="mt-4">Learn More</Button>
                 </motion.div>

                {/* Step 6 */}
                <motion.div
                   className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                    whileHover={{ scale: 1.03 }}
                   transition={{ duration: 0.3 }}>
                     <div className="bg-primary text-primary-foreground rounded-full p-3 mb-4 shadow-md">
                         <LineChart className="h-6 w-6" />
                    </div>
                     <h4 className="text-lg font-medium mb-2">Step 6: Watch & Tweak</h4>
                     <p className="text-muted-foreground text-sm text-center">See real-time dashboard updates on replies, interest, and AI caller performance. Adjust the plan as needed.</p>
                      <Button variant="link" size="sm" className="mt-4">Learn More</Button>
                 </motion.div>

                 {/* Step 7 - Spanning across the bottom or centered */}
                <motion.div
                   className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center md:col-span-3 lg:col-span-1 lg:col-start-2 drop-shadow-md" // Adjusted span for better layout
                    whileHover={{ scale: 1.03 }}
                   transition={{ duration: 0.3 }}>
                    <div className="bg-primary text-primary-foreground rounded-full p-3 mb-4 shadow-md">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                     <h4 className="text-lg font-medium mb-2">Step 7: Celebrate Results</h4>
                     <p className="text-muted-foreground text-sm text-center">Yay! Check graphs for more connections and leads. Review wins and plan the next move!</p>
                    <Button variant="link" size="sm" className="mt-4">Learn More</Button>
                 </motion.div>
           </div>
        </section>

        {/* Lead Management Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
             className="p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 drop-shadow-md"
          >
             <TrendingUp className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h2 className="text-3xl font-semibold mb-4">Keep Track of Leads with Me—Simple and Fun!</h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              My dashboard organizes everything for your success!
            </p>
          </motion.div>
        </section>

        {/* Payment Plan Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto bg-secondary/10 rounded-xl shadow-sm drop-shadow-md">
           <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center p-6"
          >
             <CircleDollarSign className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h2 className="text-3xl font-semibold mb-6">Choose a Plan That Fits Us!</h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Basic ₹999, Pro ₹2,999, Enterprise ₹9,999+—let’s grow together!
            </p>
            <PaymentForm />
            <CampaignForm />
          </motion.div>
        </section>

         <div className="text-center my-12"> {/* Added CTA before footer */}
             <Button variant="default"
                     size="lg" asChild>
               <Link href="/pricing">Start for Free Today!
               </Link>
             </Button>
              <p className="mt-2 text-sm text-muted-foreground">No credit card needed—try me for 7 days!</p>
           </div>
      </main>
    </div>
  );
}
