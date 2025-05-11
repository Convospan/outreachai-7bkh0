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
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || 
                      (typeof window !== 'undefined' ? `${window.location.origin}/auth/linkedin/callback` : 'https://outreachai-7bkh0.web.app/auth/linkedin/callback');

  if (!clientId || !redirectUri) {
    console.error('LinkedIn OAuth configuration is incomplete (Client ID or Redirect URI missing). Check environment variables: NEXT_PUBLIC_LINKEDIN_CLIENT_ID, NEXT_PUBLIC_LINKEDIN_REDIRECT_URI');
    throw new Error('LinkedIn OAuth configuration is incomplete (Client ID or Redirect URI missing).');
  }
   if (!clientSecret && typeof window === 'undefined') { 
    console.error('LinkedIn Client Secret is missing. Ensure LINKEDIN_CLIENT_SECRET is set in server environment variables.');
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
        identifiers: Array<{identifier: string}>;
        artifact?: string; // Can also be used for full image URL
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
    // Fetch basic profile data
    const profileApiUrl = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline(localized,preferredLocale))';
    const profileResponse = await axios.get<LinkedInProfileAPIResponse>(profileApiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', 
        'LinkedIn-Version': '202308', // Use a recent, stable API version
      },
    });
    const profileData = profileResponse.data;

    // Fetch email address
    const emailApiUrl = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
    const emailResponse = await axios.get<LinkedInEmailAPIResponse>(emailApiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202308',
      },
    });
    const email = emailResponse.data.elements?.[0]?.['handle~']?.emailAddress || null;
    
    // Construct the profile URL (usually you construct this from the ID or it might be available in other endpoints)
    const profileUrl = `https://www.linkedin.com/in/${profileData.id}`; 
    
    // Extract profile picture URL - LinkedIn API for profile pictures can be tricky.
    // The 'displayImage~' object often contains multiple sizes.
    // The 'artifact' field or an element in 'identifiers' might provide the full URL.
    // This is a common way to try and get it, but may need adjustment based on actual response.
    let profilePictureUrl: string | null = null;
    const pictureElements = profileData.profilePicture?.['displayImage~']?.elements;
    if (pictureElements && pictureElements.length > 0) {
        // Prefer 'artifact' if available as it's often the direct image URL
        if (pictureElements[0].artifact) {
            profilePictureUrl = pictureElements[0].artifact;
        } else if (pictureElements[0].identifiers && pictureElements[0].identifiers.length > 0) {
            profilePictureUrl = pictureElements[0].identifiers[0].identifier;
        }
    }


    return {
      id: profileData.id,
      firstName: profileData.firstName?.localized?.[profileData.firstName?.preferredLocale.language || 'en_US'] || '',
      lastName: profileData.lastName?.localized?.[profileData.lastName?.preferredLocale.language || 'en_US'] || '',
      headline: profileData.headline?.localized?.[profileData.headline?.preferredLocale.language || 'en_US'] || 'N/A',
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
 * Sends a LinkedIn message.
 * IMPORTANT: LinkedIn's UGS (Unified Messaging Service) API is complex and requires specific approvals and setup.
 * This function provides a conceptual placeholder for how such an API call might be structured.
 * You'll need to consult LinkedIn's official UGS documentation for the correct endpoints and request bodies.
 * @param conversationUrn The URN of the conversation to send the message to (e.g., urn:li:fs_conversation:...).
 * @param message The message content object (structure depends on UGS API).
 * @param accessToken The OAuth access token for authentication.
 * @returns A promise that resolves with the API response.
 */
export async function sendLinkedInMessage(conversationUrn: string, message: object, accessToken: string): Promise<{success: boolean; data?: any; error?: string}> {
  console.log(`Attempting to send LinkedIn message to conversation ${conversationUrn} using token ${accessToken.substring(0,5)}...`);
  
  // Hypothetical endpoint and request body. Replace with actual LinkedIn UGS API details.
  const sendMessageApiUrl = `https://api.linkedin.com/rest/messages`; // Or /rest/conversations/{conversationUrn}/events

  try {
    const response = await axios.post(sendMessageApiUrl, {
      // Example UGS message body structure - THIS WILL LIKELY NEED TO CHANGE
      // Based on actual LinkedIn UGS API.
      "message": {
        "body": {
          "text": (message as any).text // Assuming message object has a text property
        }
      },
      "recipients": [
        conversationUrn // Or the participant URNs within a conversation
      ],
      // Other UGS specific fields like `originUrn`, `conversationContext` might be needed.
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', // Or specific version for UGS
        'LinkedIn-Version': '202401', // Use the latest relevant API version for UGS
        'Content-Type': 'application/json'
      }
    });
    console.log("LinkedIn message sent successfully:", response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error sending LinkedIn message:", error.response?.data || error.message);
     if (axios.isAxiosError(error) && error.response) {
        return { success: false, error: `LinkedIn API error (${error.response.status}): ${error.response.data?.message || error.message}` };
    }
    return { success: false, error: `Failed to send LinkedIn message: ${error.message}` };
  }
}

interface LinkedInMessage {
  id: string;
  senderUrn: string; // URN of the sender
  text?: string; // Message text might be nested
  timestamp: number; // Unix timestamp
  // Other fields based on UGS event types
}
interface LinkedInConversationEvent {
    "*elements": Array<{ // This structure can vary significantly
        eventContent?: {
            "com.linkedin.voyager.messaging.event.MessageEvent"?: {
                attributedBody?: { text?: string };
                body?: string; // Simpler structure
                subject?: string;
            }
        };
        from?: {
            "com.linkedin.voyager.messaging.MessagingMember": {
                miniProfile: {
                    objectUrn: string; // Sender URN
                    firstName: string;
                    lastName: string;
                }
            }
        };
        id?: string;
        createdAt?: number; // Timestamp
    }>;
    // Other metadata fields
}


/**
 * Fetches LinkedIn messages for a given conversation URN.
 * IMPORTANT: This is a conceptual placeholder. You'll need to use the correct LinkedIn UGS API endpoints.
 * @param conversationUrn The URN of the conversation.
 * @param accessToken The OAuth access token.
 * @param count Number of messages to fetch.
 * @param createdBeforeTimestamp Optional timestamp to fetch messages created before this point (for pagination).
 * @returns A promise that resolves to an array of LinkedInMessage objects.
 */
export async function fetchLinkedInMessages(
  conversationUrn: string, 
  accessToken: string,
  count: number = 20,
  createdBeforeTimestamp?: number
): Promise<{success: boolean; messages?: LinkedInMessage[]; error?: string; rawData?: any}> {
  console.log(`Attempting to fetch messages for LinkedIn conversation ${conversationUrn} using token ${accessToken.substring(0,5)}...`);
  
  // Hypothetical endpoint. Replace with actual LinkedIn UGS API details.
  // Example: /rest/conversations/{conversationUrn}/events?q=messages&eventTypes=List(com.linkedin.voyager.messaging.event.MessageEvent)
  let fetchMessagesApiUrl = `https://api.linkedin.com/rest/conversations/${conversationUrn}/events?q=byConversation&eventTypes=List(com.linkedin.voyager.messaging.event.MessageEvent)&count=${count}`;
  if (createdBeforeTimestamp) {
    fetchMessagesApiUrl += `&createdBefore=${createdBeforeTimestamp}`;
  }

  try {
    const response = await axios.get<LinkedInConversationEvent>(fetchMessagesApiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', 
        'LinkedIn-Version': '202401', 
        'Content-Type': 'application/json'
      }
    });

    // Transform response.data.elements into LinkedInMessage[] structure
    // This is highly dependent on the actual API response structure from LinkedIn UGS
    const messages: LinkedInMessage[] = (response.data["*elements"] || []).map((event: any) => {
        const messageEvent = event.eventContent?.["com.linkedin.voyager.messaging.event.MessageEvent"];
        return {
            id: event.id || `sim_msg_${Math.random()}`,
            senderUrn: event.from?.["com.linkedin.voyager.messaging.MessagingMember"]?.miniProfile?.objectUrn || 'unknown-sender',
            text: messageEvent?.attributedBody?.text || messageEvent?.body || "No text content",
            timestamp: event.createdAt || Date.now(),
        };
    }).filter(msg => msg.id && msg.timestamp); // Basic validation

    console.log("LinkedIn messages fetched successfully:", messages.length > 0 ? messages[0] : "No messages found/parsed.");
    return { success: true, messages, rawData: response.data };

  } catch (error: any) {
    console.error("Error fetching LinkedIn messages:", error.response?.data || error.message);
    if (axios.isAxiosError(error) && error.response) {
        return { success: false, error: `LinkedIn API error (${error.response.status}): ${error.response.data?.message || error.message}` };
    }
    return { success: false, error: `Failed to fetch LinkedIn messages: ${error.message}` };
  }
}

```
    </content>
  </change>
  <change>
    <file>src/app/api/linkedin/exchange-token/route.ts</file>
    <description>Updated the LinkedIn token exchange route to use the enhanced `getLinkedInProfileByToken` service function for fetching profile data. Improved error handling and logging for robustness during the OAuth callback and profile data retrieval process.</description>
    <content><![CDATA[
'use server';

import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';
import {getLinkedInOAuthConfig, getLinkedInProfileByToken} from '@/services/linkedin'; // Using getLinkedInProfileByToken

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token?: string; 
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {code, state: receivedState} = body; // Assuming state might be used for CSRF

    if (!code) {
      return NextResponse.json({error: 'Authorization code is missing'}, {status: 400});
    }

    const oauthConfig = await getLinkedInOAuthConfig(); 

    if (!oauthConfig.clientSecret) {
      console.error('LINKEDIN_CLIENT_SECRET is not configured on the server.');
      return NextResponse.json({ error: 'Server configuration error: LinkedIn client secret missing.' }, { status: 500 });
    }

    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code as string);
    params.append('redirect_uri', oauthConfig.redirectUri); 
    params.append('client_id', oauthConfig.clientId);
    params.append('client_secret', oauthConfig.clientSecret);

    let accessToken: string;
    try {
      const tokenResponse = await axios.post<LinkedInTokenResponse>(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      accessToken = tokenResponse.data.access_token;
      console.log("LinkedIn Access Token obtained successfully.");
    } catch (tokenError: any) {
      console.error('Error exchanging LinkedIn code for token:', tokenError.response?.data || tokenError.message);
      const errorMessage = tokenError.response?.data?.error_description || tokenError.response?.data?.error || tokenError.message || 'Failed to exchange authorization code with LinkedIn.';
      const status = tokenError.response?.status || 500;
      return NextResponse.json({error: errorMessage, details: tokenError.response?.data }, {status});
    }
    
    let userProfile: any;
    try {
      // Use the service function to get profile data
      userProfile = await getLinkedInProfileByToken(accessToken);
      console.log("LinkedIn User Profile fetched successfully:", userProfile);
    } catch (profileError: any) {
      console.error('Error fetching LinkedIn profile data using service:', profileError.message);
      // profileError might already be an Error instance from the service
      const errorMessage = profileError.message || 'Failed to fetch profile data from LinkedIn.';
      // Status might not be available if it's a generic error from the service
      const status = (profileError.isAxiosError && profileError.response?.status) || 500;
      return NextResponse.json({error: errorMessage, details: (profileError.isAxiosError && profileError.response?.data) || profileError.toString() }, {status});
    }

    // TODO: Store the accessToken and profileData securely, associated with the user's session/account
    // This part is application-specific. For example, update user document in Firestore.
    // e.g., await db.collection('users').doc(auth.userId).update({ linkedInAccessToken: accessToken, linkedInProfile: userProfile });

    return NextResponse.json({profile: userProfile, accessToken}, {status: 200});

  } catch (error: any) {
    console.error('General error in LinkedIn callback handler:', error.message);
    return NextResponse.json({error: 'An unexpected error occurred during LinkedIn authentication.', details: error.message }, {status: 500});
  }
}

