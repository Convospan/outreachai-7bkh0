'use server';

import { NextRequest, NextResponse } from 'next/server';
import { update, read } from '@/lib/firebaseServer'; 
import { z } from 'zod';

const SubscriptionSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  tier: z.enum(['free', 'connect_explore', 'engage_grow', 'outreach_pro', 'scale_impact'], {
    errorMap: () => ({ message: "Invalid tier selected" })
  }),
  // Removed priceId and interval as they are specific to payment gateway integration
  // which is currently simulated/skipped.
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const validationResult = SubscriptionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error.errors }, { status: 400 });
    }

    const { userId, tier } = validationResult.data;

    // Check if user exists (optional, but good practice)
    try {
      const userData = await read('users', userId);
      if (!userData) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    } catch (readError: any) {
      console.error(`Error reading user ${userId} during subscription:`, readError);
      // Decide if this is a critical failure or if you can proceed
      // For now, let's consider it non-critical if the main goal is to update the tier.
    }
    

    // Update the user's tier in Firestore
    try {
      await update('users', userId, { tier: tier, updatedAt: new Date().toISOString() });
    } catch (updateError: any) {
       console.error(`Error updating user tier for ${userId} to ${tier}:`, updateError);
       return NextResponse.json({ error: 'Failed to update user subscription tier', details: updateError.message }, { status: 500 });
    }
    

    // Placeholder for actual subscription creation logic (e.g., with a payment gateway)
    // This part is simulated. In a real app, this would involve:
    // 1. Creating a customer in Stripe (if not exists)
    // 2. Creating a subscription in Stripe
    // 3. Storing the Stripe subscription ID in your 'users' or a 'subscriptions' collection
    console.log(`Subscription (simulated) updated for user ${userId} to tier: ${tier}`);
    
    // Return a success response
    return NextResponse.json({ message: `Successfully subscribed user ${userId} to ${tier} tier. (Simulated)`, userId, tier }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing subscription POST request:', error);
    const errorMessage = error.message || 'An unknown error occurred during subscription.';
    return NextResponse.json({ error: 'Subscription processing failed', details: errorMessage }, { status: 500 });
  }
}
