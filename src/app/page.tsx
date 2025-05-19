
"use client";

import {
  Button
} from "@/components/ui/button";
import {
  BrainCircuit,
  CheckCircle,
  CircleDollarSign,
  Download,
  LineChart,
  PhoneCall,
  Rocket,
  Settings,
  Target,
  TrendingUp,
  Workflow
} from "lucide-react";
import Link from 'next/link';
import {motion} from "framer-motion";
import PaymentForm from '@/components/PaymentForm';
import CampaignForm from '@/components/CampaignForm';
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Image from "next/image";


export default function Home() {
  const { toast } = useToast();
  const [isUpdatingFile, setIsUpdatingFile] = useState(false);

  // This function is related to the removed GitHub runtime integration.
  // It will likely fail if the 'updateFileInRepo' Firebase Function was also removed or not deployed.
  // Consider removing this button or adapting if direct GitHub file manipulation from client is still needed
  // via a backend proxy. For now, it's kept as per original structure, but its utility is diminished.
  const handleUpdateFileInGitHub = async () => {
    setIsUpdatingFile(true);
    toast({ title: "Attempting to update file (Functionality may be deprecated)...", description: "Please wait." });

    if (!app) {
      toast({ title: "Firebase Error", description: "Firebase app not initialized.", variant: "destructive" });
      setIsUpdatingFile(false);
      return;
    }

    try {
      const functions = getFunctions(app);
      const updateFileInRepoCallable = httpsCallable(functions, 'updateFileInRepo');
      const result = await updateFileInRepoCallable({
        filePath: 'test-from-convospan.txt',
        content: `Hello from ConvoSpan AI! This file was updated at ${new Date().toISOString()}`,
        commitMessage: 'Automated update from ConvoSpan AI via Firebase Function',
        branch: 'main' // Changed from master to main
      });

      const data = result.data as { success: boolean; message: string; commit?: string; url?: string };

      if (data.success) {
        toast({
          title: "File Update Successful!",
          description: `${data.message} Commit: ${data.commit}. URL: ${data.url}`,
        });
      } else {
        throw new Error(data.message || "Unknown error updating file.");
      }
    } catch (error: any) {
      console.error("Error calling updateFileInRepo function:", error);
      toast({
        title: "File Update Failed",
        description: error.message || "Could not update file.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingFile(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-primary/80 to-secondary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Decorative background pattern or image can go here */}
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Grow with <span className="text-accent">ConvoSpan AI</span>!
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-xl mx-auto md:mx-0 text-primary-foreground/90">
              I am here to skyrocket your lead generation by turning digital outreach into real-world wins with AI magic. Let ConvoSpan AI help you span conversations effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/pricing" passHref>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform duration-300">
                  Start Your 7-Day Free Trial
                </Button>
              </Link>
              <Link href="#how-it-works" passHref>
                <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/80">No credit card needed for trial!</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex justify-center items-center"
          >
            {/* Placeholder for a sleek AI robot/abstract graphic. Using a simple one for now. */}
            <div className="w-72 h-72 bg-primary-foreground/20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md">
              <Rocket className="w-36 h-36 text-accent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhance with Chrome Extension Section */}
      <section className="py-12 md:py-20 bg-card text-card-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Download className="h-16 w-16 text-primary mb-6 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Outreach with Our Chrome Extension!</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              To get the most out of ConvoSpan AI and seamlessly integrate with LinkedIn, download our Chrome extension. It's your key to effortless profile data fetching and streamlined actions.
            </p>
            {/* Placeholder for actual download link */}
            <Button size="lg" variant="default" className="shadow-md transform hover:scale-105 transition-transform duration-300" onClick={() => alert("Chrome extension download link coming soon!")}>
              <Download className="mr-2 h-5 w-5" /> Download Extension (Coming Soon)
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">Works with your favorite browser to make ConvoSpan AI even better!</p>
          </motion.div>
        </div>
      </section>

      {/* Easy Prospecting Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 bg-card rounded-xl shadow-xl drop-shadow-lg max-w-3xl mx-auto"
          >
            <PhoneCall className="h-16 w-16 text-primary mb-6 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let ConvoSpan AI Handle Your Prospecting—It's Super Easy!</h2>
            <p className="text-lg mb-6 text-muted-foreground">
              ConvoSpan AI helps you send personalized messages and (soon) AI calls across platforms with ease! I make spanning those initial conversations effortless, guided by smart AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Multi-Channel Magic Section */}
      <section id="how-it-works" className="py-12 md:py-20 bg-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Double Your Chances with <span className="text-primary">ConvoSpan AI</span>'s Multi-Channel Magic</h2>
            <p className="text-lg mb-12 text-center max-w-3xl mx-auto text-muted-foreground">
              Why stick to one platform? ConvoSpan AI uses AI to mix LinkedIn, Twitter/X, and email (with AI calls coming soon!), picking perfect sequences for you!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Workflow, title: "Intelligent Automation", description: "AI crafts and deploys outreach so you can focus on strategy. ConvoSpan AI helps you span the gap between manual work and smart automation." },
                { icon: TrendingUp, title: "Data-Driven Insights", description: "Track performance and optimize campaigns for better ROI with ConvoSpan AI." },
                { icon: Settings, title: "Scalable Solutions", description: "From solo entrepreneurs to sales teams, ConvoSpan AI grows with you, helping you span new markets." },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 drop-shadow-lg flex flex-col items-center text-center"
                >
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How ConvoSpan AI Works Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-center">How <span className="text-primary">ConvoSpan AI</span> Works Its Magic</h3>
          <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
            See how ConvoSpan AI makes it simple to span conversations from first contact to closed deal.
          </p>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { icon: Rocket, title: "Step 1: Sign Up & Explore", description: "Start free (7-day trial, no card!). Explore ConvoSpan AI's dashboard and tools for LinkedIn, Twitter/X, and email." , buttonText: "Explore Features"},
              { icon: Target, title: "Step 2: Plan Your Outreach", description: "Pick your audience or let ConvoSpan AI suggest leads. Create a simple plan with personalized messages and AI call scripts.", buttonText: "Plan Your Campaign" },
              { icon: BrainCircuit, title: "Step 3: Build & Test with AI", description: "ConvoSpan AI crafts smart messages. Let our (upcoming) virtual AI caller practice scripts. Tweak or approve!", buttonText: "See AI in Action" },
              { icon: PhoneCall, title: "Step 4: Meet AI Caller (Soon)", description: "Our virtual assistant will make calls using our scripts. Approve the plan, and AI connects naturally.", buttonText: "Learn About AI Calling" },
              { icon: Rocket, title: "Step 5: Launch with a Click", description: "Hit launch! ConvoSpan AI sends messages; AI caller (soon) makes calls. We handle timing and follow-ups.", buttonText: "Launch Campaign" },
              { icon: LineChart, title: "Step 6: Watch & Tweak", description: "Real-time dashboard updates: replies, interest, AI caller performance. Adjust plans as needed with ConvoSpan AI.", buttonText: "View Dashboard" },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 drop-shadow-lg flex flex-col items-center text-center relative"
              >
                {index < 5 && (index % 3 !== 2 || window.innerWidth < 1024) && index % 2 !== (window.innerWidth < 768 ? 1:0) && (
                  <div className={`hidden md:block absolute top-1/2 ${index % 3 === 2 ? '-bottom-6 md:top-auto md:-right-4 md:h-full md:w-px md:rotate-0' : '-right-4 h-px w-8 rotate-0'} transform ${index % 3 === 2 ? 'md:-translate-y-0 md:translate-x-1/2' : '-translate-y-1/2 translate-x-0'} bg-border/50`}>
                    <div className={`absolute ${index % 3 === 2 ? 'left-1/2 -top-1.5 md:top-auto md:-left-1 md:bottom-0' : '-right-1 top-1/2'} transform ${index % 3 === 2 ? '-translate-x-1/2 md:translate-y-0 md:translate-x-0' : 'translate-x-0 -translate-y-1/2'} rotate-0 text-primary`}>&rarr;</div>
                  </div>
                )}
                 {index < 6 && (index >=3 && window.innerWidth >= 1024 && index %3 !==2 ) && (
                   <div className="hidden lg:block absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-px h-8 bg-border/50">
                     <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 rotate-90 text-primary">&rarr;</div>
                   </div>
                 )}


                <div className="bg-primary text-primary-foreground rounded-full p-4 mb-5 shadow-lg">
                  <step.icon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                <p className="text-muted-foreground text-sm flex-grow">{step.description}</p>
                <Button variant="link" size="sm" className="mt-4 text-primary hover:text-accent">
                  {step.buttonText} <span className="ml-1">&rarr;</span>
                </Button>
              </motion.div>
            ))}
             <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 6 * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 drop-shadow-lg flex flex-col items-center text-center md:col-span-2 lg:col-span-3"
              >
                 <div className="bg-primary text-primary-foreground rounded-full p-4 mb-5 shadow-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Step 7: Celebrate Your Results</h4>
                <p className="text-muted-foreground text-sm flex-grow">Yay! Check graphs for more connections and leads from ConvoSpan AI. Review wins and plan the next move!</p>
                <Button variant="link" size="sm" className="mt-4 text-primary hover:text-accent">
                  See Success Stories <span className="ml-1">&rarr;</span>
                </Button>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Lead Management Section */}
      <section className="py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-xl max-w-3xl mx-auto"
          >
            <TrendingUp className="h-16 w-16 text-primary mb-6 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Keep Track of Leads with <span className="text-primary">ConvoSpan AI</span>—Simple and Fun!</h2>
            <p className="text-lg mb-6 text-muted-foreground">
              My easy dashboard organizes everything for your success! Let ConvoSpan AI help you visualize your progress.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Payment Plan Section */}
      <section className="py-12 md:py-20 bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center p-6"
          >
             <CircleDollarSign className="h-16 w-16 text-primary mb-6 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Choose a Plan That Fits Us Perfectly!</h2>
            <p className="text-lg mb-10 max-w-3xl mx-auto text-muted-foreground">
              Basic ₹999, Pro ₹2,999, Enterprise ₹9,999+ — Let ConvoSpan AI grow with you!
            </p>
            <div className="max-w-md mx-auto">
              <PaymentForm />
            </div>
            {/* <CampaignForm /> */} {/* CampaignForm might be better on a dedicated campaign creation page */}
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 text-center bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/pricing" passHref>
            <Button variant="default" size="lg" className="shadow-lg transform hover:scale-105 transition-transform duration-300">
              Start for Free Today!
            </Button>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            No credit card needed—try ConvoSpan AI for 7 days!
          </p>
        </div>
      </section>

    </div>
  );
}
