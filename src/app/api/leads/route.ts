'use server'

import { db } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const LeadSchema = z.object({
  campaign_id: z.string(),
  user_id: z.string(),
  platform: z.enum(['linkedin', 'twitter', 'email']),
  profile_data: z.record(z.any()), // Flexible profile data
  priority_score: z.number().min(0).max(100).default(50),
  status: z.string().default('new'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = LeadSchema.parse(body);

    const data = {
      ...validatedData,
      created_at: new Date().toISOString(),
    };

    const docRef = await db.collection('leads').add(data);
    return NextResponse.json({ id: docRef.id, status: 'created' }, { status: 201 });
  } catch (error: any) {
    console.error("Create leads failed:", error);

    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json({ error: 'Validation failed', details: errorMessages }, { status: 400 });
    }

    return NextResponse.json({ error: 'Create failed', details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaign_id');

    if (!campaignId) {
      return NextResponse.json({ error: 'campaign_id parameter is required' }, { status: 400 });
    }

    const snapshot = await db.collection('leads')
      .where('campaign_id', '==', campaignId)
      .get();

    const leads = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error("Read leads failed:", error);
    return NextResponse.json({ error: 'Read failed' }, { status: 500 });
  }
}

export async function OPTIONS(req: NextRequest) {
    return new Response(null, {
        status: 204,
        headers: {
            'Allow': 'POST, GET, OPTIONS',
        }
    });
}
