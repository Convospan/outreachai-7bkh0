// src/services/campaigns.ts
'use server';

import { db } from "@/lib/firebaseServer"; // Assuming server-side Firestore operations
// If this is meant to be called from the client, use: import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";

interface LinkedInAction {
  type: 'connect' | 'message' | 'follow';
  profileUrl?: string; // For connect/follow
  messageContent?: string; // For message
  delayMinutes?: number;
}

interface EmailAction {
  type: 'sendEmail';
  domain?: string; // For hunter.io lookup
  firstName?: string; // For hunter.io lookup
  lastName?: string; // For hunter.io lookup
  email?: string | null; // Can be pre-filled or found by Hunter
  subject?: string;
  body?: string;
  delayMinutes?: number;
}

interface CampaignData {
  name: string;
  linkedinActions: LinkedInAction[];
  emailActions: EmailAction[];
  // Add other campaign-level settings if needed
}

export async function createCampaign(uid: string, campaignData: CampaignData): Promise<string> {
  const { name, linkedinActions, emailActions } = campaignData;

  // IMPORTANT: Hunter.io API key should be stored securely as an environment variable
  // e.g., const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
  const HUNTER_API_KEY = "YOUR_HUNTER_API_KEY_PLACEHOLDER"; // Replace with process.env.HUNTER_API_KEY

  const processedEmailActions = await Promise.all(emailActions.map(async (action) => {
    if (action.type === "sendEmail" && !action.email && action.domain && action.firstName && action.lastName) {
      if (HUNTER_API_KEY === "YOUR_HUNTER_API_KEY_PLACEHOLDER") {
        console.warn("Hunter.io API key is a placeholder. Email lookup will be skipped.");
        return { ...action, email: null };
      }
      try {
        const response = await axios.get(`https://api.hunter.io/v2/email-finder`, {
          params: {
            domain: action.domain,
            first_name: action.firstName,
            last_name: action.lastName,
            api_key: HUNTER_API_KEY
          }
        });
        // Hunter API returns data structure like: { data: { email: '...', score: ... }, ... }
        return { ...action, email: response.data?.data?.email || null };
      } catch (error: any) {
        console.error("Error calling Hunter.io API:", error.response?.data || error.message);
        return { ...action, email: null }; // Proceed without email if Hunter fails
      }
    }
    return action;
  }));

  // Using firebaseServer for admin SDK operations
  // If this function is intended to be called from the client-side after user authentication,
  // you would typically make an API call to a Next.js API route, and that API route would use firebaseServer.
  // For now, assuming this service function is called in a server context where firebaseServer is appropriate.

  try {
    const userCampaignsCollectionRef = collection(db, `users/${uid}/campaigns`);
    const campaignDocData = {
      name,
      linkedinActions,
      emailActions: processedEmailActions,
      createdAt: serverTimestamp(), // Use Firestore server timestamp
      status: "draft", // Initial status
      userId: uid, // Storing userId for potential rules and queries
    };
    
    const campaignRef = await addDoc(userCampaignsCollectionRef, campaignDocData);
    console.log("Campaign document written with ID: ", campaignRef.id);
    return campaignRef.id;

  } catch (error) {
    console.error("Error creating campaign document in Firestore: ", error);
    throw new Error("Failed to create campaign.");
  }
}
