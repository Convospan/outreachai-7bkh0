'use server';

import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';
import {getLinkedInOAuthConfig} from '@/services/linkedin';

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token?: string; // If OpenID Connect scopes are used
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
  headline?: { // Added for r_liteprofile consistency
    localized: {[key: string]: string};
    preferredLocale: {country: string; language: string};
  };
  // Add other fields as needed based on scopes
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

    // Optional: Validate the 'state' parameter to prevent CSRF attacks
    // const expectedState = ''; // Retrieve expected state from session or secure cookie
    // if (receivedState !== expectedState) {
    //   return NextResponse.json({ error: 'Invalid state parameter' }, { status: 403 });
    // }

    const oauthConfig = await getLinkedInOAuthConfig();
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code as string);
    params.append('redirect_uri', oauthConfig.redirectUri); // Ensure this matches exactly
    params.append('client_id', oauthConfig.clientId);
    params.append('client_secret', oauthConfig.clientSecret);

    const tokenResponse = await axios.post<LinkedInTokenResponse>(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Fetch basic profile data (using /v2/me for r_liteprofile or /v2/userinfo for OpenID connect profile scope)
    // The /v2/me endpoint is commonly used with r_liteprofile.
    // For OpenID scopes like 'profile', '/v2/userinfo' is standard.
    // Let's use /v2/me and assume r_liteprofile for broader compatibility for now.
    // If 'openid profile' scopes are primarily used, '/v2/userinfo' might be more appropriate.
    const profileApiUrl = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline(localized,preferredLocale))';
    const profileDataResponse = await axios.get<LinkedInProfileResponse>(profileApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0', // Recommended by LinkedIn
        'LinkedIn-Version': '202308', // Specify API version (check latest)
      },
    });

    // Fetch email address
    const emailApiUrl = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
    const emailDataResponse = await axios.get<LinkedInEmailResponse>(emailApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202308',
      },
    });
    
    const email = emailDataResponse.data.elements?.[0]?.['handle~']?.emailAddress || null;

    // Construct a simplified profile object to return
    const userProfile = {
      id: profileDataResponse.data.id,
      firstName: profileDataResponse.data.firstName?.localized?.[profileDataResponse.data.firstName?.preferredLocale.language] || '',
      lastName: profileDataResponse.data.lastName?.localized?.[profileDataResponse.data.lastName?.preferredLocale.language] || '',
      headline: profileDataResponse.data.headline?.localized?.[profileDataResponse.data.headline?.preferredLocale.language] || 'N/A',
      // A basic way to get a profile picture URL, might need refinement based on actual response
      profilePictureUrl: profileDataResponse.data.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier || null,
      email: email,
    };

    // Note on Member Data Portability (r_dma_portability_3rd_party):
    // If the r_dma_portability_3rd_party scope was used and your app is an approved partner,
    // you would make requests to endpoints like /rest/memberSnapshotData or /rest/memberChangeLogs here.
    // For example:
    // const snapshotApiUrl = 'https://api.linkedin.com/rest/memberSnapshotData';
    // const snapshotResponse = await axios.get(snapshotApiUrl, { headers: { Authorization: `Bearer ${accessToken}` ... } });
    // This typically returns a large dataset and might involve polling or asynchronous processing.

    return NextResponse.json({profile: userProfile, accessToken}, {status: 200});
  } catch (error: any) {
    console.error('Error exchanging LinkedIn token or fetching data:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.error_description || error.response?.data?.error || error.message || 'Failed to authenticate with LinkedIn.';
    const status = error.response?.status || 500;
    return NextResponse.json({error: errorMessage, details: error.response?.data }, {status});
  }
}
