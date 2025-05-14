'use client';

import { Button } from '@/components/ui/button';
import { getLinkedInOAuthConfig } from '@/services/linkedin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Linkedin, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function LinkedInAuthPage() {
  const { toast } = useToast(); // Initialize toast

  const handleLinkedInConnect = async () => {
    try {
      const config = await getLinkedInOAuthConfig();
      // Ensure redirectUri is a full URL. If it's relative, prepend origin.
      let redirectUri = config.redirectUri;
      if (!redirectUri.startsWith('http')) {
        redirectUri = `${window.location.origin}${redirectUri.startsWith('/') ? '' : '/'}${redirectUri}`;
      }
      
      // Scopes:
      // r_liteprofile: Basic profile info (name, photo, headline)
      // r_emailaddress: Primary email address
      // w_member_social: Share, comment, like on user's behalf (use with caution)
      // openid, profile, email: Standard OpenID Connect scopes for identity and more profile details.
      // r_dma_portability_3rd_party: For Member Data Portability (requires LinkedIn partnership approval)
      // For general profile data and email, these are common and powerful:
      const scopes = ['r_liteprofile', 'r_emailaddress', 'openid', 'profile', 'email', 'r_dma_portability_3rd_party'];
      // If you have r_dma_portability_3rd_party and are approved, you can add it:
      // const scopes = ['r_liteprofile', 'r_emailaddress', 'openid', 'profile', 'email', 'r_dma_portability_3rd_party'];

      const scopeString = scopes.join(' ');
      
      // Construct the authorization URL as per LinkedIn documentation
      // Using standard OAuth 2.0 Authorization Code Flow
      // https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?tabs=HTTPS
      const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopeString)}&state=SOME_RANDOM_STATE_STRING_FOR_CSRF_PROTECTION`; // Add a unique state for CSRF
      
      window.location.href = authorizationUrl;
    } catch (error: any) {
        console.error("Error getting LinkedIn OAuth config:", error);
        toast({ // Use toast for error notification
          title: "LinkedIn Connection Error",
          description: error.message || "Could not initiate LinkedIn authorization. Please try again.",
          variant: "destructive",
        });
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
            By clicking &quot;Connect with LinkedIn&quot;, you will be redirected to LinkedIn to authorize ConvoSpan AI to access your profile data. We request permissions to help you build effective outreach campaigns.
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

