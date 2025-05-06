'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createOAuth2Client, generateGoogleCalendarAuthUrl } from '@/services/google-calendar';

export default function GoogleCalendarAuthPage() {
  const { toast } = useToast();

  useEffect(() => {
    const redirectToGoogleAuth = async () => {
      try {
        const oauth2Client = await createOAuth2Client();
        const authUrl = generateGoogleCalendarAuthUrl(oauth2Client);
        window.location.href = authUrl;
      } catch (error) {
        console.error('Failed to initiate Google Calendar authorization:', error);
        toast({
          title: 'Google Calendar Authorization Error',
          description: 'Could not start the Google Calendar authorization process. Please try again.',
          variant: 'destructive',
        });
        // Optionally redirect back to a safe page or show an error message
        // router.push('/campaign');
      }
    };

    redirectToGoogleAuth();
  }, [toast]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirecting to Google Calendar Authorization...</h1>
        <p className="text-muted-foreground">Please wait while we redirect you to Google to authorize calendar access.</p>
        {/* You can add a loading spinner here */}
      </div>
    </div>
  );
}
