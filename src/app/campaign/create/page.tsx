'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Linkedin, FileUp, Settings, ShieldCheck, Phone, BarChart2, UserCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface LinkedInProfileData {
  id: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  profilePictureUrl?: string | null;
  email?: string | null;
}

export default function CampaignCreatePage() {
    const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfileData | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedProfile = localStorage.getItem('linkedInProfile');
            if (storedProfile) {
                setLinkedInProfile(JSON.parse(storedProfile));
            }
        } catch (error) {
            console.error("Error parsing LinkedIn profile from localStorage:", error);
            toast({
                title: "Profile Load Error",
                description: "Could not load your LinkedIn profile data. Please try connecting again.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingProfile(false);
        }
    }, [toast]);

    return (
        <div className="container mx-auto p-4 md:p-8 bg-background text-foreground">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">Create New Campaign</h1>
            
            {isLoadingProfile && (
                <div className="text-center my-8">
                    <p className="text-muted-foreground">Loading LinkedIn profile data...</p>
                    {/* Add a spinner or loader component here if desired */}
                </div>
            )}

            {!isLoadingProfile && linkedInProfile && (
                <Card className="mb-8 shadow-lg drop-shadow-xl border-primary">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center text-primary">
                            <UserCircle className="mr-3 h-8 w-8" /> LinkedIn Profile Imported
                        </CardTitle>
                        <CardDescription>
                            Your LinkedIn profile data has been successfully imported. You can now use this to personalize your campaigns.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {linkedInProfile.profilePictureUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={linkedInProfile.profilePictureUrl} alt={`${linkedInProfile.firstName} ${linkedInProfile.lastName}`} className="w-24 h-24 rounded-full mx-auto border-2 border-primary" data-ai-hint="profile image" />
                        )}
                        <p className="text-center text-xl font-semibold">{linkedInProfile.firstName} {linkedInProfile.lastName}</p>
                        {linkedInProfile.headline && <p className="text-center text-muted-foreground">{linkedInProfile.headline}</p>}
                        {linkedInProfile.email && <p className="text-center text-sm text-muted-foreground">Email: {linkedInProfile.email}</p>}
                         <div className="text-center mt-4">
                            <Link href="/campaign/create/linkedin-auth" passHref>
                                <Button variant="outline" size="sm">
                                    <Linkedin className="mr-2 h-4 w-4" /> Re-connect or Switch Account
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
            
            <p className="text-lg text-center mb-8 text-muted-foreground">
                {linkedInProfile ? "Now, choose how to import additional prospect data or configure other campaign modules." : "Choose how you want to import your prospect data or configure other campaign modules."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Data Import Options */}
                {!linkedInProfile && ( // Only show connect if profile is not loaded
                    <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 drop-shadow-md">
                        <div className="flex items-center justify-center mb-4">
                            <Linkedin className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold text-center mb-3">Import from LinkedIn</h2>
                        <p className="text-muted-foreground text-center mb-6">
                            Connect your LinkedIn profile to securely fetch your data.
                        </p>
                        <Link href="/campaign/create/linkedin-auth" passHref>
                            <Button className="w-full" variant="outline">
                                <Linkedin className="mr-2 h-5 w-5" /> Connect LinkedIn
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 drop-shadow-md">
                    <div className="flex items-center justify-center mb-4">
                        <FileUp className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-3">Upload CSV File</h2>
                    <p className="text-muted-foreground text-center mb-6">
                        Upload a CSV file with your prospect list and campaign details.
                    </p>
                    <Link href="/campaign/create/upload-csv" passHref>
                        <Button className="w-full" variant="outline">
                           <FileUp className="mr-2 h-5 w-5" /> Upload CSV
                        </Button>
                    </Link>
                </div>

                {/* Existing Module Links */}
                 <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 drop-shadow-md">
                    <div className="flex items-center justify-center mb-4">
                        <Settings className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-3">Campaign Automation</h2>
                    <p className="text-muted-foreground text-center mb-6">
                        Set up automated message flows and sequences.
                    </p>
                    <Link href="/campaign" passHref>
                        <Button className="w-full">
                            Configure Automation
                        </Button>
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 drop-shadow-md">
                    <div className="flex items-center justify-center mb-4">
                        <ShieldCheck className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-3">Compliance Check</h2>
                    <p className="text-muted-foreground text-center mb-6">
                        Ensure your outreach scripts meet compliance standards.
                    </p>
                    <Link href="/compliance/check" passHref>
                        <Button className="w-full">
                            Check Compliance
                        </Button>
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 drop-shadow-md">
                     <div className="flex items-center justify-center mb-4">
                        <Phone className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-3">Call Script Approval</h2>
                    <p className="text-muted-foreground text-center mb-6">
                        Generate and approve AI-powered call scripts.
                    </p>
                    <Link href="/call/approve" passHref>
                        <Button className="w-full">
                            Manage Call Scripts
                        </Button>
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 drop-shadow-md">
                    <div className="flex items-center justify-center mb-4">
                        <BarChart2 className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-center mb-3">Risk & Lead Visualization</h2>
                    <p className="text-muted-foreground text-center mb-6">
                        Analyze campaign risk and prioritize leads effectively.
                    </p>
                    <Link href="/risk-lead-visualization" passHref>
                        <Button className="w-full">
                            View Analytics
                        </Button>
                    </Link>
                </div>
            </div>
             <div className="mt-12 text-center">
                <Link href="/" passHref>
                    <Button variant="outline" size="lg">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
