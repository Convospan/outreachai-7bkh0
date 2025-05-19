// src/app/campaign/create/linkedin-auth/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Linkedin, ArrowLeft, Download, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LinkedInAuthInfoPage() {
  const { toast } = useToast();

  const handleDownloadExtension = () => {
    // Placeholder for actual extension download link
    // In a real scenario, this would point to the Chrome Web Store or your extension's download page.
    toast({
      title: "Chrome Extension",
      description: "Download link for the ConvoSpan AI Chrome Extension is coming soon!",
    });
    // window.open('YOUR_CHROME_EXTENSION_DOWNLOAD_LINK_HERE', '_blank');
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg shadow-2xl drop-shadow-xl border-primary">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Linkedin className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Using LinkedIn with ConvoSpan AI</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            To import LinkedIn profile data and automate actions, please use the ConvoSpan AI Chrome Extension.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary/10 rounded-md border border-primary/30">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-primary mr-3 shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Chrome Extension Required</h3>
                <p className="text-sm text-muted-foreground">
                  ConvoSpan AI leverages a powerful Chrome Extension to interact with LinkedIn. This ensures a more robust and compliant way to gather profile data and manage outreach directly within the LinkedIn environment.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Once the extension is installed and you are logged into LinkedIn, it will help fetch profile information when you are on a LinkedIn profile page and can assist in automating actions as configured in your ConvoSpan AI campaigns.
          </p>
          
          <Button
            onClick={handleDownloadExtension}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" /> Get the ConvoSpan AI Chrome Extension (Coming Soon)
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
