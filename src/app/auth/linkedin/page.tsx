"use client";

import { useEffect } from 'react';
import { getLinkedInOAuthConfig } from '@/services/linkedin';

export default function LinkedInAuthPage() {
    useEffect(() => {
      const redirectToLinkedIn = async () => {
        const config = await getLinkedInOAuthConfig();
        const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=r_liteprofile%2Cr_emailaddress%2Cw_member_social`;
        window.location.href = authorizationUrl;
      };

      redirectToLinkedIn();
    }, []);



    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">LinkedIn OAuth</h1>
            <p>Redirecting to LinkedIn for authentication...</p>
        </div>
    );
}
