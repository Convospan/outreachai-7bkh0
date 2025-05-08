'use server';

import {NextRequest, NextResponse} from 'next/server';
import {create, db} from '@/lib/firebaseServer'; 
import {z} from 'zod';

const SignupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  // Add other fields as necessary, e.g., name
  // tier: z.enum(['free', 'basic', 'pro', 'enterprise']).default('free'), // Example if tier is set at signup
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = SignupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({error: 'Validation failed', details: validationResult.error.errors}, {status: 400});
    }

    const {email, password} = validationResult.data;

    // Check if user already exists
    const usersRef = db.collection('users');
    const existingUserSnapshot = await usersRef.where('email', '==', email).limit(1).get();
    if (!existingUserSnapshot.empty) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
    }

    // IMPORTANT: This is NOT secure for production for password handling.
    // In a real app, you would use Firebase Authentication's `createUserWithEmailAndPassword`
    // on the client-side, or the Firebase Admin SDK's `auth().createUser()` on the server-side.
    // This current setup stores a plain text representation or a self-managed hash, which is insecure.
    // We are only creating a user document in Firestore here for simulation.
    const userId = await create('users', {
      email,
      // password: hashedPassword, // If you were to hash it, but still not recommended over Firebase Auth
      tier: 'free', // Default tier
      createdAt: new Date().toISOString(),
      // Any other default fields
    });

    // Placeholder for actual session management (e.g., creating a custom token with Admin SDK and sending it)
    return NextResponse.json({message: 'User created successfully (Simulated)', userId}, {status: 201});

  } catch (error: any) {
    console.error('Signup API error:', error);
    // Avoid leaking detailed error messages to the client in production
    const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Failed to create user due to an internal error.';
    return NextResponse.json({error: 'Failed to create user', details: errorMessage}, {status: 500});
  }
}
