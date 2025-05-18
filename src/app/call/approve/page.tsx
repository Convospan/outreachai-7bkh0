'use client';

import React, {useState, useEffect} from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { Bot, ChevronRight, HomeIcon, Loader2, ShieldCheck, Edit, PlayCircle, CalendarPlus, PhoneOutgoing, CheckCircle, UserCheck, LinkedinIcon, Send, MessageSquare, Mail, BotMessageSquare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProspectJourneyVisualizer, { type ProspectStage } from '@/components/ProspectJourneyVisualizer';

const prospectJourneyStages: ProspectStage[] = [
  { id: 'Identified', name: 'Identified', icon: <UserCheck className="h-4 w-4" /> },
  { id: 'LinkedInConnected', name: 'LinkedIn Connected', icon: <LinkedinIcon className="h-4 w-4" /> },
  { id: 'LinkedInIntroSent', name: 'Intro Message Sent', icon: <Send className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp1', name: 'Follow-up 1 Sent', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp2', name: 'Follow-up 2 Sent', icon: <MessageSquare className="h-4 w-4" /> },
  // { id: 'EmailAddressCaptured', name: 'Email Captured', icon: <Mail className="h-4 w-4" /> }, // Email module removed
  // { id: 'EmailDripInitiated', name: 'Email Drip Started', icon: <BotMessageSquare className="h-4 w-4" /> }, // Email module removed
  { id: 'ComplianceChecked', name: 'Compliance Checked', icon: <ShieldCheck className="h-4 w-4" /> },
  // { id: 'CallScriptReady', name: 'Call Script Ready', icon: <Edit className="h-4 w-4" /> }, // AI Call module removed
  // { id: 'AICallInProgress', name: 'AI Call In Progress', icon: <PlayCircle className="h-4 w-4" /> }, // AI Call module removed
  // { id: 'CallScheduled', name: 'Call Scheduled (GCal)', icon: <CalendarPlus className="h-4 w-4" /> }, // GCal/AI Call module removed
  // { id: 'CallCompleted', name: 'Call Completed', icon: <PhoneOutgoing className="h-4 w-4" /> }, // AI Call module removed
  { id: 'LeadQualified', name: 'Lead Qualified', icon: <CheckCircle className="h-4 w-4" /> },
];

export default function CallScriptApprovalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [script, setScript] = useState('');
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

  const [currentProspectJourneyStage, setCurrentProspectJourneyStage] = useState<ProspectStage['id']>(
    searchParams.get('stage') as ProspectStage['id'] || 'ComplianceChecked' // Default or passed via query
  );

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
      preferredTone: 'professional',
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
        // setCurrentProspectJourneyStage('CallScriptReady'); // AI Call module removed
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

  // Removed handleProceedToModelSelection as Sarvam module is removed

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6 shadow-lg drop-shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Prospect Journey Visualizer</CardTitle>
            </CardHeader>
            <CardContent>
                <ProspectJourneyVisualizer stages={prospectJourneyStages} currentStageId={currentProspectJourneyStage} />
            </CardContent>
        </Card>

      <Card className="shadow-xl drop-shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Call Script Generation (LinkedIn)</CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate a call script based on LinkedIn interactions and profile data. 
            {/* Sarvam AI calling functionality has been disabled. */}
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
              <Label htmlFor="industry">Target Lead&apos;s Industry</Label>
              <Input id="industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="E.g., Software, Marketing, Healthcare" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadId">Lead ID (Optional)</Label>
              <Input id="leadId" value={leadId} onChange={e => setLeadId(e.target.value)} placeholder="Enter Lead ID from CRM if available" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="connections">Lead&apos;s LinkedIn Connections (Approx.)</Label>
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

          <Button onClick={handleGenerateScript} disabled={isGeneratingScript || currentProspectJourneyStage !== 'ComplianceChecked'} className="w-full md:w-auto">
            {isGeneratingScript ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Bot className="mr-2 h-5 w-5" />}
            {isGeneratingScript ? 'Generating Script...' : 'Generate Call Script'}
          </Button>
          {currentProspectJourneyStage !== 'ComplianceChecked' && <p className="text-sm text-muted-foreground">Please complete compliance check before generating script.</p>}


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

          {/* Removed button that led to Sarvam model selection */}
        </CardContent>
      </Card>
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => router.back()}> <ShieldCheck className="mr-2 h-4 w-4" />Back to Compliance Check</Button>
        {/* Removed link to Sarvam model selection */}
      </div>
    </div>
  );
}
