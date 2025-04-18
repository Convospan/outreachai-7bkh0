'use server';

import { NextRequest, NextResponse } from 'next/server';

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

    // Placeholder for subscription creation logic
    console.log('Subscription tier:', tier);
    return NextResponse.json({ message: 'Subscription feature is currently a placeholder.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Subscription failed', details: error.message }, { status: 500 });
  }
}
