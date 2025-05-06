'use server';
import {NextRequest, NextResponse} from 'next/server';
import {read, update} from '@/lib/firebaseServer';
import {z} from 'zod';

const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  tier: z.enum(['free', 'basic', 'pro', 'enterprise']).optional(), // Assuming 'free' is a tier
  // Add other updatable fields
});

export async function GET(req: NextRequest, {params}: {params: {userId: string}}) {
  const userId = params.userId;
  try {
    const userData = await read('users', userId);
    if (!userData) {
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    // Selectively return non-sensitive data
    const {email, tier, createdAt} = userData;
    return NextResponse.json({id: userId, email, tier, createdAt}, {status: 200});
  } catch (error: any) {
    console.error(`Error fetching user ${userId}:`, error);
    return NextResponse.json({error: 'Failed to fetch user', details: error.message}, {status: 500});
  }
}

export async function PUT(req: NextRequest, {params}: {params: {userId: string}}) {
  const userId = params.userId;
  try {
    const body = await req.json();
    const validationResult = UserUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({error: 'Validation failed', details: validationResult.error.errors}, {status: 400});
    }

    // In a real app, ensure only the authenticated user or an admin can update.
    // For now, we're skipping that auth check.
    await update('users', userId, validationResult.data);
    return NextResponse.json({message: 'User updated successfully', userId}, {status: 200});
  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    return NextResponse.json({error: 'Failed to update user', details: error.message}, {status: 500});
  }
}
