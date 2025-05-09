'use server';
import { NextRequest, NextResponse } from 'next/server';
import { read, update } from '@/lib/firebaseServer';
import { z } from 'zod';

const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  tier: z.enum(['free', 'connect_explore', 'engage_grow', 'outreach_pro', 'scale_impact']).optional(), // Updated tiers
});

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  const userId = context.params.userId;
  try {
    const userData = await read('users', userId);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Assuming userData might not have all fields, provide defaults or handle missing fields
    const { email = null, tier = null, createdAt = null } = userData;
    return NextResponse.json({ id: userId, email, tier, createdAt }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching user ${userId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch user', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: { userId: string } }) {
  const userId = context.params.userId;
  try {
    const body = await req.json();
    const validationResult = UserUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error.errors }, { status: 400 });
    }

    // Ensure only valid fields are passed to update
    const updateData: Partial<z.infer<typeof UserUpdateSchema>> & { updatedAt?: string } = {};
    if (validationResult.data.email) {
      updateData.email = validationResult.data.email;
    }
    if (validationResult.data.tier) {
      updateData.tier = validationResult.data.tier;
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date().toISOString();
      await update('users', userId, updateData);
      return NextResponse.json({ message: 'User updated successfully', userId }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No valid fields to update', userId }, { status: 200 });
    }

  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
  }
}
