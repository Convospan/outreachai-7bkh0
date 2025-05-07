'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Button}from '@/components/ui/button';
import {Input}from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {toast}from '@/hooks/use-toast';
import { initiateSarvamCall } from '@/services/sarvam';
import Link from 'next/link';
import { Phone, Bot, ChevronRight, HomeIcon, Loader2, ShieldCheck, Edit, PlayCircle, CalendarPlus, PhoneOutgoing, CheckCircle, UserCheck, LinkedinIcon, Send, MessageSquare, Mail, BotMessageSquare } from 'lucide-react';
import ProspectJourneyVisualizer, { type ProspectStage } from '@/components/ProspectJourneyVisualizer';

const SARVAM_MODELS = [
  { id: 'sarvam-default-voice', name: 'Sarvam Default Voice (General)' },
  { id: 'sarvam-professional-male', name: 'Sarvam Professional Male' },
  { id: 'sarvam-friendly-female', name: 'Sarvam Friendly Female' },
];

const prospectJourneyStages: ProspectStage[] = [
  { id: 'Identified', name: 'Identified', icon: <UserCheck className="h-4 w-4" /> },
  { id: 'LinkedInConnected', name: 'LinkedIn Connected', icon: <LinkedinIcon className="h-4 w-4" /> },
  { id: 'LinkedInIntroSent', name: 'Intro Message Sent', icon: <Send className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp1', name: 'Follow-up 1 Sent', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp2', name: 'Follow-up 2 Sent', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'EmailAddressCaptured', name: 'Email Captured', icon: <Mail className="h-4 w-4" /> },
  { id: 'EmailDripInitiated', name: 'Email Drip Started', icon: <BotMessageSquare className="h-4 w-4" /> },
  { id: 'ComplianceChecked', name: 'Compliance Checked', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'CallScriptReady', name: 'Call Script Ready', icon: <Edit className="h-4 w-4" /> },
  { id: 'AICallInProgress', name: 'AI Call In Progress', icon: <PlayCircle className="h-4 w-4" /> },
  { id: 'CallScheduled', name: 'Call Scheduled (GCal)', icon: <CalendarPlus className="h-4 w-4" /> },
  { id: 'CallCompleted', name: 'Call Completed', icon: <PhoneOutgoing className="h-4 w-4" /> },
  { id: 'LeadQualified', name: 'Lead Qualified', icon: <CheckCircle className="h-4 w-4" /> },
];

function SelectSarvamModelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [script, setScript] = useState('');
  const [callId, setCallId] = useState('');
  const [leadId, setLeadId] = useState('');
  const [campaignDetails, setCampaignDetails] = useState<any>({});


  const [selectedModel, setSelectedModel] = useState<string>(SARVAM_MODELS[0].id);
  const [targetPhoneNumber, setTargetPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [sarvamCallStatus, setSarvamCallStatus] = useState<string | null>(null);
  const [sarvamCallId, setSarvamCallId] = useState<string | null>(null);

  const [currentProspectJourneyStage, setCurrentProspectJourneyStage] = useState<ProspectStage['id']>(
    searchParams.get('stage') as ProspectStage['id'] || 'CallScriptReady'
  );

  useEffect(() => {
    const scriptParam = searchParams.get('script');
    const callIdParam = searchParams.get('callId');
    const leadIdParam = searchParams.get('leadId');
    const stageParam = searchParams.get('stage') as ProspectStage['id'];
    
    if (scriptParam) setScript(decodeURIComponent(scriptParam));
    if (callIdParam) setCallId(callIdParam);
    if (leadIdParam) setLeadId(leadIdParam);
    if (stageParam) setCurrentProspectJourneyStage(stageParam);

    setCampaignDetails({
        campaignName: searchParams.get('campaignName') ? decodeURIComponent(searchParams.get('campaignName')!) : '',
        productName: searchParams.get('productName') ? decodeURIComponent(searchParams.get('productName')!) : '',
    });

    if (!scriptParam || !callIdParam) {
        toast({
            title: "Missing Information",
            description: "Call script or ID not found. Please go back and generate a script.",
            variant: "destructive"
        });
        router.push('/call/approve');
    }
  }, [searchParams, router]);

  const handleInitiateCall = async () => {
    if (!targetPhoneNumber) {
      toast({ title: "No Phone Number", description: "Please enter a target phone number.", variant: "destructive"});
      return;
    }
    if (!selectedModel) {
      toast({ title: "No AI Model Selected", description: "Please select a Sarvam AI model.", variant: "destructive"});
      return;
    }

    setIsCalling(true);
    setSarvamCallStatus("Initiating call with Sarvam AI...");
    setSarvamCallId(null);
    setCurrentProspectJourneyStage('AICallInProgress');

    try {
      console.log("Selected Sarvam Model ID:", selectedModel); 

      const sarvamResult = await initiateSarvamCall({
        phoneNumber: targetPhoneNumber,
        script: script,
      });

      if (sarvamResult.status === 'initiated' && sarvamResult.callId) {
        setSarvamCallStatus(`Call initiated. Sarvam Call ID: ${sarvamResult.callId}`);
        setSarvamCallId(sarvamResult.callId);
        toast({
          title: 'Call Initiated (Sarvam)',
          description: `Call to ${targetPhoneNumber} is being initiated via Sarvam. Call ID: ${sarvamResult.callId}`,
        });
        // For simulation, immediately move to CallCompleted. In reality, this would be based on Sarvam webhooks or polling.
        setCurrentProspectJourneyStage('CallCompleted'); 
      } else {
        setSarvamCallStatus(`Failed to initiate call: ${sarvamResult.message}`);
        toast({
          title: 'Sarvam Call Failed',
          description: sarvamResult.message || 'Could not initiate call via Sarvam.',
          variant: 'destructive',
        });
         setCurrentProspectJourneyStage('CallScriptReady'); // Revert stage on failure
      }
    } catch (error: any) {
      console.error('Failed to initiate Sarvam call:', error);
      setSarvamCallStatus(`Error: ${error.message || 'Failed to initiate call via Sarvam.'}`);
      toast({
        title: 'Error',
        description: 'Failed to initiate call via Sarvam.',
        variant: 'destructive',
      });
       setCurrentProspectJourneyStage('CallScriptReady'); // Revert stage on failure
    } finally {
      setIsCalling(false);
    }
  };

  if (!script || !callId) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading script details...</p>
      </div>
    );
  }

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
          <CardTitle className="text-3xl font-bold text-primary">Select Sarvam AI Model &amp; Initiate Call</CardTitle>
          <CardDescription className="text-muted-foreground">
            Choose the Sarvam AI voice model for your call and provide the target phone number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="scriptPreview" className="text-lg font-semibold">Approved Call Script</Label>
            <Textarea id="scriptPreview" value={script} readOnly rows={8} className="bg-muted/30" />
            <p className="text-sm text-muted-foreground">Internal Call Record ID: {callId}</p>
            {leadId && <p className="text-sm text-muted-foreground">Lead ID: {leadId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sarvamModel" className="text-lg font-semibold">Sarvam AI Voice Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="sarvamModel" className="max-w-md">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                {SARVAM_MODELS.map(model => (
                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetPhoneNumber" className="text-lg font-semibold">Target Phone Number</Label>
            <Input 
              id="targetPhoneNumber" 
              type="tel"
              value={targetPhoneNumber} 
              onChange={e => setTargetPhoneNumber(e.target.value)} 
              placeholder="E.g., +15551234567 (include country code)" 
              className="max-w-md"
            />
          </div>

          <Button 
            onClick={handleInitiateCall} 
            disabled={isCalling || !targetPhoneNumber || !selectedModel || currentProspectJourneyStage !== 'CallScriptReady'} 
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {isCalling ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Phone className="mr-2 h-5 w-5" />}
            {isCalling ? 'Initiating Call...' : 'Initiate Call with Sarvam AI'}
          </Button>
          {currentProspectJourneyStage !== 'CallScriptReady' && <p className="text-sm text-muted-foreground">Ensure script is ready before initiating call.</p>}


          {sarvamCallStatus && (
            <p className={`mt-4 text-sm font-medium ${sarvamCallId ? 'text-green-600' : 'text-destructive'}`}>{sarvamCallStatus}</p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => router.back()}> <Bot className="mr-2 h-4 w-4" />Back to Script Approval</Button>
        
        {sarvamCallId && currentProspectJourneyStage === 'CallCompleted' && ( 
          <Link href={`/risk-lead-visualization?callId=${callId}&sarvamCallId=${sarvamCallId}&stage=${currentProspectJourneyStage}`} passHref>
            <Button>Next: Risk &amp; Lead Visualization <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        )}
         {!sarvamCallId && (
            <Link href="/" passHref>
                 <Button variant="outline"> <HomeIcon className="mr-2 h-4 w-4" /> Dashboard</Button>
            </Link>
        )}
      </div>
    </div>
  );
}

export default function SelectSarvamModelPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto p-4 flex justify-center items-center min-h-[300px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 <p className="ml-3 text-lg text-muted-foreground">Loading AI Model Selection...</p>
            </div>
        }>
            <SelectSarvamModelContent />
        </Suspense>
    )
}
