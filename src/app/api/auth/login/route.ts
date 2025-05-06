'use server';
import {NextRequest, NextResponse} from 'next/server';
import {db} from '@/lib/firebaseServer'; // Assuming db is your Firestore instance
import {z} from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(), // In a real app, you'd compare a hashed password
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = LoginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({error: 'Validation failed', details: validationResult.error.errors}, {status: 400});
    }

    const {email, password} = validationResult.data;

    // Placeholder for actual user lookup and password verification.
    // This is NOT secure. In a real app, use Firebase Authentication SDK.
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({error: 'Invalid email or password'}, {status: 401});
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Placeholder password check. DO NOT use this in production.
    // if (userData.password !== password) {
    //   return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    // }
    // For now, we'll assume if email exists, login is successful for skipped API integration

    // Placeholder for actual session management (e.g., JWT or cookie)
    return NextResponse.json({message: 'Login successful', userId: userDoc.id, user: {email: userData.email, tier: userData.tier}}, {status: 200});
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({error: 'Failed to login', details: error.message}, {status: 500});
  }
}
