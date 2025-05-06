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
    const state = searchParams.get('state'); // Optional: for CSRF protection

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
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to exchange token: ${response.statusText}`);
          }

          const data = await response.json();
          setProfileData(data.profile);
          // Securely store data.profile and data.accessToken (e.g., in HttpOnly cookie or session storage if short-lived)
          // For demo purposes, we're just displaying it.
          // In a real app, you might store the access token server-side associated with the user's session.
          localStorage.setItem('linkedInProfile', JSON.stringify(data.profile));
          // Storing access token in localStorage is NOT recommended for production.
          // localStorage.setItem('linkedInAccessToken', data.accessToken); 


          toast({
            title: 'LinkedIn Connected!',
            description: 'Successfully fetched your LinkedIn profile.',
          });
           // Redirect to campaign creation or dashboard after a short delay
           setTimeout(() => {
            router.push('/campaign/create'); // Or '/dashboard' or wherever appropriate
          }, 2000);

        } catch (err: any) {
          console.error('LinkedIn callback error:', err);
          setError(err.message || 'An unexpected error occurred.');
          toast({
            title: 'LinkedIn Connection Failed',
            description: err.message || 'Could not complete LinkedIn authorization.',
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
      if (errorParam) {
        setError(errorDescription || errorParam || 'LinkedIn authorization was denied or failed.');
        toast({
          title: 'LinkedIn Authorization Error',
          description: errorDescription || errorParam || 'Authorization failed.',
          variant: 'destructive',
        });
      } else {
        setError('Invalid callback: No authorization code found.');
         toast({
          title: 'LinkedIn Authorization Error',
          description: 'No authorization code found. Please try again.',
          variant: 'destructive',
        });
      }
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
