'use server';
import { NextRequest, NextResponse } from 'next/server';
import { read, update } from '@/lib/firebaseServer';
import { z } from 'zod';

const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  tier: z.enum(['free', 'basic', 'pro', 'enterprise']).optional(),
});

interface RouteContext { params: { userId: string } }

export async function GET(req: NextRequest, context: RouteContext) {
  const userId = context.params.userId;
  try {
    const userData = await read('users', userId);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const { email, tier, createdAt } = userData;
    return NextResponse.json({ id: userId, email, tier, createdAt }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching user ${userId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch user', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const userId = context.params.userId;
  try {
    const body = await req.json();
    const validationResult = UserUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error.errors }, { status: 400 });
    }

    await update('users', userId, validationResult.data);
    return NextResponse.json({ message: 'User updated successfully', userId }, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
  }
}
