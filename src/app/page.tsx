// src/app/page.tsx
"use client";

import {
  Button
} from "@/components/ui/button";
import {
  BrainCircuit,
  CheckCircle,
  CircleDollarSign,
  Download,
  HardDriveDownload,
  LineChart,
  Linkedin,
  MessageSquarePlus,
  MousePointerSquareDashed, // Updated icon
  Rocket,
  SearchCheck,
  Settings,
  Target,
  TrendingUp,
  Workflow
} from "lucide-react"; // Removed PhoneCall as it's not used in the steps
import Link from 'next/link';
import {motion} from "framer-motion";
import PaymentForm from '@/components/PaymentForm';
import CampaignForm from '@/components/CampaignForm';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { app } from "@/lib/firebase"; // Ensure app is imported
import { getFunctions, httpsCallable } from "firebase/functions";


export default function Home() {
  const { toast } = useToast();
  const [isUpdatingFile, setIsUpdatingFile] = useState(false);

  const handleUpdateFileInGitHub = async () => {
    setIsUpdatingFile(true);
    toast({ title: "File update simulation started...", description: "This is a placeholder action." });

    if (!app) { // Check if app is initialized
      toast({ title: "Firebase Error", description: "Firebase app is not initialized.", variant: "destructive" });
      setIsUpdatingFile(false);
      return;
    }

    const functions = getFunctions(app);
    const updateFileInRepoCallable = httpsCallable(functions, 'updateFileInRepo');

    try {
      const result = await updateFileInRepoCallable({
        filePath: 'src/app/test-from-client.txt', // Example path
        content: `Hello from ConvoSpan AI Client at ${new Date().toISOString()}`,
        commitMessage: 'Automated update from ConvoSpan AI client'
      });
      console.log("Cloud Function result:", result);
      toast({ title: "File Update Successful (Simulated)", description: (result.data as any)?.message || "Cloud function executed." });
    } catch (error: any) {
      console.error("Error calling updateFileInRepo:", error);
      toast({ title: "File Update Failed", description: error.message || "Could not execute cloud function.", variant: "destructive" });
    } finally {
      setIsUpdatingFile(false);
    }
  };

  const steps = [
    {
      icon: Rocket,
      title: "Step 1: Sign Up & Grab My Extension!",
      description: "Hey! Let’s get you started—sign up for free with ConvoSpan AI (7-day trial, no card needed!). First things first, you'll want to grab my super helpful Chrome Extension. It's key to our LinkedIn magic!",
      buttonText: "Get Started Free",
      buttonLink: "/pricing"
    },
    {
      icon: HardDriveDownload,
      title: "Step 2: Install My Chrome Sidekick",
      description: "Got the extension? Awesome! Install it in your browser. This little helper is how I'll get the scoop from LinkedIn profiles and help you manage your outreach right where the action is.",
      buttonText: "Extension Info",
      buttonLink: "/campaign/create/linkedin-auth"
    },
    {
      icon: Linkedin,
      title: "Step 3: Browse LinkedIn & Tag Prospects (via Extension)",
      description: "Now for the fun part! As you browse LinkedIn, use my extension to easily pull prospect details into ConvoSpan AI. Think of me as your digital assistant, noting down who you want to connect with.",
      buttonText: "See Prospecting in Action",
      buttonLink: "/linkedin-search"
    },
    {
      icon: MessageSquarePlus,
      title: "Step 4: Let's Craft Some AI Magic Messages!",
      description: "Once we have your prospect's info (thanks to my extension!), I'll use my AI brain to whip up personalized messages for LinkedIn. You review, tweak, and approve!",
      buttonText: "AI Scripting Power",
      buttonLink: "/campaign"
    },
    {
      icon: MousePointerSquareDashed, // Changed from MousePointerClick
      title: "Step 5: Automate Outreach with My Extension",
      description: "Ready to connect? My Chrome Extension, guided by your approved scripts and sequences in ConvoSpan AI, helps automate sending those messages on LinkedIn. Less clicking for you, more connecting!",
      buttonText: "Smooth Automation",
      buttonLink: "/campaign"
    },
    {
      icon: LineChart,
      title: "Step 6: Watch Your Network Grow & Tweak",
      description: "Let’s see how it’s going! My dashboard shows real-time updates—who’s replying, who’s interested. We can adjust our ConvoSpan AI strategy together, keeping everything on track for the best results.",
      buttonText: "View Dashboard Insights",
      buttonLink: "/risk-lead-visualization"
    },
    {
      icon: CheckCircle,
      title: "Step 7: Celebrate Your Wins!",
      description: "Yay, we did it! Check out the graphs: more connections, warmer leads, and real impact. ConvoSpan AI helps you see what worked, so we can plan our next brilliant move together!",
      buttonText: "Success Stories",
      buttonLink: "#" // Placeholder
    }
  ];


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
            className="relative z-10 text-center bg-accent bg-opacity-90 p-8 rounded-xl text-accent-foreground shadow-2xl drop-shadow-2xl"
          >
            <h1 className="text-4xl sm:text-5xl font-semibold mb-6">Hey, Let’s Grow Together with <span className="font-bold">ConvoSpan AI</span>!</h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
             I am here to skyrocket your lead generation by turning digital outreach into real world wins with AI magic. Let <span className="font-semibold">ConvoSpan AI</span> help you span conversations effortlessly.
            </p>
            <Link href="/pricing" passHref>
              <Button variant="secondary" size="lg" className="shadow-lg transform hover:scale-105 transition-transform duration-300">
                Start Your 7-Day Free Trial
              </Button>
            </Link>
             <p className="mt-4 text-sm ">No credit card needed for trial!</p>
          </motion.div>
        </section>

        {/* Enhance with Chrome Extension Section */}
        <section className="py-12 md:py-16 bg-card text-card-foreground drop-shadow-lg rounded-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <HardDriveDownload className="h-16 w-16 text-primary mb-6 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Outreach with Our Chrome Extension!</h2>
              <p className="text-lg mb-8 text-muted-foreground">
                To get the most out of <span className="font-semibold text-primary">ConvoSpan AI</span> and seamlessly integrate with LinkedIn, download our Chrome extension. It&apos;s your key to effortless profile data fetching and streamlined actions.
              </p>
              <Button size="lg" variant="default" className="shadow-md transform hover:scale-105 transition-transform duration-300" onClick={() => toast({title: "Coming Soon!", description: "The ConvoSpan AI Chrome Extension will be available for download shortly."})}>
                <Download className="mr-2 h-5 w-5" /> Download Extension (Coming Soon)
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">Works with your favorite browser to make <span className="font-semibold text-primary">ConvoSpan AI</span> even better!</p>
            </motion.div>
          </div>
        </section>

        {/* How ConvoSpan AI Works Section */}
        <section id="how-it-works" className="py-12 md:py-16 bg-secondary/5 rounded-xl drop-shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-center">How <span className="text-primary">ConvoSpan AI</span> Works Its Magic</h3>
            <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
              See how <span className="font-semibold text-primary">ConvoSpan AI</span> simplifies spanning conversations from first contact to closed deal, with our Chrome Extension leading the charge for LinkedIn!
            </p>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 drop-shadow-xl flex flex-col items-center text-center relative"
                >
                  {/* Arrow Logic for Desktop */}
                  {index < steps.length - 1 && index % 3 !== 2 && ( 
                     <div className="hidden lg:block absolute top-1/2 left-full ml-4 transform -translate-y-1/2 text-primary/30">
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 15H38M38 15L28 5M38 15L28 25" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                  )}
                   {index === 2 && ( 
                    <div className="hidden lg:block absolute top-full left-1/2 mt-4 transform -translate-x-1/2 -rotate-90 scale-y-[-1] text-primary/30">
                       <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform">
                           <path d="M15 0V38M15 38L5 28M15 38L25 28" stroke="currentColor" strokeWidth="2"/>
                       </svg>
                    </div>
                  )}
                   {index === 3 && ( 
                     <div className="hidden lg:block absolute top-1/2 right-full mr-4 transform -translate-y-1/2 rotate-180 scale-x-[-1] text-primary/30">
                         <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M0 15H38M38 15L28 5M38 15L28 25" stroke="currentColor" strokeWidth="2" />
                         </svg>
                     </div>
                   )}
                   {/* Vertical arrow for mobile/tablet */}
                    {index < steps.length -1 && (
                         <div className="block lg:hidden absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-primary/30">
                             <svg width="20" height="30" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M10 0V28M10 28L2 18M10 28L18 18" stroke="currentColor" strokeWidth="2"/>
                             </svg>
                         </div>
                     )}
                  <div className="bg-primary text-primary-foreground rounded-full p-4 mb-5 shadow-lg">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                  <p className="text-muted-foreground text-sm flex-grow">{step.description}</p>
                  <Link href={step.buttonLink} passHref>
                    <Button variant="link" size="sm" className="mt-4 text-primary hover:text-accent">
                      {step.buttonText} <span className="ml-1">&rarr;</span>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Management Section */}
        <section className="py-12 md:py-16 bg-background rounded-xl drop-shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 bg-card rounded-xl shadow-xl drop-shadow-xl max-w-3xl mx-auto"
            >
              <TrendingUp className="h-16 w-16 text-primary mb-6 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Keep Track of Leads with <span className="text-primary">ConvoSpan AI</span>—Simple and Fun!</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                My easy dashboard organizes everything for your success with <span className="font-semibold text-primary">ConvoSpan AI</span>!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Payment Plan Section */}
        <section className="py-12 md:py-16 bg-secondary/10 rounded-xl drop-shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <CircleDollarSign className="h-16 w-16 text-primary mb-6 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Choose a Plan That Fits Us Perfectly!</h2>
              <p className="text-lg mb-10 max-w-3xl mx-auto text-muted-foreground">
                Basic ₹999, Pro ₹2,999, Enterprise ₹9,999+ — Let <span className="font-semibold text-primary">ConvoSpan AI</span> grow with you!
              </p>
              <div className="max-w-md mx-auto">
                <PaymentForm />
              </div>
              <div className="max-w-md mx-auto mt-6">
                 <CampaignForm />
              </div>
            </motion.div>
          </div>
        </section>
        <section className="py-12 md:py-16 text-center bg-background rounded-xl drop-shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/pricing" passHref>
              <Button variant="default" size="lg" className="shadow-lg transform hover:scale-105 transition-transform duration-300">
                Start for Free Today!
              </Button>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              No credit card needed—try <span className="font-semibold text-primary">ConvoSpan AI</span> for 7 days!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
