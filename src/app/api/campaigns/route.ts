'use server'

import { db } from '../../../lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id parameter is required' }, { status: 400 });
    }

    const snapshot = await db.collection('campaigns')
      .where('user_id', '==', userId)
      .get();

    const campaigns = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });

    return NextResponse.json(campaigns, { status: 200 });
  } catch (error) {
    console.error("Read campaigns failed:", error);
    return NextResponse.json({ error: 'Read failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaign_id');
    const body = await req.json();

    if (!campaignId) {
      return NextResponse.json({ error: 'campaign_id parameter is required' }, { status: 400 });
    }

    await db.collection('campaigns').doc(campaignId).update(body);
    return NextResponse.json({ id: campaignId, status: 'updated' }, { status: 200 });
  } catch (error) {
    console.error("Update campaign failed:", error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaign_id');

    if (!campaignId) {
      return NextResponse.json({ error: 'campaign_id parameter is required' }, { status: 400 });
    }

    await db.collection('campaigns').doc(campaignId).delete();
    return NextResponse.json({ id: campaignId, status: 'deleted' }, { status: 200 });
  } catch (error) {
    console.error("Delete campaign failed:", error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function OPTIONS(req: NextRequest) {
    return new Response(null, {
        status: 204,
        headers: {
            'Allow': 'GET, PUT, DELETE, OPTIONS',
        }
    });
}
