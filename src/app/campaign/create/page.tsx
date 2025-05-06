'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Linkedin, FileUp, Settings, ShieldCheck, Phone, BarChart2 } from 'lucide-react';

export default function CampaignCreatePage() {
    return (
        <div className="container mx-auto p-4 md:p-8 bg-background text-foreground">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">Create New Campaign</h1>
            <p className="text-lg text-center mb-8 text-muted-foreground">
                Choose how you want to import your prospect data or configure other campaign modules.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Data Import Options */}
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
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
