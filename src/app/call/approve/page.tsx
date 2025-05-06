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
import { useRouter } from 'next/navigation';
import { Bot, ChevronRight, HomeIcon } from 'lucide-react';

export default function CallScriptApprovalPage() {
  const router = useRouter();
  const [script, setScript] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [callObjective, setCallObjective] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [industry, setIndustry] = useState('');
  const [connections, setConnections] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [usedCallCount, setUsedCallCount] = useState(0); // This might be fetched from user data
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [callId, setCallId] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    const input: GenerateCallScriptInput = {
      campaignName,
      productName,
      targetAudience,
      callObjective,
      additionalContext,
      industry,
      connections,
      subscriptionTier,
      usedCallCount,
      leadId,
      // preferredTone is part of schema but not used in UI, default will be applied
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
      } else if (result.script) {
        toast({
          title: 'Script Generated',
          description: 'AI call script has been successfully generated.',
        });
      } else {
         toast({
          title: 'Script Generation Failed',
          description: 'Could not generate script. Please check inputs or try again.',
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

  const handleProceedToModelSelection = () => {
    if (!script || quotaExceeded) {
      toast({
        title: 'Cannot Proceed',
        description: 'Please generate a valid script and ensure you are within your call quota.',
        variant: 'destructive',
      });
      return;
    }
    // Navigate to the new page, passing necessary data as query parameters
    const queryParams = new URLSearchParams({
      script: encodeURIComponent(script),
      callId,
      leadId,
      campaignName: encodeURIComponent(campaignName),
      productName: encodeURIComponent(productName),
      targetAudience: encodeURIComponent(targetAudience),
      callObjective: encodeURIComponent(callObjective),
      additionalContext: encodeURIComponent(additionalContext),
      industry: encodeURIComponent(industry),
      connections: connections.toString(),
      subscriptionTier,
    });
    router.push(`/call/select-sarvam-model?${queryParams.toString()}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-xl drop-shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">AI Call Script Generation</CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate an AI-powered call script. You'll select the AI model and enter phone number on the next step.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="E.g., Q4 SaaS Outreach" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Product/Service Name</Label>
              <Input id="productName" value={productName} onChange={e => setProductName(e.target.value)} placeholder="E.g., ConvoSpan Pro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience Description</Label>
              <Input id="targetAudience" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="E.g., VPs of Sales in Tech companies" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callObjective">Primary Call Objective</Label>
              <Input id="callObjective" value={callObjective} onChange={e => setCallObjective(e.target.value)} placeholder="E.g., Schedule a Demo, Gather Information" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Target Lead's Industry</Label>
              <Input id="industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="E.g., Software, Marketing, Healthcare" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadId">Lead ID (Optional)</Label>
              <Input id="leadId" value={leadId} onChange={e => setLeadId(e.target.value)} placeholder="Enter Lead ID from CRM if available" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="connections">Lead's LinkedIn Connections (Approx.)</Label>
              <Input type="number" id="connections" value={connections} onChange={e => setConnections(Number(e.target.value))} placeholder="E.g., 500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscriptionTier">Your Subscription Tier</Label>
              <Select value={subscriptionTier} onValueChange={value => setSubscriptionTier(value as 'basic' | 'pro' | 'enterprise')}>
                <SelectTrigger id="subscriptionTier">
                  <SelectValue placeholder="Select Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalContext">Additional Context for Script</Label>
            <Textarea id="additionalContext" value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} placeholder="Key pain points, recent company news, specific talking points..." />
          </div>

          <Button onClick={handleGenerateScript} disabled={isGeneratingScript} className="w-full md:w-auto">
            <Bot className="mr-2 h-5 w-5" />
            {isGeneratingScript ? 'Generating Script...' : 'Generate AI Call Script'}
          </Button>

          {script && (
            <div className="space-y-2 mt-6">
              <Label htmlFor="script" className="text-lg font-semibold">Generated Call Script (Preview)</Label>
              <Textarea id="script" value={script} readOnly rows={8} className="bg-muted/30" />
            </div>
          )}

          {quotaExceeded && (
            <p className="text-destructive font-medium">You have exceeded your call quota for the current period. Please upgrade your plan or wait for the next cycle.</p>
          )}
          {callId && !quotaExceeded && (
            <p className="text-muted-foreground">Internal Call Record ID: {callId}</p>
          )}

          {script && !quotaExceeded && (
            <div className="mt-6 space-y-4">
              <Button 
                onClick={handleProceedToModelSelection} 
                disabled={!script || quotaExceeded || isGeneratingScript} 
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Approve Script & Select AI Model <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between mt-8">
        <Link href="/" passHref>
          <Button variant="outline"> <HomeIcon className="mr-2 h-4 w-4" />Back to Dashboard</Button>
        </Link>
        {script && !quotaExceeded && (
          <Button onClick={handleProceedToModelSelection}>
            Next: Select AI Model <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

