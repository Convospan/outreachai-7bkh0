/* eslint-disable react/no-unescaped-entities */
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
import PaymentForm from "@/components/PaymentForm";
import CampaignForm from "@/components/CampaignForm";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <main className="flex-grow px-4 pb-4 sm:mt-6 sm:px-6 sm:pb-6 space-y-12">
        <section className="relative mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center bg-accent bg-opacity-80 p-8 md:p-12 rounded-xl text-primary-foreground shadow-2xl drop-shadow-lg"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Struggling with Lead Generation?
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              ConvoSpan.ai uses AI to automate your outreach, generate more qualified leads, and help you close deals faster.
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
              ConvoSpan.ai automates personalized messages and AI-powered calls across LinkedIn, Twitter/X, and email.
              Focus on closing deals, not on tedious prospecting tasks.
            </p>
            {/* Placeholder for a short visual demo or feature highlight */}
            {/* <div className="my-6 h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Visual/Demo Placeholder</div> */}
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
              Don't limit your potential. ConvoSpan.ai leverages LinkedIn, Twitter/X, email, and AI calls with intelligent sequences to connect you with more prospects, more effectively.
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

        {/* How it Works Section - Retained as it's already benefit-oriented */}
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
                   <h4 className="text-xl font-semibold mb-2">Step 1: Quick Sign Up</h4>
                   <p className="text-muted-foreground text-sm text-center">Start your 7-day free trial (no card needed!). Instantly access powerful tools for LinkedIn, Twitter/X, and email outreach.</p>
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
                   <h4 className="text-xl font-semibold mb-2">Step 2: Define & Target</h4>
                   <p className="text-muted-foreground text-sm text-center">Identify your ideal prospects or let our AI suggest leads. Craft your campaign strategy with personalized messages and AI call scripts in minutes.</p>
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
                   <h4 className="text-xl font-semibold mb-2">Step 3: AI-Powered Creation</h4>
                    <p className="text-muted-foreground text-sm text-center">Let our AI generate compelling outreach messages and call scripts. Review, tweak, or approve, and even test AI calls to ensure perfect delivery.</p>
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
                     <h4 className="text-xl font-semibold mb-2">Step 4: Activate AI Agent</h4>
                      <p className="text-muted-foreground text-sm text-center">Deploy our virtual AI caller. It uses your approved scripts to engage leads naturally, handling calls and initial conversations.</p>
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
                     <h4 className="text-xl font-semibold mb-2">Step 5: Launch & Automate</h4>
                     <p className="text-muted-foreground text-sm text-center">Go live with a click! ConvoSpan sends messages and initiates AI calls, managing timing and follow-ups automatically.</p>
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
                     <h4 className="text-xl font-semibold mb-2">Step 6: Monitor & Optimize</h4>
                     <p className="text-muted-foreground text-sm text-center">Track real-time campaign performance via your dashboard. See replies, engagement, and AI agent effectiveness. Easily adjust for optimal results.</p>
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
                     <h4 className="text-xl font-semibold mb-2">Step 7: Achieve & Scale</h4>
                     <p className="text-muted-foreground text-sm text-center">Celebrate increased connections and qualified leads. Review insights to refine strategies and scale your success with ConvoSpan.ai.</p>
                    <Button variant="link" size="sm" className="mt-4 text-primary">See Success Stories</Button>
                 </motion.div>
           </div>
        </section>

        {/* Social Proof / Testimonials Section Placeholder */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">Trusted by Sales & Marketing Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
                 {/* Placeholder for Testimonial 1 */}
                <div className="bg-card p-6 rounded-xl shadow-md drop-shadow-md">
                    <p className="text-muted-foreground mb-4 italic">"ConvoSpan.ai revolutionized our lead generation. We've seen a 300% increase in qualified leads!"</p>
                    <p className="font-semibold">- Sarah M., Head of Sales, TechSolutions Inc.</p>
                </div>
                 {/* Placeholder for Testimonial 2 */}
                 <div className="bg-card p-6 rounded-xl shadow-md drop-shadow-md">
                    <p className="text-muted-foreground mb-4 italic">"The AI calling agent is a game-changer. It handles initial outreach flawlessly, saving us hours."</p>
                    <p className="font-semibold">- John B., Marketing Director, Innovate Ltd.</p>
                </div>
            </div>
        </section>


        {/* Final Call to Action Section */}
        <section className="py-16 px-4 bg-accent text-primary-foreground text-center rounded-xl shadow-xl drop-shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Outreach?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are already seeing results with ConvoSpan.ai.
              Start your free trial today and experience the future of sales and marketing automation.
            </p>
            <Link href="/pricing" passHref>
              <Button variant="default" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg py-3 px-8">
                Get 7 Days of Automated Lead Generation
              </Button>
            </Link>
          </motion.div>
        </section>

      </main>
    </div>
  );
}
