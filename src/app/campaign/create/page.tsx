'use client';

import React from 'react';
import {Button} from "@/components/ui/button";
import Link from 'next/link';

export default function CampaignCreatePage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Campaign</h1>
            <p className="mb-4">Select a module to configure your campaign:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/campaign" passHref>
                    <Button>
                        Campaign Automation
                    </Button>
                </Link>
                <Link href="/compliance/check" passHref>
                    <Button>
                        Compliance Check
                    </Button>
                </Link>
                <Link href="/call/approve" passHref>
                    <Button>
                        Call Script Approval
                    </Button>
                </Link>
                <Link href="/risk-lead-visualization" passHref>
                    <Button>
                        Risk &amp; Lead Visualization
                    </Button>
                </Link>
                {/* Add more links as needed */}
            </div>
        </div>
    );
}
