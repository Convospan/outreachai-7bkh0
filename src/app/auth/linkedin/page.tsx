"use client";

import { useEffect } from 'react';

export default function LinkedInAuthPage() {
    useEffect(() => {
        // Redirect to LinkedIn OAuth flow
        window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=r_liteprofile,r_emailaddress,w_member_social';
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">LinkedIn OAuth</h1>
            <p>Redirecting to LinkedIn for authentication...</p>
        </div>
    );
}
