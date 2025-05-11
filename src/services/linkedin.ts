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
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '78390mtb4x6bnd'; // Public
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || 'WPL_AP1.oLC30bEBnic3YUVE.1vCHkQ=='; // Server-side secret
  const redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || 
                      (typeof window !== 'undefined' ? `${window.location.origin}/auth/linkedin/callback` : 'https://convospan.ai/auth/linkedin/callback'); // Public

  if (!clientId || !redirectUri) { // Client secret checked server-side
    console.error('LinkedIn OAuth configuration is incomplete (Client ID or Redirect URI missing). Check environment variables: NEXT_PUBLIC_LINKEDIN_CLIENT_ID, NEXT_PUBLIC_LINKEDIN_REDIRECT_URI');
    throw new Error('LinkedIn OAuth configuration is incomplete (Client ID or Redirect URI missing).');
  }
   if (!clientSecret && typeof window === 'undefined') { // Check for client secret only on server
    console.error('LinkedIn Client Secret is missing. Ensure LINKEDIN_CLIENT_SECRET is set in server environment variables.');
    // Not throwing error here as this function might be called client-side where secret isn't needed.
    // The API route (/api/linkedin/exchange-token) MUST check for clientSecret.
  }


  return {
    clientId,
    clientSecret, // Will be empty string on client, actual value on server
    redirectUri,
  };
}


/**
 * Fetches LinkedIn profile data using an access token.
 * @param accessToken The LinkedIn access token.
 * @returns A promise that resolves to LinkedInProfile data.
 */
export async function getLinkedInProfileByToken(accessToken: string): Promise<LinkedInProfile> {
  // IMPORTANT: This is a conceptual example. You need to use the correct LinkedIn API endpoint and structure.
  // Common endpoints:
  // - https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline)
  // - https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))
  console.log("Attempting to fetch LinkedIn profile with token (conceptual):", accessToken.substring(0,10) + "...");
  
  // Placeholder for actual API call using axios or fetch
  // Example structure (you'll need to adapt this based on LinkedIn's actual API)
  /*
  try {
    const response = await axios.get('https://api.linkedin.com/v2/me', { // Replace with correct endpoint
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', // Often required by LinkedIn
        'LinkedIn-Version': '202308' // Specify API version
      }
    });
    // Transform response.data into LinkedInProfile structure
    return {
      id: response.data.id,
      firstName: response.data.firstName?.localized?.en_US, // Example, adjust to actual structure
      lastName: response.data.lastName?.localized?.en_US,
      headline: response.data.headline?.localized?.en_US,
      profileUrl: `https://www.linkedin.com/in/${response.data.id}`, // Construct if not directly available
      // ... fetch email and profile picture separately if needed
    };
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error);
    throw error; // Re-throw to be handled by caller
  }
  */

  // Returning mock data for now:
  return {
    id: "mocked-linkedin-user-id-from-token",
    firstName: "MockedTokenFirst",
    lastName: "MockedTokenLast",
    headline: "Mocked Professional Headline from Token",
    profileUrl: "https://www.linkedin.com/in/mockedprofiletoken",
    email: "mocked.token.user@example.com",
    profilePictureUrl: "https://picsum.photos/seed/token/200"
  };
}

/**
 * Sends a LinkedIn message.
 * @param profileId The ID of the LinkedIn profile to send the message to (URN format, e.g., urn:li:person:xxxx).
 * @param message The message content.
 * @param accessToken The OAuth access token for authentication.
 * @returns A promise that resolves when the message is sent (or simulates sending).
 */
export async function sendLinkedInMessage(profileId: string, message: string, accessToken: string): Promise<{success: boolean; messageId?: string; error?: string}> {
  console.log(`Simulating sending LinkedIn message to profile URN ${profileId}: "${message.substring(0, 50)}..." using token ${accessToken.substring(0,5)}...`);
  // IMPORTANT: This is a conceptual example. LinkedIn's messaging API (UGS) is complex.
  // You'd typically POST to an endpoint like /rest/messages with a specific request body.
  /*
  try {
    const response = await axios.post('https://api.linkedin.com/rest/messages', { // Replace with correct UGS endpoint
      recipients: [`urn:li:person:${profileId}`], // Or appropriate URN format
      message: {
        body: {
          text: message
        }
      }
      // ... other required fields for UGS
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202308',
        'Content-Type': 'application/json'
      }
    });
    return { success: true, messageId: response.data.id }; // Adapt to actual response
  } catch (error) {
    console.error("Error sending LinkedIn message:", error);
    return { success: false, error: error.message || "Failed to send message" };
  }
  */
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return { success: true, messageId: `sim_msg_${Date.now()}` };
}

interface LinkedInMessage {
  id: string;
  sender: 'user' | 'prospect'; 
  text: string;
  timestamp: Date;
}
export async function fetchLinkedInMessages(profileId: string, accessToken: string, sinceTimestamp?: number): Promise<LinkedInMessage[]> {
  console.log(`Simulating fetching LinkedIn messages for profile ${profileId} using token ${accessToken.substring(0,5)}...`);
  // IMPORTANT: This is conceptual. Fetching messages requires complex API calls to LinkedIn UGS.
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!sinceTimestamp) { 
    return [];
  }
  return [];
}
