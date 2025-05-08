"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export default function PaymentForm({ tierName, tierPrice, tierFeatures, monthlyPriceId, annuallyPriceId, planId }: { tierName: string, tierPrice: string, tierFeatures: string[], monthlyPriceId?: string, annuallyPriceId?: string, planId: string }) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annually'>('monthly');
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubscribe = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Simulate user ID - replace with actual user authentication
    const userId = "user_placeholder_id"; 
    
    try {
      // In a real app, you would call your backend to create a checkout session with Stripe or chosen payment provider
      // For this example, we'll simulate and then navigate to a confirmation or next step
      // const response = await axios.post('/api/subscribe', {
      //   userId: userId,
      //   tier: planId, // e.g., 'connect_explore', 'engage_grow'
      //   priceId: billingInterval === 'monthly' ? monthlyPriceId : annuallyPriceId, // Pass the selected price ID
      //   interval: billingInterval,
      // });

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      // if (response.data.sessionId) {
      //   // Redirect to Stripe Checkout (example)
      //   // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      //   // await stripe?.redirectToCheckout({ sessionId: response.data.sessionId });
      //   toast({ title: "Redirecting to payment...", description: "You will be redirected to complete your subscription."});
      // } else {
      //   setMessage(response.data.message || `Successfully subscribed to ${tierName} (${billingInterval}).`);
      //   toast({ title: "Subscription Updated (Simulated)", description: `You are now on the ${tierName} plan.` });
      // }
      setMessage(`Successfully subscribed to ${tierName} (${billingInterval}). (Simulated)`);
      toast({ title: "Subscription Successful (Simulated)", description: `Welcome to the ${tierName} plan!` });
      // router.push('/dashboard'); // Redirect to dashboard or a confirmation page

    } catch (error: any) {
      console.error('Error subscribing:', error);
      const errorMessage = error.response?.data?.error || 'Error subscribing. Please try again.';
      setMessage(errorMessage);
      toast({
        title: "Subscription Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  // Only render payment form if it's not the free plan
  if (planId === 'connect_explore') {
    return (
       <Button
          onClick={() => router.push('/campaign/create')} // Or your app's entry point after free signup
          className="w-full text-lg py-3 mt-4"
        >
          Get Started with Free Plan
        </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-md mx-auto bg-card rounded-xl shadow-xl drop-shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-2 text-center text-card-foreground">{tierName}</h3>
      <p className="text-3xl font-bold text-center text-primary mb-1">{tierPrice}</p>
      <p className="text-sm text-muted-foreground text-center mb-6">per month</p>
      
      {monthlyPriceId && annuallyPriceId && (
         <div className="mb-6">
            <label htmlFor={`billingInterval-${planId}`} className="block text-sm font-medium text-muted-foreground mb-1">Billing Cycle</label>
            <select
                id={`billingInterval-${planId}`}
                value={billingInterval}
                onChange={(e) => setBillingInterval(e.target.value as 'monthly' | 'annually')}
                className="w-full p-3 border border-input bg-background rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isLoading}
            >
                <option value="monthly">Monthly</option>
                <option value="annually">Annually (Save 20%)</option>
            </select>
        </div>
      )}


      <ul className="space-y-2 mb-6 text-left">
        {tierFeatures.map((feature, index) => (
          <li key={index} className="flex items-center text-muted-foreground">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button
        onClick={handleSubscribe}
        className="w-full text-lg py-3"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : `Subscribe to ${tierName}`}
      </Button>
      {message && <p className={`mt-4 text-center text-sm ${message.startsWith('Error') ? 'text-destructive' : 'text-green-600'}`}>{message}</p>}
    </motion.div>
  );
}
