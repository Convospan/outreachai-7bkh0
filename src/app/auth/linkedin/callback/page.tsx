'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import Link from 'next/link';
import {Loader2, AlertTriangle, CheckCircle, Home} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';

interface LinkedInProfileData {
  id: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  profilePictureUrl?: string | null;
  email?: string | null;
}

export default function LinkedInCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {toast} = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<LinkedInProfileData | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state'); 

    if (code) {
      const exchangeTokenAndFetchData = async () => {
        setIsLoading(true);
        setError(null);
        setProfileData(null);
        try {
          const response = await fetch('/api/linkedin/exchange-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({code, state}),
          });

          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
            } catch (parseError) {
              // If parsing JSON fails, use the status text
              throw new Error(`Failed to exchange token: ${response.statusText} (Could not parse error response)`);
            }
            console.error('LinkedIn exchange token API error:', errorData);
            throw new Error(errorData.error || errorData.message || `Failed to exchange token: ${response.statusText}`);
          }

          const data = await response.json();
          if (data.error) { // Handle cases where API returns 200 but with an error payload
            throw new Error(data.error.message || data.error || 'Error received from LinkedIn API during token exchange.');
          }

          setProfileData(data.profile);
          localStorage.setItem('linkedInProfile', JSON.stringify(data.profile));
          
          toast({
            title: 'LinkedIn Connected!',
            description: 'Successfully fetched your LinkedIn profile.',
          });
           setTimeout(() => {
            router.push('/campaign/create'); 
          }, 2000);

        } catch (err: any) {
          console.error('LinkedIn callback error:', err);
          const errorMessage = err.message || 'An unexpected error occurred during LinkedIn authorization.';
          setError(errorMessage);
          toast({
            title: 'LinkedIn Connection Failed',
            description: errorMessage,
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      exchangeTokenAndFetchData();
    } else {
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const userDenied = errorParam === 'user_cancelled_login' || errorParam === 'user_cancelled_authorize';
      
      let errorMessage = 'Invalid callback: No authorization code found.';
      if (errorParam) {
        errorMessage = errorDescription || errorParam;
        if (userDenied) {
          errorMessage = "LinkedIn authorization was cancelled.";
        }
      }
      
      setError(errorMessage);
      toast({
        title: userDenied ? 'LinkedIn Authorization Cancelled' : 'LinkedIn Authorization Error',
        description: errorMessage,
        variant: userDenied ? 'default' : 'destructive',
      });
      setIsLoading(false);
    }
  }, [searchParams, router, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg shadow-2xl drop-shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">LinkedIn Authorization</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Processing your LinkedIn connection...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {isLoading && (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">Connecting to LinkedIn, please wait...</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center space-y-3 text-destructive">
              <AlertTriangle className="h-12 w-12" />
              <p className="text-lg font-semibold">Connection Failed</p>
              <p className="text-sm">{error}</p>
              <Link href="/campaign/create/linkedin-auth" passHref>
                <Button variant="outline" className="mt-4">
                  Try Connecting Again
                </Button>
              </Link>
            </div>
          )}
          {profileData && !isLoading && !error && (
            <div className="flex flex-col items-center space-y-3 text-green-600">
              <CheckCircle className="h-12 w-12" />
              <p className="text-lg font-semibold">Successfully Connected!</p>
              <p className="text-sm text-muted-foreground">
                Welcome, {profileData.firstName} {profileData.lastName}!
              </p>
              {profileData.headline && <p className="text-xs text-muted-foreground">Headline: {profileData.headline}</p>}
              {profileData.email && <p className="text-xs text-muted-foreground">Email: {profileData.email}</p>}
              <p className="text-sm text-muted-foreground mt-2">Redirecting you shortly...</p>
            </div>
          )}
           <div className="mt-8">
            <Link href="/" passHref>
              <Button variant="ghost">
                <Home className="mr-2 h-4 w-4" /> Go to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
