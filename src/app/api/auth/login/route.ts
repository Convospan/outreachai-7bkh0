'use server';
import {NextRequest, NextResponse} from 'next/server';
import {db} from '@/lib/firebaseServer'; 
import {z} from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(), 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = LoginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({error: 'Validation failed', details: validationResult.error.errors}, {status: 400});
    }

    const {email, password} = validationResult.data;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({error: 'Invalid email or password'}, {status: 401});
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // IMPORTANT: This is a placeholder password check. 
    // In a real production app, use Firebase Authentication SDK for secure password handling.
    // Firebase Auth handles password hashing and comparison securely.
    // Storing and comparing plain text or even self-hashed passwords here is NOT secure.
    // if (userData.password !== password) { // Example of INSECURE plain text comparison
    //   return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    // }
    // For this simulation, we'll assume if the email exists, login is successful.

    // Placeholder for actual session management (e.g., JWT or cookie through Firebase Admin SDK or custom solution)
    // For now, returning basic user info.
    return NextResponse.json({
        message: 'Login successful (Simulated)', 
        userId: userDoc.id, 
        user: {
            email: userData.email, 
            tier: userData.tier,
            // DO NOT return sensitive info like password hashes here
        }
    }, {status: 200});

  } catch (error: any) {
    console.error('Login API error:', error);
    // Avoid leaking detailed error messages to the client in production
    const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Failed to login due to an internal error.';
    return NextResponse.json({error: 'Login failed', details: errorMessage}, {status: 500});
  }
}
