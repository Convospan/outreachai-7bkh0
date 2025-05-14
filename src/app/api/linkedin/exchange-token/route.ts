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
