'use server'

import { db } from '@/lib/firebaseServer';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define a Zod schema for user data validation
const UserSchema = z.object({
  email: z.string().email(),
  tier: z.enum(['basic', 'pro', 'enterprise']).default('basic'),
  quota: z.number().int().min(0).default(0),
  consent: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body against the Zod schema
    const validatedData = UserSchema.parse(body);

    const data = {
      ...validatedData,
      created_at: new Date().toISOString(),
    };

    const docRef = await db.collection('users').add(data);
    return NextResponse.json({ id: docRef.id, status: 'created' }, { status: 201 });
  } catch (error: any) {
    console.error("Create user failed:", error);

    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
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
