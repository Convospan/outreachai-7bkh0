"use client";

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ComplianceStatus, checkCompliance } from '@/services/compliance';
import Link from 'next/link';

export default function ComplianceCheckPage() {
    const [script, setScript] = useState('');
    const [consent, setConsent] = useState(false);
    const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);

    const handleCheckCompliance = async () => {
        const data = { script: script, consent: consent };
        const status = await checkCompliance(data);
        setComplianceStatus(status);
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Compliance Check</CardTitle>
                    <CardDescription>Check if your outreach script is compliant with LinkedIn ToS and GDPR.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="script">Outreach Script</Label>
                        <Textarea
                            id="script"
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            placeholder="Enter your outreach script here"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="consent"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="consent">Consent Given</Label>
                    </div>
                    <Button onClick={handleCheckCompliance}>Check Compliance</Button>
                    {complianceStatus && (
                        <div className={`mt-4 p-4 rounded-md ${complianceStatus.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <p>Status: {complianceStatus.status}</p>
                            <p>Message: {complianceStatus.message}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
              <div className="flex justify-between mt-4">
                <Link href="/campaign" passHref>
                    <Button variant="outline">Back to Campaign</Button>
                </Link>
                {complianceStatus?.status === 'ok' && (
                    <Button >
                        <Link href="/call/approve" passHref>
                            Next: Approve Call Script
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
