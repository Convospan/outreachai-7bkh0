// src/app/api/linkedin/store-profile/route.ts
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { create } from '@/lib/firebaseServer'; // Assuming 'create' adds a document

const ProfileDataSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  company: z.string().optional(),
  url: z.string().url().optional(),
  // Add other expected profile fields here
});

const StoreProfileInputSchema = z.object({
  uid: z.string().min(1, { message: "User ID (uid) is required." }),
  data: ProfileDataSchema,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = StoreProfileInputSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation failed for storeProfile:", validationResult.error.flatten());
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { uid, data: profileData } = validationResult.data;

    // TODO: Implement proper authentication to verify the UID belongs to an authenticated user.
    // For example, verify a Firebase ID token passed from the Chrome extension.
    // if (!isAuthenticatedAndAuthorized(uid, req.headers.get('Authorization'))) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const docData = {
      uid, // To link back to the user
      ...profileData,
      scrapedAt: new Date().toISOString(),
    };

    // Consider storing this in a subcollection under the user, e.g., users/{uid}/linkedinProfiles/{profileDocId}
    // Or a top-level collection if profiles might be shared or accessed differently.
    // For simplicity, using a top-level collection here.
    const profileDocId = await create('linkedinProfiles', docData);

    console.log(`LinkedIn profile data stored for UID ${uid}, Doc ID: ${profileDocId}`);
    return NextResponse.json({ success: true, message: 'LinkedIn profile data stored.', profileId: profileDocId }, { status: 201 });

  } catch (error: any) {
    console.error('Error in /api/linkedin/store-profile:', error);
    return NextResponse.json(
      { error: 'Failed to store LinkedIn profile data', details: error.message || "Unknown server error." },
      { status: 500 }
    );
  }
}
