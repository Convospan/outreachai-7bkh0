"use client";

import {Button} from "@/components/ui/button";
import {PhoneCall, Link as LinkIcon} from "lucide-react";
import {siteConfig} from "@/config/site";
import PaymentForm from '@/components/PaymentForm';
import CampaignForm from '@/app/CampaignForm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import type { Metadata } from 'next/metadata';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function Home() {
  return (
    
      {/* Hero Section */}
      
        
          
            
              ConvoSpan
            
            ·
            AI Outreach Platform
          
          
            
              Next.js
             Tailwind CSS
              React
            
          
        
        
          
            Get Started
          
        
      
      <main className="mt-4 flex flex-col px-4 pb-4 sm:mt-6 sm:px-6 sm:pb-6">
        <section className="relative mx-auto w-full max-w-7xl rounded-xl shadow-md">
          
            
              Hey, Let’s Grow Together with ConvoSpan!
            
            
              I’m here to skyrocket your lead generation by turning digital outreach into real-world wins with AI magic.
            
            
                Start for Free Today!
                No credit card needed—try me for 7 days!
              
            
          
          
        
        </section>

        {/* Easy Prospecting Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
          
            
              Let Me Handle Your Prospecting—Super Easy!
            
            
              I send personalized messages and AI calls across platforms with ease!
            
          
        </section>

        {/* Multi-Channel Magic Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto bg-white/80 rounded-xl shadow-sm">
          
            
              Double Your Chances with My Multi-Channel Magic
            
            
              I mix LinkedIn, Twitter/X, email, and AI calls, picking perfect sequences for you!
            
            
              
                
                  
                    Smart Sequences
                  
                  AI-crafted outreach plans tailored to your goals.
                
                
                  
                    Lead Tracking
                  
                  Real-time insights into your connections.
                
                
                  
                    Flexible Plans
                  
                  Choose a tier that grows with you.
                
              
            
            
              How We Start, Launch, and Win Together
              
                Steps: Sign Up, Plan, Build & Test, Meet AI Caller, Launch, Tweak, Celebrate!
              
            
          
        </section>

        {/* Lead Management Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto text-center">
          
            
              Keep Track of Leads with Me—Simple and Fun!
            
            
              My dashboard organizes everything for your success!
            
          
        </section>

        {/* Payment Plan Section */}
        <section className="py-12 px-4 max-w-6xl mx-auto  rounded-xl shadow-sm">
          
            
              Choose a Plan That Fits Us!
            
            
              Basic ₹999, Pro ₹2,999, Enterprise ₹9,999+—let’s grow together!
            
            
            
            
          
        
         
           Start for Free Today!
           No credit card needed—try me for 7 days!
         
        

        {/* Footer */}
        
          © 2025 ConvoSpan.ai |   Contact Us
        
      
    
  );
}
