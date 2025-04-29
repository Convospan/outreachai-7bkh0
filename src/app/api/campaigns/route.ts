'use server'

import { db } from '@/lib/firebaseServer';
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

    if (snapshot.empty) {
      return NextResponse.json([], { status: 200, statusText: 'No campaigns found for this user' });
    }

    const campaigns = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Untitled Campaign',
        platforms: data.platforms || [],
        score: data.score || 0,
        status: data.status || 'draft',
        created_at: data.created_at || null,
        user_id: data.user_id || null,
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
