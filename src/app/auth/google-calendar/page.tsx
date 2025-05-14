'use client';

// This page is no longer needed as Google Calendar integration has been removed.
// You can delete this file or keep it as a placeholder if you might re-add GCal later.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function GoogleCalendarAuthPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: 'Google Calendar Integration Removed',
      description: 'The Google Calendar integration is currently not active.',
      variant: 'default',
    });
    router.push('/campaign'); // Redirect back to a safe page
  }, [router, toast]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">Google Calendar integration is currently unavailable.</p>
      </div>
    </div>
  );
}
