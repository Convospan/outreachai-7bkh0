
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
  MousePointerClick, // Changed from MousePointerSquare
  PhoneCall,
  Rocket,
  SearchCheck,
  Settings,
  Target,
  TrendingUp,
  Workflow
} from "lucide-react";
import Link from 'next/link';
import {motion} from "framer-motion";
import PaymentForm from '@/components/PaymentForm';
import CampaignForm from '@/components/CampaignForm';
import { useToast } from "@/hooks/use-toast"; // Assuming this exists for other potential uses
import { useState } from "react"; // Assuming this exists for other potential uses
import { app } from "@/lib/firebase"; // Ensure app is imported for Firebase functions
import { getFunctions, httpsCallable } from "firebase/functions";


export default function Home() {
  const { toast } = useToast();
  const [isUpdatingFile, setIsUpdatingFile] = useState(false);

  const handleUpdateFileInGitHub = async () => {
    // This function is a placeholder as direct GitHub file updates from client-side
    // are not secure or typical. This would usually be a backend operation.
    setIsUpdatingFile(true);
    toast({ title: "File update simulation started...", description: "This is a placeholder action." });
    console.log("Simulating file update in GitHub...");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate async operation
    toast({ title: "File Update Simulated", description: "No actual file was changed." });
    setIsUpdatingFile(false);
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
      title: "Step 3: Browse LinkedIn & Tag Prospects",
      description: "Now for the fun part! As you browse LinkedIn, use my extension to easily pull prospect details into ConvoSpan AI. Think of me as your digital assistant, noting down who you want to connect with.",
      buttonText: "See it Action",
      buttonLink: "/linkedin-search"
    },
    {
      icon: MessageSquarePlus,
      title: "Step 4: Let's Craft Some AI Magic Messages!",
      description: "Once we have your prospect's info, I'll use my AI brain to whip up personalized messages. We can make them perfect for LinkedIn, emails, or even (soon!) AI call scripts. You review, tweak, and approve!",
      buttonText: "AI Scripting Power",
      buttonLink: "/campaign"
    },
    {
      icon: MousePointerClick, // Changed from MousePointerSquare
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
      buttonLink: "#" // Placeholder for a success stories page or section
    }
  ];


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-primary/80 to-secondary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10" data-ai-hint="abstract network">
             {/* Placeholder for a subtle background image or pattern */}
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
              I am here to skyrocket your lead generation by turning digital outreach into real world wins with AI magic. Let ConvoSpan AI help you span conversations effortlessly.
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
              <HardDriveDownload className="h-16 w-16 text-primary mb-6 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Outreach with Our Chrome Extension!</h2>
              <p className="text-lg mb-8 text-muted-foreground">
                To get the most out of ConvoSpan AI and seamlessly integrate with LinkedIn, download our Chrome extension. It's your key to effortless profile data fetching and streamlined actions.
              </p>
              <Button size="lg" variant="default" className="shadow-md transform hover:scale-105 transition-transform duration-300" onClick={() => toast({title: "Coming Soon!", description: "The ConvoSpan AI Chrome Extension will be available for download shortly."})}>
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
              <SearchCheck className="h-16 w-16 text-primary mb-6 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Let ConvoSpan AI Handle Your Prospecting—It's Super Easy!</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                ConvoSpan AI helps you send personalized messages across platforms with ease! I make spanning those initial conversations effortless, guided by smart AI.
              </p>
            </motion.div>
          </div>
        </section>

      {/* How ConvoSpan AI Works Section */}
      <section id="how-it-works" className="py-12 md:py-20 bg-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-center">How <span className="text-primary">ConvoSpan AI</span> Works Its Magic</h3>
            <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
              See how ConvoSpan AI makes it simple to span conversations from first contact to closed deal, with our Chrome Extension leading the charge for LinkedIn!
            </p>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 drop-shadow-lg flex flex-col items-center text-center relative"
                >
                  {/* Arrow Logic for Desktop */}
                  {index < steps.length - 1 && (
                     <div className={`hidden lg:block absolute text-primary/30
                        ${index % 3 === 2 ? 'top-1/2 left-full ml-4 transform -translate-y-1/2 rotate-90' : // Arrow pointing down from right-most item in a row
                                          index === 3 ? 'top-1/2 right-full mr-4 transform -translate-y-1/2 rotate-180 scale-x-[-1]' : // Arrow pointing left from first item in second row (flipped)
                                                      'top-1/2 left-full ml-4 transform -translate-y-1/2' // Default arrow pointing right
                        }
                        ${(index === 2 || index === 5) ? '!top-full !left-1/2 !-ml-0 !-translate-x-1/2 mt-4 !rotate-90' : ''} `}>
                        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className={`${(index === 2 || index === 5) ? 'transform' : ''}`}>
                          <path d="M0 15H38M38 15L28 5M38 15L28 25" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                  )}
                   {/* Arrow for mobile/tablet connecting vertically */}
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
      <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 bg-card rounded-xl shadow-xl drop-shadow-lg max-w-3xl mx-auto"
            >
              <TrendingUp className="h-16 w-16 text-primary mb-6 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Keep Track of Leads with <span className="text-primary">ConvoSpan AI</span>—Simple and Fun!</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                My easy dashboard organizes everything for your success with ConvoSpan AI!
              </p>
            </motion.div>
          </div>
        </section>

      {/* Payment Plan Section */}
      <section className="py-12 md:py-20 bg-secondary/10">
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
                Basic ₹999, Pro ₹2,999, Enterprise ₹9,999+ — Let ConvoSpan AI grow with you!
              </p>
              <div className="max-w-md mx-auto">
                <PaymentForm />
              </div>
              {/* <CampaignForm /> */}
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

    