'use server';

import {NextRequest, NextResponse} from 'next/server';
import {create} from '@/lib/firebaseServer'; // Assuming this handles user creation in Firebase
import {z} from 'zod';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  // Add other fields as necessary, e.g., name, tier
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = SignupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({error: 'Validation failed', details: validationResult.error.errors}, {status: 400});
    }

    const {email, password} = validationResult.data;

    // In a real app, you'd hash the password before storing it.
    // For now, as we're skipping actual Firebase Auth integration, we'll store it as is.
    // IMPORTANT: This is NOT secure for production. Use Firebase Auth SDK for proper password handling.
    const userId = await create('users', {
      email,
      // password, // DO NOT store plain text passwords. Use Firebase Auth.
      tier: 'free', // Default tier
      createdAt: new Date().toISOString(),
    });

    // Placeholder for actual session management (e.g., JWT or cookie)
    return NextResponse.json({message: 'User created successfully', userId}, {status: 201});
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({error: 'Failed to create user', details: error.message}, {status: 500});
  }
}
