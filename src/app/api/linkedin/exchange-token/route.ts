'use server';

import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';
import {getLinkedInOAuthConfig} from '@/services/linkedin';

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token?: string; 
}

interface LinkedInProfileResponse {
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
      elements: {
        identifiers: {identifier: string}[];
      }[];
    };
  };
  headline?: { 
    localized: {[key: string]: string};
    preferredLocale: {country: string; language: string};
  };
}

interface LinkedInEmailResponse {
  elements: {
    'handle~': {
      emailAddress: string;
    };
    handle: string;
  }[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {code, state: receivedState} = body;

    if (!code) {
      return NextResponse.json({error: 'Authorization code is missing'}, {status: 400});
    }

    // Fetch OAuth config. getLinkedInOAuthConfig() should now ensure clientSecret is only available server-side.
    const oauthConfig = await getLinkedInOAuthConfig(); 

    if (!oauthConfig.clientSecret) {
      // This check is crucial because clientSecret is required for token exchange.
      console.error('LINKEDIN_CLIENT_SECRET is not configured on the server.');
      return NextResponse.json({ error: 'Server configuration error: LinkedIn client secret missing.' }, { status: 500 });
    }

    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code as string);
    params.append('redirect_uri', oauthConfig.redirectUri); 
    params.append('client_id', oauthConfig.clientId);
    params.append('client_secret', oauthConfig.clientSecret); // Now using the server-side secret

    let accessToken: string;
    try {
      const tokenResponse = await axios.post<LinkedInTokenResponse>(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      accessToken = tokenResponse.data.access_token;
    } catch (tokenError: any) {
      console.error('Error exchanging LinkedIn code for token:', tokenError.response?.data || tokenError.message);
      const errorMessage = tokenError.response?.data?.error_description || tokenError.response?.data?.error || tokenError.message || 'Failed to exchange authorization code with LinkedIn.';
      const status = tokenError.response?.status || 500;
      return NextResponse.json({error: errorMessage, details: tokenError.response?.data }, {status});
    }
    
    let userProfile: any = {};
    try {
      // Using projection to request specific fields to minimize data transfer and adhere to best practices
      const profileApiUrl = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline(localized,preferredLocale))';
      const profileDataResponse = await axios.get<LinkedInProfileResponse>(profileApiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0', 
          'LinkedIn-Version': '202308', // Using a recent, stable API version
        },
      });

      const emailApiUrl = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
      const emailDataResponse = await axios.get<LinkedInEmailResponse>(emailApiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': '202308',
        },
      });
      
      const email = emailDataResponse.data.elements?.[0]?.['handle~']?.emailAddress || null;

      userProfile = {
        id: profileDataResponse.data.id,
        firstName: profileDataResponse.data.firstName?.localized?.[profileDataResponse.data.firstName?.preferredLocale.language] || '',
        lastName: profileDataResponse.data.lastName?.localized?.[profileDataResponse.data.lastName?.preferredLocale.language] || '',
        headline: profileDataResponse.data.headline?.localized?.[profileDataResponse.data.headline?.preferredLocale.language] || 'N/A',
        profilePictureUrl: profileDataResponse.data.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier || null,
        email: email,
      };

    } catch (profileError: any) {
      console.error('Error fetching LinkedIn profile data:', profileError.response?.data || profileError.message);
      const errorMessage = profileError.response?.data?.message || profileError.message || 'Failed to fetch profile data from LinkedIn.';
      const status = profileError.response?.status || 500;
      return NextResponse.json({error: errorMessage, details: profileError.response?.data }, {status});
    }

    // TODO: Store the accessToken and profileData securely, associated with the user's session/account
    // For example, update user document in Firestore with LinkedIn ID, access token (encrypted), etc.
    // This part is application-specific.

    return NextResponse.json({profile: userProfile, accessToken}, {status: 200});

  } catch (error: any) {
    console.error('General error in LinkedIn callback handler:', error.message);
    return NextResponse.json({error: 'An unexpected error occurred during LinkedIn authentication.', details: error.message }, {status: 500});
  }
}
