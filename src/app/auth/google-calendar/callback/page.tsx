'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createOAuth2Client, getGoogleCalendarTokensFromCode } from '@/services/google-calendar'; // Assuming this path

export default function GoogleCalendarCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');

      if (code) {
        try {
          // It's generally better to handle token exchange on the server-side
          // But for simplicity in this example, we'll do it client-side.
          // In a real app, you'd send the 'code' to your backend,
          // which would then exchange it for tokens and store them securely.

          const oauth2Client = await createOAuth2Client(); // Recreate or get a pre-configured client
          const tokens = await getGoogleCalendarTokensFromCode(code, oauth2Client);

          if (tokens) {
            // Store tokens securely (e.g., in localStorage, or better, send to backend to store with user session)
            localStorage.setItem('googleCalendarTokens', JSON.stringify(tokens));
            toast({
              title: 'Google Calendar Authorized',
              description: 'Successfully connected to Google Calendar.',
            });
            // Redirect to the campaign page or wherever the user was before
            router.push('/campaign');
          } else {
            throw new Error('Failed to obtain tokens from Google.');
          }
        } catch (error) {
          console.error('Error handling Google Calendar callback:', error);
          toast({
            title: 'Google Calendar Authorization Failed',
            description: 'Could not complete Google Calendar authorization. Please try again.',
            variant: 'destructive',
          });
          router.push('/campaign'); // Redirect back even on error
        }
      } else {
        toast({
          title: 'Google Calendar Authorization Error',
          description: 'No authorization code found. Please try again.',
          variant: 'destructive',
        });
        router.push('/campaign'); // Redirect back
      }
    };

    handleCallback();
  }, [router, searchParams, toast]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Processing Google Calendar Authorization...</h1>
        <p className="text-muted-foreground">Please wait while we connect your Google Calendar.</p>
        {/* You can add a loading spinner here */}
      </div>
    </div>
  );
}
