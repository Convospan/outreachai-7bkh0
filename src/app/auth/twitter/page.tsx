"use client";

import { useEffect } from 'react';

export default function TwitterAuthPage() {
    useEffect(() => {
        // Redirect to Twitter OAuth flow
        window.location.href = 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=tweet.read,users.read&state=state&code_challenge=challenge&code_challenge_method=plain';
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Twitter OAuth</h1>
            <p>Redirecting to Twitter for authentication...</p>
        </div>
    );
}
