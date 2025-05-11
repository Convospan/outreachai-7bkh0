
/**
 * Represents a LinkedIn profile.
 */
export interface LinkedInProfile {
  /**
   * The LinkedIn profile ID.
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
}

import axios from 'axios';

/**
 * Asynchronously retrieves a LinkedIn profile by username (placeholder).
 * In a real scenario, you'd likely use an access token to fetch profile data.
 *
 * @param username The LinkedIn username.
 * @returns A promise that resolves to a LinkedInProfile object.
 */
export async function getLinkedInProfile(username: string): Promise<LinkedInProfile> {
  console.warn('getLinkedInProfile by username is a placeholder. Use token-based fetching for actual data.');
  const isDetailed = Math.random() > 0.5;
  return {
    id: 'placeholder-id-for-' + username,
    headline: isDetailed ? `Senior ${username.includes('Engineer') ? 'Software Engineer' : 'Marketer'} at Placeholder Solutions` : '',
    profileUrl: isDetailed ? `https://www.linkedin.com/in/${username.toLowerCase().replace(/\s+/g, '-')}`: '',
    firstName: username.split(' ')[0] || 'Alex',
    lastName: username.split(' ').slice(1).join(' ') || 'Smith',
    email: isDetailed ? `${username.toLowerCase().replace(/\s+/g, '.')}@example.com` : null,
    profilePictureUrl: `https://picsum.photos/seed/${username}/200/200`
  };
}

/**
 * Interface for OAuth configuration.
 */
export interface OAuthConfiguration {
  clientId: string;
  clientSecret: string; // This should only be used server-side
  redirectUri: string;
}

/**
 * Returns OAuth configuration.
 * Client ID and Redirect URI are public, Client Secret is server-side only.
 */
export async function getLinkedInOAuthConfig(): Promise<OAuthConfiguration> {
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '78390mtb4x6bnd';
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || 'WPL_AP1.oLC30bEBnic3YUVE.1vCHkQ==';
  const redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || 
                      (typeof window !== 'undefined' ? `${window.location.origin}/auth/linkedin/callback` : 'https://outreachai-7bkh0.web.app/auth/linkedin/callback');

  if (!clientId || !redirectUri) {
    console.error('LinkedIn OAuth configuration is incomplete (Client ID or Redirect URI missing). Check environment variables: NEXT_PUBLIC_LINKEDIN_CLIENT_ID, NEXT_PUBLIC_LINKEDIN_REDIRECT_URI');
    throw new Error('LinkedIn OAuth configuration is incomplete (Client ID or Redirect URI missing).');
  }
   if (!clientSecret && typeof window === 'undefined') { 
    console.warn('LinkedIn Client Secret is missing. Ensure LINKEDIN_CLIENT_SECRET is set in server environment variables. This is required for token exchange.');
  }

  return {
    clientId,
    clientSecret: clientSecret || '', 
    redirectUri,
  };
}


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


/**
 * Fetches LinkedIn profile data using an access token.
 * @param accessToken The LinkedIn access token.
 * @returns A promise that resolves to LinkedInProfile data.
 */
export async function getLinkedInProfileByToken(accessToken: string): Promise<LinkedInProfile> {
  console.log("Attempting to fetch LinkedIn profile with token:", accessToken.substring(0,10) + "...");
  
  try {
    const profileApiUrl = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline(localized,preferredLocale))';
    const profileResponse = await axios.get<LinkedInProfileAPIResponse>(profileApiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', 
        'LinkedIn-Version': '202401', // Use a recent, stable API version
      },
    });
    const profileData = profileResponse.data;

    const emailApiUrl = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
    const emailResponse = await axios.get<LinkedInEmailAPIResponse>(emailApiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202401',
      },
    });
    const email = emailResponse.data.elements?.[0]?.['handle~']?.emailAddress || null;
    
    const profileUrl = `https://www.linkedin.com/in/${profileData.id}`; 
    
    let profilePictureUrl: string | null = null;
    const pictureElements = profileData.profilePicture?.['displayImage~']?.elements;
    if (pictureElements && pictureElements.length > 0) {
        const preferredIdentifier = pictureElements[0].identifiers?.find(id => id.mediaType === 'image/png') || pictureElements[0].identifiers?.[0];
        profilePictureUrl = preferredIdentifier?.identifier || pictureElements[0].artifact || null;
    }

    return {
      id: profileData.id,
      firstName: profileData.firstName?.localized?.[profileData.firstName?.preferredLocale?.language + '_' + profileData.firstName?.preferredLocale?.country || 'en_US'] || Object.values(profileData.firstName?.localized || {})[0] || '',
      lastName: profileData.lastName?.localized?.[profileData.lastName?.preferredLocale?.language + '_' + profileData.lastName?.preferredLocale?.country || 'en_US'] || Object.values(profileData.lastName?.localized || {})[0] || '',
      headline: profileData.headline?.localized?.[profileData.headline?.preferredLocale?.language + '_' + profileData.headline?.preferredLocale?.country || 'en_US'] || Object.values(profileData.headline?.localized || {})[0] || 'N/A',
      profileUrl: profileUrl,
      email: email,
      profilePictureUrl: profilePictureUrl,
    };

  } catch (error: any) {
    console.error("Error fetching LinkedIn profile by token:", error.response?.data || error.message);
    if (axios.isAxiosError(error) && error.response) {
        throw new Error(`LinkedIn API error (${error.response.status}): ${error.response.data?.message || error.message}`);
    }
    throw new Error(`Failed to fetch LinkedIn profile: ${error.message}`);
  }
}

/**
 * Sends a LinkedIn message using the UGS (Unified Messaging Service) API.
 * IMPORTANT: This is a complex API. This function provides a structured attempt
 * but WILL LIKELY REQUIRE ADJUSTMENTS based on specific LinkedIn partnership approvals
 * and the exact UGS API version and event types you are permitted to use.
 * @param recipientUrn The URN of the recipient member (e.g., urn:li:person:xxxx).
 * @param messageText The text of the message to send.
 * @param accessToken The OAuth access token for authentication.
 * @returns A promise that resolves with the API response.
 */
export async function sendLinkedInMessage(recipientUrn: string, messageText: string, accessToken: string): Promise<{success: boolean; data?: any; error?: string}> {
  console.log(`Attempting to send LinkedIn message to ${recipientUrn} using token ${accessToken.substring(0,5)}...`);
  
  const sendMessageApiUrl = `https://api.linkedin.com/v2/messages`; // Common endpoint for UGS

  try {
    // This request body structure is based on common UGS patterns but needs verification
    // with LinkedIn's official documentation for the specific UGS event type you are using.
    const requestBody = {
      "recipients": [recipientUrn],
      "message": {
        "body": {
          "text": messageText
        },
        // "renderContent": { // Optional: for rich content like cards
        //   "com.linkedin.voyager.messaging.render.ነባርRenderableMessage": {
        //     "renderableUrns": [] 
        //   }
        // }
      },
      // You might need to specify `origin` or other context fields
      // "originToken": "YOUR_ORIGIN_TOKEN_IF_APPLICABLE" 
    };

    const response = await axios.post(sendMessageApiUrl, requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', 
        'LinkedIn-Version': '202403', // Use a very recent API version for UGS
        'Content-Type': 'application/json'
      }
    });
    console.log("LinkedIn message sent successfully via UGS:", response.data);
    // The actual ID or confirmation might be in a different part of the response,
    // e.g., a location header or a specific ID field.
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error sending LinkedIn message via UGS:", error.response?.data || error.message);
     if (axios.isAxiosError(error) && error.response) {
        return { success: false, error: `LinkedIn UGS API error (${error.response.status}): ${error.response.data?.message || error.message}` };
    }
    return { success: false, error: `Failed to send LinkedIn message via UGS: ${error.message}` };
  }
}


interface LinkedInMessageAPI {
  id: string;
  sender?: string; // URN of the sender, e.g., "urn:li:person:xxxx"
  body?: { text?: string };
  message?: { body?: {text?: string}}; // UGS API structure varies
  eventContent?: { // Another common UGS structure
    "com.linkedin.voyager.messaging.event.MessageEvent"?: {
      attributedBody?: { text?: string };
      body?: string; 
      subject?: string;
    }
  };
  from?: { // Common for UGS
    "com.linkedin.voyager.messaging.MessagingMember": {
      miniProfile: {
        objectUrn: string; // Sender URN
      }
    }
  };
  createdAt?: number; // Timestamp
  timestamp?: number; // Alias for createdAt
}

interface LinkedInConversationEventAPI {
  elements: LinkedInMessageAPI[];
  // Other metadata fields
}

/**
 * Fetches LinkedIn messages for a given conversation URN.
 * This is a best-effort implementation and assumes a common UGS API pattern.
 * @param conversationUrn The URN of the conversation (e.g., urn:li:fs_conversation:...).
 * @param accessToken The OAuth access token.
 * @param count Number of messages to fetch.
 * @param createdBeforeTimestamp Optional timestamp to fetch messages created before this point.
 * @returns A promise that resolves to an array of message objects.
 */
export async function fetchLinkedInMessages(
  conversationUrn: string, 
  accessToken: string,
  count: number = 20,
  createdBeforeTimestamp?: number
): Promise<{success: boolean; messages?: { id: string; senderUrn: string; text: string; timestamp: number; }[]; error?: string; rawData?: any}> {
  console.log(`Attempting to fetch messages for LinkedIn conversation ${conversationUrn} using token ${accessToken.substring(0,5)}...`);
  
  // Common endpoint for fetching conversation events.
  // Parameters might include `q=participants`, `types=MESSAGE`, etc.
  let fetchMessagesApiUrl = `https://api.linkedin.com/v2/conversations/${conversationUrn}/events?count=${count}`;
  if (createdBeforeTimestamp) {
    fetchMessagesApiUrl += `&createdBefore=${createdBeforeTimestamp}`;
  }

  try {
    const response = await axios.get<LinkedInConversationEventAPI>(fetchMessagesApiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', 
        'LinkedIn-Version': '202403', 
        'Content-Type': 'application/json'
      }
    });

    const messages = response.data.elements?.map((event: LinkedInMessageAPI) => {
        const messageEvent = event.eventContent?.["com.linkedin.voyager.messaging.event.MessageEvent"];
        const text = messageEvent?.attributedBody?.text || messageEvent?.body || event.body?.text || event.message?.body?.text || "";
        const senderUrn = event.from?.["com.linkedin.voyager.messaging.MessagingMember"]?.miniProfile?.objectUrn || event.sender || 'unknown-sender';
        return {
            id: event.id || `msg_${Math.random().toString(36).substr(2, 9)}`,
            senderUrn: senderUrn,
            text: text,
            timestamp: event.createdAt || event.timestamp || Date.now(),
        };
    }).filter(msg => msg.text); // Filter out events that aren't parseable messages

    console.log("LinkedIn messages fetched successfully:", messages?.length || 0);
    return { success: true, messages, rawData: response.data };

  } catch (error: any) {
    console.error("Error fetching LinkedIn messages:", error.response?.data || error.message);
    if (axios.isAxiosError(error) && error.response) {
        return { success: false, error: `LinkedIn API error (${error.response.status}): ${error.response.data?.message || error.message}` };
    }
    return { success: false, error: `Failed to fetch LinkedIn messages: ${error.message}` };
  }
}
