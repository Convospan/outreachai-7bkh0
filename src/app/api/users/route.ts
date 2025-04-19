'use server'

import { db } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, tier, quota, consent } = body;

    const data = {
      email,
      tier,
      quota: quota || 0,
      consent: consent || false,
      created_at: new Date().toISOString(),
    };

    const docRef = await db.collection('users').add(data);
    return NextResponse.json({ id: docRef.id, status: 'created' }, { status: 201 });
  } catch (error) {
    console.error("Create user failed:", error);
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id parameter is required' }, { status: 400 });
    }

    const doc = await db.collection('users').doc(userId).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = doc.data();
    return NextResponse.json({ id: doc.id, data: userData }, { status: 200 });
  } catch (error) {
    console.error("Read user failed:", error);
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
