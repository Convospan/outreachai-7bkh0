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
import {generateCallScript, GenerateCallScriptInput} from '@/server/generate-call-script';
import {Input} from '@/components/ui/input';
import Link from 'next/link';
import { initiateSarvamCall } from '@/services/sarvam'; // Import the Sarvam service
import { Phone } from 'lucide-react';

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
  const [usedCallCount, setUsedCallCount] = useState(0);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [callId, setCallId] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [sarvamCallStatus, setSarvamCallStatus] = useState<string | null>(null);
  const [targetPhoneNumber, setTargetPhoneNumber] = useState(''); // State for target phone number

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    setSarvamCallStatus(null); // Clear previous call status
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
      leadId: leadId,
    };

    try {
      const result = await generateCallScript(input);
      setScript(result.script);
      setQuotaExceeded(result.quotaExceeded);
      setCallId(result.callId);
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
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleApproveScriptAndCallSarvam = async () => {
    if (!script) {
        toast({ title: "No Script", description: "Please generate a script first.", variant: "destructive"});
        return;
    }
    if (!targetPhoneNumber) {
        toast({ title: "No Phone Number", description: "Please enter a target phone number.", variant: "destructive"});
        return;
    }

    setIsCalling(true);
    setApproved(true); // Mark script as approved conceptually
    setUsedCallCount(usedCallCount + 1); // Increment call count
    setSarvamCallStatus("Initiating call with Sarvam AI...");

    try {
      const sarvamResult = await initiateSarvamCall({
        phoneNumber: targetPhoneNumber,
        script: script,
      });

      if (sarvamResult.status === 'initiated') {
        setSarvamCallStatus(`Call initiated. Sarvam Call ID: ${sarvamResult.callId}`);
        toast({
          title: 'Call Initiated (Sarvam)',
          description: `Call to ${targetPhoneNumber} is being initiated via Sarvam. Call ID: ${sarvamResult.callId}`,
        });
      } else {
        setSarvamCallStatus(`Failed to initiate call: ${sarvamResult.message}`);
        toast({
          title: 'Sarvam Call Failed',
          description: sarvamResult.message || 'Could not initiate call via Sarvam.',
          variant: 'destructive',
        });
        setApproved(false); // Revert approval if call failed
        setUsedCallCount(prev => prev -1); // Decrement if call failed
      }
    } catch (error: any) {
      console.error('Failed to initiate Sarvam call:', error);
      setSarvamCallStatus(`Error: ${error.message || 'Failed to initiate call via Sarvam.'}`);
      toast({
        title: 'Error',
        description: 'Failed to initiate call via Sarvam.',
        variant: 'destructive',
      });
      setApproved(false); // Revert approval on error
      setUsedCallCount(prev => prev -1); // Decrement on error
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-xl drop-shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">AI Call Script & Sarvam Call</CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate an AI-powered call script and then initiate the call using Sarvam AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="E.g., Q4 SaaS Outreach" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" value={productName} onChange={e => setProductName(e.target.value)} placeholder="E.g., ConvoSpan Pro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input id="targetAudience" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="E.g., VPs of Sales in Tech" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callObjective">Call Objective</Label>
              <Input id="callObjective" value={callObjective} onChange={e => setCallObjective(e.target.value)} placeholder="E.g., Schedule a Demo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="E.g., Software" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadId">Lead ID</Label>
              <Input id="leadId" value={leadId} onChange={e => setLeadId(e.target.value)} placeholder="Enter Lead ID (from CRM)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="connections">Connections (LinkedIn)</Label>
              <Input type="number" id="connections" value={connections} onChange={e => setConnections(Number(e.target.value))} placeholder="Number of LinkedIn connections" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscriptionTier">Subscription Tier</Label>
              <select
                id="subscriptionTier"
                value={subscriptionTier}
                onChange={e => setSubscriptionTier(e.target.value as 'basic' | 'pro' | 'enterprise')}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalContext">Additional Context</Label>
            <Textarea id="additionalContext" value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} placeholder="Key pain points, recent company news, etc." />
          </div>

          <Button onClick={handleGenerateScript} disabled={isGeneratingScript} className="w-full md:w-auto">
            {isGeneratingScript ? 'Generating Script...' : 'Generate Call Script'}
          </Button>

          {script && (
            <div className="space-y-2 mt-6">
              <Label htmlFor="script" className="text-lg font-semibold">Generated Call Script</Label>
              <Textarea id="script" value={script} onChange={e => setScript(e.target.value)} placeholder="AI-generated call script will appear here" readOnly={approved || isCalling} rows={8} className="bg-muted/30" />
            </div>
          )}

          {quotaExceeded && (
            <p className="text-destructive font-medium">You have exceeded your call quota for the current period.</p>
          )}
          {callId && !quotaExceeded && (
            <p className="text-muted-foreground">Internal Call Record ID: {callId}</p>
          )}

          {script && !quotaExceeded && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetPhoneNumber" className="text-lg font-semibold">Target Phone Number (for Sarvam Call)</Label>
                <Input 
                  id="targetPhoneNumber" 
                  type="tel"
                  value={targetPhoneNumber} 
                  onChange={e => setTargetPhoneNumber(e.target.value)} 
                  placeholder="E.g., +15551234567" 
                  className="max-w-md"
                />
              </div>
              <Button 
                onClick={handleApproveScriptAndCallSarvam} 
                disabled={approved || !script || quotaExceeded || isCalling || !targetPhoneNumber} 
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                {isCalling ? 'Initiating Call...' : (approved ? 'Call Initiated with Sarvam' : 'Approve Script & Call with Sarvam')}
              </Button>
            </div>
          )}
          {sarvamCallStatus && (
            <p className="mt-4 text-sm font-medium text-foreground">{sarvamCallStatus}</p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between mt-8">
        <Link href="/" passHref>
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        {approved && sarvamCallStatus && sarvamCallStatus.startsWith("Call initiated") && ( // Check specific success message
          <Link href={`/risk-lead-visualization?callId=${callId}`} passHref>
            <Button>Next: Risk & Lead Visualization</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
