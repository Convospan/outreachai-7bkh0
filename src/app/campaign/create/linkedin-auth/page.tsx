'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getLinkedInOAuthConfig } from '@/services/linkedin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Linkedin, ArrowLeft } from 'lucide-react';

export default function LinkedInAuthPage() {
  const handleLinkedInConnect = async () => {
    try {
      const config = await getLinkedInOAuthConfig();
      // Ensure redirectUri is a full URL
      const redirectUri = config.redirectUri.startsWith('http') ? config.redirectUri : `${window.location.origin}${config.redirectUri.startsWith('/') ? '' : '/'}${config.redirectUri}`;
      
      const scope = "r_liteprofile%20r_emailaddress%20w_member_social%20r_basicprofile%20openid%20profile%20email"; // Added more scopes as per common usage, including openid, profile, email which are often needed for Member Data Portability or basic profile info.
      // For Member Data Portability specific endpoints like /rest/memberAuthorizations, you might need specific partner permissions and scopes.
      // The documented scope 'r_dma_portability_3rd_party' is for approved partners.
      // For general data access, r_liteprofile and r_emailaddress are common.

      // Construct the authorization URL as per LinkedIn documentation
      // https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?tabs=HTTPS
      // Example using the standard OAuth 2.0 Authorization Code Flow
      const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=SOME_RANDOM_STATE_STRING`;
      
      window.location.href = authorizationUrl;
    } catch (error) {
        console.error("Error getting LinkedIn OAuth config:", error);
        // Handle error, e.g., show a toast message
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg shadow-2xl drop-shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Linkedin className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Connect Your LinkedIn Profile</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Securely connect your LinkedIn account to import your profile data and streamline campaign creation.
            This will redirect you to LinkedIn for authorization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground text-center">
            By clicking "Connect with LinkedIn", you will be redirected to LinkedIn to authorize ConvoSpan.ai to access your profile data as per LinkedIn's Member Data Portability guidelines. We only request the necessary permissions to help you build effective outreach campaigns.
          </p>
          <Button
            onClick={handleLinkedInConnect}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3"
            size="lg"
          >
            <Linkedin className="mr-2 h-5 w-5" /> Connect with LinkedIn
          </Button>
          <div className="text-center mt-6">
            <Link href="/campaign/create" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaign Creation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
