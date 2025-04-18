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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {useToast} from "@/hooks/use-toast";

export default function ComplianceCheckPage() {
  const [script, setScript] = useState('');
  const [consent, setConsent] = useState(false);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [tier, setTier] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const {toast} = useToast();

  const handleCheckCompliance = async () => {
    const data = { script: script, consent: consent, tier: tier };
    const status = await checkCompliance(data);
    setComplianceStatus(status);

    if (status.status === 'error') {
      toast({
        title: 'Compliance Check Failed',
        description: status.message,
        variant: 'destructive',
      });
    } else if (status.status === 'warning') {
      toast({
        title: 'Compliance Check Warning',
        description: status.message,
        variant: 'warning',
      });
    } else {
      toast({
        title: 'Compliance Check Passed',
        description: status.message,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Check</CardTitle>
          <CardDescription>Check if your outreach script is compliant with LinkedIn ToS and GDPR. Compliance checks are only available with active Pro or Enterprise subscriptions.</CardDescription>
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
          <div className="grid gap-2">
            <Label htmlFor="tier">Tier</Label>
            <Select onValueChange={(value) => setTier(value as 'basic' | 'pro' | 'enterprise')}>
              <SelectTrigger id="tier">
                <SelectValue placeholder="Select Tier"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
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
          <Button>
            <Link href="/call/approve" passHref>
              Next: Approve Call Script
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
