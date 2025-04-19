'use server'

import { db } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = {
      ...body,
      created_at: new Date().toISOString(),
    };

    const docRef = await db.collection('leads').add(data);
    return NextResponse.json({ id: docRef.id, status: 'created' }, { status: 201 });
  } catch (error) {
    console.error("Create leads failed:", error);
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
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
