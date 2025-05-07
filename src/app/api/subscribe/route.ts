'use server';

import { NextRequest, NextResponse } from 'next/server';
import { update, read } from '@/lib/firebaseServer'; // Assuming 'update' and 'read' functions are available from your firebaseServer setup
import { z } from 'zod';

const SubscriptionSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  tier: z.enum(['free', 'connect_explore', 'engage_grow', 'outreach_pro', 'scale_impact'], {
    errorMap: () => ({ message: "Invalid tier selected" })
  }),
  // Add other subscription-related fields if necessary, e.g., paymentId
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
    const userData = await read('users', userId);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user's tier in Firestore
    await update('users', userId, { tier: tier, updatedAt: new Date().toISOString() });

    // Placeholder for actual subscription creation logic (e.g., with a payment gateway)
    console.log(`Subscription updated for user ${userId} to tier: ${tier}`);
    
    // Return a success response
    return NextResponse.json({ message: `Successfully subscribed user ${userId} to ${tier} tier.`, userId, tier }, { status: 200 });

  } catch (error: any) {
    console.error('Error creating subscription:', error);
    // In a real app, you might want to log more detailed errors
    const errorMessage = error.message || 'An unknown error occurred during subscription.';
    return NextResponse.json({ error: 'Subscription failed', details: errorMessage }, { status: 500 });
  }
}
