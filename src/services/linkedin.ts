// src/services/linkedin.ts
'use server';

import axios from 'axios';

// Interfaces for clarity
export interface LinkedInProfile {
  id: string;
  localizedFirstName?: string;
  localizedLastName?: string;
  profilePicture?: {
    'displayImage~': {
      elements: Array<{
        identifiers: Array<{
          identifier: string;
        }>;
      }>;
    };
  };
  // Add other fields you expect from the /v2/me endpoint
}

export interface LinkedInEmail {
  elements: Array<{
    handle: string;
    'handle~': {
      emailAddress: string;
    };
    primary?: boolean;
  }>;
}

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;

if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET || !LINKEDIN_REDIRECT_URI) {
  console.error(
    '🔴 Critical LinkedIn OAuth environment variables are missing. Check NEXT_PUBLIC_LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, NEXT_PUBLIC_LINKEDIN_REDIRECT_URI in your .env file and deployment configuration.'
  );
}

/**
 * Exchanges an authorization code for a LinkedIn access token.
 * @param code The authorization code received from LinkedIn.
 * @returns A promise that resolves to the access token string.
 */
export async function exchangeLinkedInCodeForToken(code: string): Promise<string | null> {
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET || !LINKEDIN_REDIRECT_URI) {
    console.error('Cannot exchange LinkedIn code: OAuth configuration is incomplete.');
    throw new Error('LinkedIn OAuth configuration is incomplete.');
  }
  try {
    const response = await axios.post<{ access_token: string }>(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return response.data.access_token;
  } catch (error: any) {
    console.error('Error exchanging LinkedIn code for token:', error.response?.data || error.message);
    throw new Error('Failed to exchange LinkedIn code for token.');
  }
}

/**
 * Fetches the basic profile information of the authenticated LinkedIn user.
 * @param accessToken The LinkedIn access token.
 * @returns A promise that resolves to the user's profile data.
 */
export async function fetchLinkedInProfile(accessToken: string): Promise<LinkedInProfile | null> {
  try {
    // Projection to get basic profile fields including profile picture
    const profileProjection =
      '(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))';
    const response = await axios.get<LinkedInProfile>(
      `https://api.linkedin.com/v2/me?projection=${profileProjection}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0', // Recommended by LinkedIn
          'LinkedIn-Version': '202304', // Example: Use a recent, stable API version date
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching LinkedIn profile:', error.response?.data || error.message);
    throw new Error('Failed to fetch LinkedIn profile.');
  }
}

/**
 * Fetches the primary email address of the authenticated LinkedIn user.
 * Requires the 'r_emailaddress' scope.
 * @param accessToken The LinkedIn access token.
 * @returns A promise that resolves to the user's email address string.
 */
export async function fetchLinkedInEmail(accessToken: string): Promise<string | null> {
  try {
    const response = await axios.get<LinkedInEmail>(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': '202304',
        },
      }
    );
    // Find the primary email if available, otherwise the first one.
    const primaryEmailElement = response.data.elements?.find(el => el.primary);
    if (primaryEmailElement && primaryEmailElement['handle~']?.emailAddress) {
      return primaryEmailElement['handle~'].emailAddress;
    }
    // Fallback to the first email if no primary is marked (or if structure is different)
    if (response.data.elements?.[0]?.['handle~']?.emailAddress) {
        return response.data.elements[0]['handle~'].emailAddress;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching LinkedIn email:', error.response?.data || error.message);
    // Don't throw an error if email is just not found or not permissioned, return null
    // throw new Error('Failed to fetch LinkedIn email.');
    return null;
  }
}


// Placeholder for sending messages (pending full implementation as per readiness report)
export async function sendLinkedInMessage(
  accessToken: string,
  recipientUrn: string, // e.g., urn:li:person:xxxxxxx
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.warn('sendLinkedInMessage is not fully implemented yet.');
  // TODO: Implement actual API call to LinkedIn's UGS messaging API
  // This requires careful handling of conversation URNs, message types, and permissions.
  // Example structure (highly dependent on LinkedIn API specifics):
  /*
  try {
    const response = await axios.post(
      'https://api.linkedin.com/rest/messages', // Example UGS endpoint
      {
        recipients: [recipientUrn],
        subject: 'Message from ConvoSpan AI', // Or derive dynamically
        body: message,
        // ... other necessary UGS parameters
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
          // 'com.linkedin.common.urn.MemberUrn': YOUR_APP_MEMBER_URN_IF_NEEDED,
        },
      }
    );
    return { success: true, messageId: response.data?.id || 'simulated_id' };
  } catch (error: any) {
    console.error('LinkedIn API error (sendLinkedInMessage):', error.response?.data || error.message);
    return { success: false, error: 'Failed to send LinkedIn message (Not Implemented)' };
  }
  */
  return { success: false, error: 'sendLinkedInMessage is not fully implemented yet.' };
}

// Placeholder for fetching messages (pending full implementation)
export async function fetchLinkedInMessages(
  accessToken: string,
  conversationUrn: string // e.g., urn:li:fs_conversation:xxxx
): Promise<any[]> {
  console.warn('fetchLinkedInMessages is not fully implemented yet.');
  // TODO: Implement actual API call to LinkedIn's UGS messaging API
  // e.g., `https://api.linkedin.com/rest/conversations/${conversationUrn}/events?q=messages`
  /*
  try {
    const response = await axios.get(
      `https://api.linkedin.com/rest/conversations/${conversationUrn}/events?q=messages&eventTypes=MESSAGE`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );
    return response.data.elements || [];
  } catch (error: any) {
    console.error('LinkedIn API error (fetchLinkedInMessages):', error.response?.data || error.message);
    return [];
  }
  */
  return [];
}

    