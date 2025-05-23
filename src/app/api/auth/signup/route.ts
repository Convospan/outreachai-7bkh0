'use server';

import { NextRequest, NextResponse } from 'next/server';
// Assuming firebaseServer.ts exports 'db' for Firestore and 'adminAuth' for Firebase Admin Auth
import { db, adminAuth } from '@/lib/firebaseServer'; 
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  // Add other fields as necessary, e.g., name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = SignupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error.errors }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    // Check if user already exists in Firebase Authentication by email
    try {
      await adminAuth.getUserByEmail(email);
      // If the above line does not throw, user already exists in Firebase Auth
      return NextResponse.json({ error: 'User with this email already exists in Firebase Authentication' }, { status: 409 });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // User does not exist, proceed with creation
      } else {
        // Some other error with Firebase Auth
        console.error('Error checking user in Firebase Auth:', error);
        return NextResponse.json({ error: 'Error checking user existence', details: error.message }, { status: 500 });
      }
    }
    
    // Also check Firestore if you maintain a separate profile store and want to be sure
    // This might be redundant if Firebase Auth is the source of truth for existence
    const usersRef = db.collection('users');
    const existingUserSnapshot = await usersRef.where('email', '==', email).limit(1).get();
    if (!existingUserSnapshot.empty) {
        // This case implies user exists in Firestore but not Firebase Auth, which indicates inconsistent data.
        // Depending on policy, you might block this or attempt to link. For now, let's treat it as a conflict.
      return NextResponse.json({ error: 'User with this email already exists in user profiles database' }, { status: 409 });
    }

    // Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email: email,
      password: password,
      // You can add other properties like displayName here if available from form
      // emailVerified: false, // Default
      // disabled: false, // Default
    });

    // Now, create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid, // Store the Firebase Auth UID
      email: userRecord.email,
      tier: 'free', // Default tier
      createdAt: new Date().toISOString(),
      // Add any other default fields from validationResult.data if they exist (e.g., name)
    };
    await db.collection('users').doc(userRecord.uid).set(userProfile); // Use UID as document ID

    return NextResponse.json({ message: 'User created successfully in Firebase Authentication and Firestore', userId: userRecord.uid }, { status: 201 });

  } catch (error: any) {
    console.error('Signup API error:', error);
    // Check for specific Firebase Admin SDK errors
    if (error.code === 'auth/email-already-exists') {
        return NextResponse.json({ error: 'User with this email already exists in Firebase Authentication (caught during creation)' }, { status: 409 });
    }
    if (error.code === 'auth/invalid-password') {
        return NextResponse.json({ error: 'Password does not meet complexity requirements.', details: error.message }, { status: 400 });
    }
    
    const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Failed to create user due to an internal error.';
    return NextResponse.json({ error: 'Failed to create user', details: errorMessage }, { status: 500 });
  }
}
