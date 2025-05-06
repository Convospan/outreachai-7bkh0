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
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="grid grid-cols-[1fr_auto] items-center px-6 py-4 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
        <div>
          <div className="flex gap-x-1.5 text-sm/6 max-sm:flex-col">
            <h1 className="font-semibold">
              <a href="/" className="hover:text-primary-orange transition-colors">CONVOSPAN AI</a>
            </h1>
            <div className="max-sm:hidden" aria-hidden="true">·</div>
            <p>AI Outreach Platform</p>
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
      <main className="flex grow flex-col px-4 pb-4 sm:mt-6 sm:px-6 sm:pb-6 space-y-12">
        <section className="relative mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center bg-accent bg-opacity-80 p-8 rounded-xl text-primary-foreground shadow-2xl drop-shadow-lg"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Struggling with Lead Generation?
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              ConvoSpan AI uses AI to automate your outreach, generate more qualified leads, and help you close deals faster.
              Stop manual prospecting, start scaling your sales.
            </p>
            <Link href="/pricing" passHref>
              <Button variant="secondary" size="lg" className="text-lg py-3 px-8">
                Create Your Free Account & Double Connections
              </Button>
            </Link>
            <p className="mt-3 text-sm">No credit card needed for your 7-day trial!</p>
          </motion.div>
        </section>

        {/* Pain Point / Solution Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 drop-shadow-md"
          >
            <PhoneCall className="h-16 w-16 text-primary mb-6 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Tired of Manual Outreach That Doesn't Scale?</h2>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-muted-foreground">
              ConvoSpan AI automates personalized messages and AI-powered calls across LinkedIn, Twitter/X, and email.
              Focus on closing deals, not on tedious prospecting tasks.
            </p>
          </motion.div>
        </section>

        {/* Multi-Channel Benefits Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto bg-background rounded-xl shadow-sm drop-shadow-md">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-6"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center">Maximize Your Reach, Multiply Your Results</h2>
            <p className="text-lg md:text-xl mb-8 text-center max-w-3xl mx-auto text-muted-foreground">
              Don't limit your potential. ConvoSpan AI leverages LinkedIn, Twitter/X, email, and AI calls with intelligent sequences to connect you with more prospects, more effectively.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <motion.div
                className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 drop-shadow-md flex flex-col items-center text-center"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Workflow className="h-10 w-10 text-primary mb-3" />
                <h3 className="text-xl font-semibold mb-2">Intelligent Automation</h3>
                <p className="text-muted-foreground">AI crafts and deploys outreach so you can focus on strategy.</p>
              </motion.div>
              <motion.div
                className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 drop-shadow-md flex flex-col items-center text-center"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <TrendingUp className="h-10 w-10 text-primary mb-3" />
                <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
                <p className="text-muted-foreground">Track performance and optimize campaigns for better ROI.</p>
              </motion.div>
              <motion.div
                className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 drop-shadow-md flex flex-col items-center text-center"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Settings className="h-10 w-10 text-primary mb-3" />
                <h3 className="text-xl font-semibold mb-2">Scalable Solutions</h3>
                <p className="text-muted-foreground">From solo entrepreneurs to sales teams, we grow with you.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How it Works Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
           <h3 className="text-3xl md:text-4xl font-semibold mb-10 text-center">Your Path to Automated Outreach Success</h3>
           <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Arrow placeholders - adjusted positioning and added more */}
              <div className="hidden lg:block absolute top-1/2 left-1/4 transform -translate-y-1/2 -translate-x-4 text-4xl text-muted-foreground opacity-50">&#8594;</div>
              <div className="hidden lg:block absolute top-1/2 right-1/4 transform -translate-y-1/2 translate-x-4 text-4xl text-muted-foreground opacity-50">&#8594;</div>

              <div className="hidden md:block lg:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[calc(100%_+_1rem)] text-4xl text-muted-foreground opacity-50">&#8595;</div> {/* Arrow between row 1 and 2 for medium screen */}
              <div className="hidden md:block lg:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[calc(100%_+_1rem)] text-4xl text-muted-foreground opacity-50">&#8595;</div> {/* Arrow between row 2 and 3 for medium screen */}


               {/* Step 1 */}
               <motion.div
                  className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}>
                   <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 shadow-md">
                     <Rocket className="h-8 w-8" />
                   </div>
                   <h4 className="text-xl font-semibold mb-2">Step 1: Sign Up & Explore with Me</h4>
                   <p className="text-muted-foreground text-sm text-center">Hey! Let’s get you started—sign up for free with ConvoSpan AI (no credit card needed for a 7-day trial!). Once you’re in, I’ll show you around my easy dashboard where you can see all the cool tools I’ve got for reaching out on LinkedIn, Twitter/X, and email.</p>
                    <Button variant="link" size="sm" className="mt-4 text-primary">Explore Features</Button>
               </motion.div>

               {/* Step 2 */}
               <motion.div
                  className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}>
                    <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 shadow-md">
                        <Target className="h-8 w-8" />
                    </div>
                   <h4 className="text-xl font-semibold mb-2">Step 2: Plan Your Outreach Together</h4>
                   <p className="text-muted-foreground text-sm text-center">I’ll help you pick your audience! Tell me who you want to connect with—add their profiles or let me suggest leads. We’ll create a simple plan with personalized messages and AI call scripts, all set up in a few clicks. It’s like planning a fun chat party!</p>
                   <Button variant="link" size="sm" className="mt-4 text-primary">Plan Your Campaign</Button>
               </motion.div>

                {/* Step 3 */}
               <motion.div
                  className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}>
                   <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 shadow-md">
                        <BrainCircuit className="h-8 w-8" />
                   </div>
                   <h4 className="text-xl font-semibold mb-2">Step 3: Build & Test with My AI Magic</h4>
                    <p className="text-muted-foreground text-sm text-center">Now, let’s make it perfect! I’ll use my AI to craft smart messages and let my virtual AI caller practice the scripts for you. You can tweak the words or approve them—I’ll even run a quick trial call to make sure my voice sounds friendly and ready to go!</p>
                    <Button variant="link" size="sm" className="mt-4 text-primary">See AI in Action</Button>
               </motion.div>

                {/* Arrow for medium screen between step 3 and 4 */}
                <div className="hidden md:block lg:hidden md:col-span-2 h-8 items-center justify-center relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl text-muted-foreground opacity-50">&#8595;</div>
                </div>


                 {/* Step 4 */}
               <motion.div
                   className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                   whileHover={{ scale: 1.03 }}
                   transition={{ duration: 0.3 }}>
                     <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 shadow-md">
                         <Bot className="h-8 w-8" />
                     </div>
                     <h4 className="text-xl font-semibold mb-2">Step 4: Meet My Virtual AI Caller</h4>
                      <p className="text-muted-foreground text-sm text-center">Say hi to my virtual AI caller! This smart assistant can make phone calls for you, chatting with your leads using the scripts we made. You just approve the call plan, and I’ll let my AI take over—talking naturally across platforms to build those connections!</p>
                      <Button variant="link" size="sm" className="mt-4 text-primary">Meet Your AI Agent</Button>
                 </motion.div>

                {/* Step 5 */}
               <motion.div
                   className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                   whileHover={{ scale: 1.03 }}
                   transition={{ duration: 0.3 }}>
                     <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 shadow-md">
                         <Rocket className="h-8 w-8" />
                     </div>
                     <h4 className="text-xl font-semibold mb-2">Step 5: Launch with a Click</h4>
                     <p className="text-muted-foreground text-sm text-center">Ready to shine? Hit the launch button with me, and I’ll start sending messages and letting my virtual AI caller make those calls across LinkedIn, Twitter/X, and email. I’ll handle the timing and follow-ups, so you can relax while I work my magic!</p>
                      <Button variant="link" size="sm" className="mt-4 text-primary">Launch Your Campaign</Button>
                 </motion.div>

                {/* Step 6 */}
                <motion.div
                   className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center drop-shadow-md"
                    whileHover={{ scale: 1.03 }}
                   transition={{ duration: 0.3 }}>
                     <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 shadow-md">
                         <LineChart className="h-8 w-8" />
                    </div>
                     <h4 className="text-xl font-semibold mb-2">Step 6: Watch & Tweak with Me</h4>
                     <p className="text-muted-foreground text-sm text-center">Let’s see how it’s going! I’ll show you a dashboard with real-time updates—who’s replying, who’s interested, and how my virtual AI caller is doing. We can adjust the plan together if needed, keeping everything on track for the best results.</p>
                      <Button variant="link" size="sm" className="mt-4 text-primary">View Dashboard</Button>
                 </motion.div>

                 {/* Arrow for medium screen between step 6 and 7 */}
                <div className="hidden md:block lg:hidden md:col-span-2 h-8 items-center justify-center relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl text-muted-foreground opacity-50">&#8595;</div>
                </div>

                 {/* Step 7 - Centered on large screens */}
                <motion.div
                   className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center md:col-span-2 lg:col-span-3 drop-shadow-md"
                    whileHover={{ scale: 1.03 }}
                   transition={{ duration: 0.3 }}>
                    <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 shadow-md">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                     <h4 className="text-xl font-semibold mb-2">Step 7: Celebrate Your Results</h4>
                     <p className="text-muted-foreground text-sm text-center">Yay, we did it! Check out the graphs and numbers I’ve put together—more connections, better leads, and real-world impact thanks to my virtual AI caller. I’ll help you review what worked and plan our next big move!</p>
                    <Button variant="link" size="sm" className="mt-4 text-primary">See Success Stories</Button>
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
            <p className="text-lg mb-6 max-w-3xl mx-auto text-muted-foreground">
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
            <p className="text-lg mb-8 max-w-3xl mx-auto text-muted-foreground">
              Basic ₹999, Pro ₹2,999, Enterprise ₹9,999+—let’s grow together!
            </p>
            <PaymentForm />
            <CampaignForm />
          </motion.div>
        </section>

        <div className="text-center py-10">
          <Link href="/pricing" passHref>
              <Button variant="default"
                      size="lg">
                Start for Free Today!
              </Button>
            </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            No credit card needed—try me for 7 days!
          </p>
        </div>
      </main>
    </div>
  );
}
