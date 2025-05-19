// src/services/campaigns.ts
'use server';

import { db } from "@/lib/firebaseServer"; // Using server-side Firestore instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";

// Basic interfaces for action types - refine these based on your actual data structures
interface LinkedInAction {
  type: 'connect' | 'message' | 'follow' | string; // Allow for other types if needed
  profileUrl?: string;
  messageContent?: string;
  delayMinutes?: number;
}

interface EmailAction {
  type: 'sendEmail' | string; // Allow for other types
  domain?: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  subject?: string;
  body?: string;
  delayMinutes?: number;
}

interface CampaignData {
  name: string; // Assuming a campaign has a name
  linkedinActions: LinkedInAction[];
  emailActions: EmailAction[];
  // Add other campaign-level settings if needed
}

export async function createCampaign(uid: string, campaignData: CampaignData): Promise<string> {
  const { name, linkedinActions, emailActions } = campaignData;

  // IMPORTANT: Hunter.io API key should be stored securely as an environment variable
  const HUNTER_API_KEY = process.env.HUNTER_API_KEY;

  const processedEmailActions = await Promise.all(
    emailActions.map(async (action) => {
      if (action.type === "sendEmail" && !action.email && action.domain && action.firstName && action.lastName) {
        if (!HUNTER_API_KEY) {
          console.warn("Hunter.io API key (HUNTER_API_KEY) is not configured. Email lookup will be skipped for action:", action);
          return { ...action, email: null };
        }
        try {
          console.log(`Looking up email for ${action.firstName} ${action.lastName} @ ${action.domain} using Hunter.io`);
          const response = await axios.get(`https://api.hunter.io/v2/email-finder`, {
            params: {
              domain: action.domain,
              first_name: action.firstName,
              last_name: action.lastName,
              api_key: HUNTER_API_KEY
            }
          });
          // Hunter API returns data structure like: { data: { email: '...', score: ... }, ... }
          action.email = response.data?.data?.email || null;
          console.log(`Hunter.io result for ${action.firstName} ${action.lastName}: ${action.email}`);
          return action;
        } catch (error: any) {
          console.error("Error calling Hunter.io API:", error.response?.data || error.message);
          // Proceed without email if Hunter fails or email not found
          return { ...action, email: null };
        }
      }
      return action;
    })
  );

  try {
    const userCampaignsCollectionRef = collection(db, `users/${uid}/campaigns`);
    const campaignDocData = {
      name, // Storing campaign name
      linkedinActions,
      emailActions: processedEmailActions,
      createdAt: serverTimestamp(), // Use Firestore server timestamp for consistency
      status: "draft", // Initial status
      userId: uid,
    };
    
    const campaignRef = await addDoc(userCampaignsCollectionRef, campaignDocData);
    console.log("Campaign document written to Firestore with ID: ", campaignRef.id);
    return campaignRef.id;

  } catch (error) {
    console.error("Error creating campaign document in Firestore: ", error);
    throw new Error("Failed to create campaign in Firestore.");
  }
}
