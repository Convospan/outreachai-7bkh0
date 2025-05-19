/**
 * Represents a LinkedIn profile.
 * This interface defines the structure for profile data, which will now be
 * collected via scraping from the LinkedIn UI by the Chrome extension's content.js.
 */
export interface LinkedInProfile {
  /**
   * The LinkedIn profile ID. This might be a numeric ID or derived from the profile URL.
   */
  id: string;
  /**
   * The profile headline.
   */
  headline: string;
  /**
   * The profile URL.
   */
  profileUrl: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  profilePictureUrl?: string | null;
  // Add other fields as needed based on what can be scraped
  company?: string | null;
  title?: string | null;
}

// import axios, { AxiosError } from 'axios'; // No longer needed for LinkedIn API calls in this file

/**
 * Interface for OAuth configuration.
 * IMPORTANT: With the shift to UI scraping and automation, direct LinkedIn
 * API calls for profile fetching and actions are being phased out.
 * This OAuth configuration might become entirely redundant if no other
 * LinkedIn API interactions are required by the backend.
 * It is commented out for deprecation, awaiting confirmation of no remaining
 * API dependency.
 */
/*
export interface OAuthConfiguration {
  clientId: string;
  clientSecret: string; // This should only be used server-side
  redirectUri: string;
}
*/

/**
 * Returns OAuth configuration.
 * Client ID and Redirect URI are public, Client Secret is server-side only.
 * IMPORTANT: This function is likely deprecated as direct LinkedIn API interactions
 * are being replaced by UI scraping and automation.
 * This means OAuth tokens for API access are no longer the primary method of
 * interaction with LinkedIn for profile fetching and actions.
 */
/*
export async function getLinkedInOAuthConfig(): Promise<OAuthConfiguration> {
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  let redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    const errorMsg = 'LinkedIn OAuth configuration is incomplete (Client ID or Redirect URI missing). Check environment variables: NEXT_PUBLIC_LINKEDIN_CLIENT_ID, NEXT_PUBLIC_LINKEDIN_REDIRECT_URI';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  if (!clientSecret && typeof window === 'undefined') { // Check if server-side and secret is missing
    console.warn('LINKEDIN_CLIENT_SECRET is missing. Ensure it is set in server environment variables. This is required for token exchange.');
  }

  if (typeof window !== 'undefined' && redirectUri && !redirectUri.startsWith('http')) {
    redirectUri = `${window.location.origin}${redirectUri.startsWith('/') ? '' : '/'}${redirectUri}`;
  }

  return {
    clientId,
    clientSecret: clientSecret || '',
    redirectUri,
  };
}
*/

// --- Removed API-based LinkedIn Profile Fetching Logic ---
// The following interfaces and functions related to fetching LinkedIn profiles
// via direct API calls are removed as profile data will now be scraped from the UI.
/*
interface LinkedInProfileAPIResponse {
  id: string;
  firstName?: {
    localized: {[key: string]: string};
    preferredLocale: {country: string; language: string};
  };
  lastName?: {
    localized: {[key: string]: string};
    preferredLocale: {country: string; language: string};
  };
  profilePicture?: {
    'displayImage~': {
      elements: Array<{
        identifiers: Array<{identifier: string; mediaType: string;}>;
        artifact?: string;
      }>;
    };
  };
  headline?: {
    localized: {[key: string]: string};
    preferredLocale: {country: string; language: string};
  };
}

interface LinkedInEmailAPIResponse {
  elements: Array<{
    'handle~': {
      emailAddress: string;
    };
    handle: string;
  }>;
}

export async function getLinkedInProfileByToken(accessToken: string): Promise<LinkedInProfile> {
  // This function is being removed as profile data will be scraped directly from the UI.
  // The backend will receive this data from the Chrome extension.
  throw new Error("getLinkedInProfileByToken is deprecated. Use scraping from content.js for profile data.");
}
*/

// --- Removed API-based LinkedIn Messaging Logic ---
// The following functions and interfaces related to sending and fetching LinkedIn messages
// via direct API calls are removed. Messaging and other actions will now be handled
// by simulating UI interactions via the Chrome extension's background.js.
/*
export async function sendLinkedInMessage(recipientUrn: string, messageText: string, accessToken: string): Promise<{success: boolean; data?: any; error?: string}> {
  // This function is being removed. Message sending will be handled by UI automation
  // in the Chrome extension (background.js).
  throw new Error("sendLinkedInMessage is deprecated. Use UI automation via background.js for sending messages.");
}

interface LinkedInMessageAPI {
  id: string;
  sender?: string;
  body?: { text?: string };
  message?: { body?: {text?: string}};
  eventContent?: {
    "com.linkedin.voyager.messaging.event.MessageEvent"?: {
      attributedBody?: { text?: string };
      body?: string;
      subject?: string;
    }
  };
  from?: {
    "com.linkedin.voyager.messaging.MessagingMember": {
      miniProfile: {
        objectUrn: string;
      }
    }
  };
  createdAt?: number;
  timestamp?: number;
}

interface LinkedInConversationEventAPI {
  elements: LinkedInMessageAPI[];
}

export async function fetchLinkedInMessages(
  conversationUrn: string,
  accessToken: string,
  count: number = 20,
  createdBeforeTimestamp?: number
): Promise<{success: boolean; messages?: { id: string; senderUrn: string; text: string; timestamp: number; }[]; error?: string; rawData?: any}> {
  // This function is being removed. Message fetching (if needed) will be handled
  // either by UI scraping or by tracking messages within the system based on
  // the extension's activity.
  throw new Error("fetchLinkedInMessages is deprecated. Message history will be managed via UI scraping or internal tracking.");
}
*/