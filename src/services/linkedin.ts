
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

import axios, { AxiosError } from 'axios';


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
  const redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    const errorMsg = 'LinkedIn OAuth configuration is incomplete (Client ID or Redirect URI missing). Check environment variables: NEXT_PUBLIC_LINKEDIN_CLIENT_ID, NEXT_PUBLIC_LINKEDIN_REDIRECT_URI';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
   if (!clientSecret && typeof window === 'undefined') {
    console.warn('LinkedIn Client Secret is missing. Ensure LINKEDIN_CLIENT_SECRET is set in server environment variables. This is required for token exchange.');
    // Not throwing error here as clientSecret might not be needed client-side for initial redirect
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
  console.log("Attempting to fetch LinkedIn profile with token:", accessToken ? accessToken.substring(0,10) + "..." : "Token Undefined");
  if (!accessToken) {
    throw new Error("LinkedIn access token is missing.");
  }

  try {
    // Projection for basic profile info + headline and profile picture
    const profileApiUrl = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline(localized,preferredLocale))';
    const profileResponse = await axios.get<LinkedInProfileAPIResponse>(profileApiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202403', // Use a recent, stable API version
      },
    });
    const profileData = profileResponse.data;

    const emailApiUrl = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
    let email: string | null = null;
    try {
      const emailResponse = await axios.get<LinkedInEmailAPIResponse>(emailApiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': '202403',
        },
      });
      email = emailResponse.data.elements?.[0]?.['handle~']?.emailAddress || null;
    } catch (emailError: any) {
        console.warn("Could not fetch LinkedIn email, or user hasn't granted permission. Error:", emailError.response?.data?.message || emailError.message);
        // Proceed without email if it fails, as it's a common permission issue.
    }

    const profileUrl = `https://www.linkedin.com/in/${profileData.id}`;

    let profilePictureUrl: string | null = null;
    const pictureElements = profileData.profilePicture?.['displayImage~']?.elements;
    if (pictureElements && pictureElements.length > 0) {
        // Prefer PNG, then highest resolution available (often the last element in identifiers)
        const preferredIdentifier =
            pictureElements[0].identifiers?.find(id => id.mediaType === 'image/png') ||
            pictureElements[0].identifiers?.[pictureElements[0].identifiers.length - 1] ||
            pictureElements[0].identifiers?.[0];
        profilePictureUrl = preferredIdentifier?.identifier || pictureElements[0].artifact || null;
    }

    return {
      id: profileData.id,
      firstName: profileData.firstName?.localized?.[`${profileData.firstName.preferredLocale.language}_${profileData.firstName.preferredLocale.country}`] || Object.values(profileData.firstName?.localized || {})[0] || '',
      lastName: profileData.lastName?.localized?.[`${profileData.lastName.preferredLocale.language}_${profileData.lastName.preferredLocale.country}`] || Object.values(profileData.lastName?.localized || {})[0] || '',
      headline: profileData.headline?.localized?.[`${profileData.headline.preferredLocale.language}_${profileData.headline.preferredLocale.country}`] || Object.values(profileData.headline?.localized || {})[0] || 'N/A',
      profileUrl: profileUrl,
      email: email,
      profilePictureUrl: profilePictureUrl,
    };

  } catch (error: any) {
    console.error("Error fetching LinkedIn profile by token:", error.response?.data || error.message);
    if (axios.isAxiosError(error) && error.response) {
        const err = error as AxiosError<any>;
        throw new Error(`LinkedIn API error (${err.response?.status}): ${err.response?.data?.message || err.message}`);
    }
    throw new Error(`Failed to fetch LinkedIn profile: ${error.message}`);
  }
}

/**
 * Sends a LinkedIn message using the UGS (Unified Messaging Service) API.
 * IMPORTANT: This is a complex API. Requires specific LinkedIn partnership approvals
 * and adherence to the exact UGS API version and event types.
 * @param recipientUrn The URN of the recipient member (e.g., urn:li:person:xxxx).
 * @param messageText The text of the message to send.
 * @param accessToken The OAuth access token for authentication.
 * @returns A promise that resolves with the API response.
 */
export async function sendLinkedInMessage(recipientUrn: string, messageText: string, accessToken: string): Promise<{success: boolean; data?: any; error?: string}> {
  console.log(`Attempting to send LinkedIn message to ${recipientUrn} using token ${accessToken ? accessToken.substring(0,5) : "UNDEFINED_TOKEN"}...`);
  if (!accessToken) {
    return { success: false, error: "LinkedIn access token is missing for sending message." };
  }
  if (!recipientUrn.startsWith("urn:li:person:")) {
     return { success: false, error: "Invalid recipient URN format for LinkedIn message." };
  }

  const sendMessageApiUrl = `https://api.linkedin.com/rest/messages`; // Common UGS endpoint, but check specific API docs

  try {
    // This request body structure is based on common UGS patterns.
    // You MUST verify this with LinkedIn's official documentation for the specific UGS event type.
    // Common event type: com.linkedin.voyager.messaging.create.MessageCreate
    const requestBody = {
        "message": {
            "body": {
                "attributes": [],
                "text": messageText
            }
        },
        "recipients": [recipientUrn],
        // "subtype": "MEMBER_TO_MEMBER" // May be required
        // "originToken": "YOUR_ORIGIN_TOKEN_IF_APPLICABLE" // May be required for certain integrations
    };

    // Alternative structure sometimes seen for older or different UGS endpoints:
    // const requestBody = {
    //   "recipients": [recipientUrn],
    //   "eventCreate": {
    //     "value": {
    //       "com.linkedin.voyager.messaging.create.MessageCreate": {
    //         "attributedBody": { "text": messageText, "attributes": [] },
    //         // "trackingId": "YOUR_UNIQUE_TRACKING_ID" // Recommended for idempotency
    //       }
    //     }
    //   }
    // };

    const response = await axios.post(sendMessageApiUrl, requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', // Or other required version
        'LinkedIn-Version': '202403', // Use a recent API version, subject to change
        'Content-Type': 'application/json',
        // 'X-RestLi-Method': 'action', // Sometimes needed for specific actions like 'create' or 'batch_create'
        // 'action': 'create', // If using an action-based endpoint
      }
    });

    // Successful response from LinkedIn UGS typically returns a 201 Created
    // and may include the message URN or conversation URN in headers or body.
    const messageUrn = response.headers['x-restli-id'] || response.data?.id || response.data?.value?.message || `sim_msg_${Date.now()}`;
    console.log("LinkedIn message sent successfully via UGS. Message URN/ID:", messageUrn);
    return { success: true, data: { messageUrn, ...response.data } };

  } catch (error: any) {
    console.error("Error sending LinkedIn message via UGS:", error.response?.data || error.message);
     if (axios.isAxiosError(error) && error.response) {
        const err = error as AxiosError<any>;
        return { success: false, error: `LinkedIn UGS API error (${err.response?.status}): ${err.response?.data?.message || err.message}` };
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
  conversationUrn: string, // This should be the URN of the conversation, NOT the profile ID/URN
  accessToken: string,
  count: number = 20,
  createdBeforeTimestamp?: number
): Promise<{success: boolean; messages?: { id: string; senderUrn: string; text: string; timestamp: number; }[]; error?: string; rawData?: any}> {
  console.log(`Attempting to fetch messages for LinkedIn conversation ${conversationUrn} using token ${accessToken ? accessToken.substring(0,5) : "UNDEFINED_TOKEN"}...`);
  if (!accessToken) {
    return { success: false, error: "LinkedIn access token is missing for fetching messages." };
  }
  if (!conversationUrn || !conversationUrn.startsWith("urn:li:fs_conversation:")) {
    // This URN is usually obtained after sending/receiving the first message.
    // Or by querying conversations: GET /rest/conversations?q=participants&participants={myUrn}&participants={otherMemberUrn}
    console.warn(`Invalid conversationUrn: ${conversationUrn}. Fetching messages requires a valid conversation URN.`);
    // For now, we'll return a simulated empty response or error
    // In a real app, you'd need to first establish or find the conversation URN.
    // This might involve a separate API call if you only have the member's URN.
    // For this placeholder, we'll simulate not finding the conversation.
    return { success: true, messages: [], rawData: { elements: []}, error: "Conversation URN not yet established or invalid." };
  }


  let fetchMessagesApiUrl = `https://api.linkedin.com/rest/conversations/${conversationUrn}/events?count=${count}`;
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
        const err = error as AxiosError<any>;
        return { success: false, error: `LinkedIn API error (${err.response?.status}): ${err.response?.data?.message || err.message}` };
    }
    return { success: false, error: `Failed to fetch LinkedIn messages: ${error.message}` };
  }
}

    