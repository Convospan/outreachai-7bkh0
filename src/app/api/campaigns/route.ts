'use server'

import { db, adminAuth } from '@/lib/firebaseServer'; // Added adminAuth
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const uid = decodedToken.uid; // Authenticated user's ID

    // const { searchParams } = new URL(req.url); // userId from query param is no longer the source of truth
    // const queryUserId = searchParams.get('user_id');
    // if (queryUserId && queryUserId !== uid) {
    //   return NextResponse.json({ error: 'Forbidden: user_id parameter does not match authenticated user' }, { status: 403 });
    // }

    const snapshot = await db.collection('campaigns')
      .where('user_id', '==', uid) // Query by authenticated user's ID
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const uid = decodedToken.uid;

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaign_id');
    const body = await req.json();

    if (!campaignId) {
      return NextResponse.json({ error: 'campaign_id parameter is required' }, { status: 400 });
    }

    const campaignRef = db.collection('campaigns').doc(campaignId);
    const campaignDoc = await campaignRef.get();

    if (!campaignDoc.exists) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaignDoc.data()?.user_id !== uid) {
      return NextResponse.json({ error: 'Forbidden: User does not have access to this campaign' }, { status: 403 });
    }

    await campaignRef.update(body);
    return NextResponse.json({ id: campaignId, status: 'updated' }, { status: 200 });
  } catch (error) {
    console.error("Update campaign failed:", error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const uid = decodedToken.uid;

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaign_id');

    if (!campaignId) {
      return NextResponse.json({ error: 'campaign_id parameter is required' }, { status: 400 });
    }

    const campaignRef = db.collection('campaigns').doc(campaignId);
    const campaignDoc = await campaignRef.get();

    if (!campaignDoc.exists) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaignDoc.data()?.user_id !== uid) {
      return NextResponse.json({ error: 'Forbidden: User does not have access to this campaign' }, { status: 403 });
    }

    await campaignRef.delete();
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
