'use client';

import React, {useState} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {toast} from '@/hooks/use-toast';
import {generateCallScript, GenerateCallScriptInput} from '@/server/generate-call-script'; // Import the Genkit flow
import {Input} from '@/components/ui/input';
import Link from 'next/link';

export default function CallScriptApprovalPage() {
  const [script, setScript] = useState('');
  const [approved, setApproved] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [callObjective, setCallObjective] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [industry, setIndustry] = useState('');
  const [connections, setConnections] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [usedCallCount, setUsedCallCount] = useState(0); // Calls used in the current period
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [leadId, setLeadId] = useState(''); // Lead ID state
  const [callId, setCallId] = useState('');   // Call ID state

  const handleGenerateScript = async () => {
    const input: GenerateCallScriptInput = {
      campaignName: campaignName,
      productName: productName,
      targetAudience: targetAudience,
      callObjective: callObjective,
      additionalContext: additionalContext,
      industry: industry,
      connections: connections,
      subscriptionTier: subscriptionTier,
      usedCallCount: usedCallCount,
      leadId: leadId, // Pass lead ID to the flow
    };

    try {
      const result = await generateCallScript(input);
      setScript(result.script);
      setQuotaExceeded(result.quotaExceeded);
      setCallId(result.callId); // Set the generated call ID
      if (result.quotaExceeded) {
        toast({
          title: 'Quota Exceeded',
          description: 'You have exceeded your call quota for the current period.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to generate call script:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate call script.',
        variant: 'destructive',
      });
    }
  };

  const handleApproveScript = () => {
    setApproved(true);
    setUsedCallCount(usedCallCount + 1); // Increment call count upon approval
    toast({
      title: 'Script Approved',
      description: 'The call script has been approved and is ready to be used. (Placeholder - Twilio integration needed)',
    });
    // TODO: Add Twilio integration here to initiate the call.
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Call Script Generation and Approval</CardTitle>
          <CardDescription>Generate and approve the AI-generated call script before initiating the call.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="campaignName">Campaign Name</Label>
            <Input
              id="campaignName"
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              placeholder="Enter campaign name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              placeholder="Describe the target audience"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="callObjective">Call Objective</Label>
            <Input
              id="callObjective"
              value={callObjective}
              onChange={e => setCallObjective(e.target.value)}
              placeholder="Enter the call objective"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="Enter the industry"
            />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="leadId">Lead ID</Label>
            <Input
              id="leadId"
              value={leadId}
              onChange={e => setLeadId(e.target.value)}
              placeholder="Enter the lead ID"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="connections">Connections</Label>
            <Input
              type="number"
              id="connections"
              value={connections}
              onChange={e => setConnections(Number(e.target.value))}
              placeholder="Enter the number of connections"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subscriptionTier">Subscription Tier</Label>
            <select
              id="subscriptionTier"
              value={subscriptionTier}
              onChange={e => setSubscriptionTier(e.target.value as 'basic' | 'pro' | 'enterprise')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="additionalContext">Additional Context</Label>
            <Textarea
              id="additionalContext"
              value={additionalContext}
              onChange={e => setAdditionalContext(e.target.value)}
              placeholder="Enter additional context (optional)"
            />
          </div>

          <Button onClick={handleGenerateScript}>Generate Call Script</Button>

          <div className="grid gap-2">
            <Label htmlFor="script">Call Script</Label>
            <Textarea
              id="script"
              value={script}
              onChange={e => setScript(e.target.value)}
              placeholder="AI-generated call script will appear here"
              readOnly={approved}
            />
          </div>
          {quotaExceeded && (
            <p className="text-red-500">You have exceeded your call quota for the current period.</p>
          )}
           {callId && (
            <p>
              Call ID: {callId}
            </p>
          )}
          <Button onClick={handleApproveScript} disabled={approved || !script || quotaExceeded}>
            {approved ? 'Approved' : 'Approve Script'}
          </Button>
        </CardContent>
      </Card>
      <div className="flex justify-between mt-4">
        <Link href="/" passHref>
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        {approved && (
          <Button>
            <Link href={`/risk-lead-visualization?callId=${callId}`} passHref>
              Next: Risk & Lead Visualization
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
