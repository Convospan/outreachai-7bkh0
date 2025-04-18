'use server';

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const client = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const reqBody = await req.json();
    const { tier } = reqBody;

    const plans = {
      basic: { amount: 99900, interval: 'monthly', name: 'Basic Plan' },
      pro: { amount: 299900, interval: 'monthly', name: 'Pro Plan' },
      enterprise: { amount: 999900, interval: 'monthly', name: 'Enterprise Plan' },
    };

    const plan = plans[tier?.toLowerCase() as keyof typeof plans];

    if (!plan) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const plan_response = await client.plans.create({
      period: plan.interval,
      interval: 1,
      item: {
        name: plan.name,
        amount: plan.amount,
        currency: 'INR',
      },
      notes: {
        tier,
      },
    });

    const subscription = await client.subscriptions.create({
      plan_id: plan_response.id,
      customer_notify: 1,
      total_count: 12,
      start_at: Math.floor(Date.now() / 1000),
      notes: {
        tier,
      },
    });

    return NextResponse.json({ subscription_id: subscription.id, status: 'created' }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Subscription failed', details: error.message }, { status: 500 });
  }
}
