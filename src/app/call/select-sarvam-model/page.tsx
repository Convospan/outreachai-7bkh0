// src/app/call/select-sarvam-model/page.tsx
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { initiateSarvamCall } from '@/services/sarvam';
import ProspectJourneyVisualizer, { type ProspectStage } from '@/components/ProspectJourneyVisualizer';
import { Loader2, PhoneOutgoing, AlertTriangle, ArrowLeft, HomeIcon, UserCheck, LinkedinIcon, Send, MessageSquare, Mail, BotMessageSquare, ShieldCheck, Edit, PlayCircle, CalendarPlus, CheckCircle } from 'lucide-react';


const prospectJourneyStages: ProspectStage[] = [
  { id: 'Identified', name: 'Identified', icon: <UserCheck className="h-4 w-4" /> },
  { id: 'LinkedInConnected', name: 'LinkedIn Connected', icon: <LinkedinIcon className="h-4 w-4" /> },
  { id: 'LinkedInIntroSent', name: 'Intro Message Sent', icon: <Send className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp1', name: 'Follow-up 1 Sent', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp2', name: 'Follow-up 2 Sent', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'EmailAddressCaptured', name: 'Email Captured', icon: <Mail className="h-4 w-4" /> },
  { id: 'EmailDripInitiated', name: 'Email Drip Setup (Coming Soon)', icon: <BotMessageSquare className="h-4 w-4" /> },
  { id: 'ComplianceChecked', name: 'Compliance Checked', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'CallScriptReady', name: 'Call Script Ready', icon: <Edit className="h-4 w-4" /> },
  { id: 'AICallInProgress', name: 'AI Call (Coming Soon)', icon: <PlayCircle className="h-4 w-4" /> },
  { id: 'CallScheduled', name: 'Call Scheduled (GCal)', icon: <CalendarPlus className="h-4 w-4" /> },
  { id: 'CallCompleted', name: 'Call Completed', icon: <PhoneOutgoing className="h-4 w-4" /> },
  { id: 'LeadQualified', name: 'Lead Qualified', icon: <CheckCircle className="h-4 w-4" /> },
];


interface SarvamModel {
  id: string;
  name: string;
  description: string;
  voiceCharacteristics: string[];
}

// Placeholder for available Sarvam AI models
const availableSarvamModels: SarvamModel[] = [
  { id: 'sarvam-voice-alpha', name: 'Alpha Voice (General Purpose)', description: 'A balanced and clear voice suitable for most professional interactions.', voiceCharacteristics: ['Clear', 'Professional', 'Neutral Tone'] },
  { id: 'sarvam-voice-beta-energetic', name: 'Beta Voice (Energetic & Friendly)', description: 'An upbeat and friendly voice, good for engaging and positive messaging.', voiceCharacteristics: ['Energetic', 'Friendly', 'Persuasive'] },
  { id: 'sarvam-voice-gamma-calm', name: 'Gamma Voice (Calm & Authoritative)', description: 'A calm and measured voice, suitable for more formal or informative calls.', voiceCharacteristics: ['Calm', 'Authoritative', 'Deep Tone'] },
];

function SelectSarvamModelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [selectedModelId, setSelectedModelId] = useState<string>(availableSarvamModels[0]?.id || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callResult, setCallResult] = useState<{ callId?: string; status: string; message?: string } | null>(null);

  // Retrieve parameters from query string
  const script = decodeURIComponent(searchParams.get('script') || '');
  const callId = searchParams.get('callId') || ''; // Internal call record ID
  const leadId = searchParams.get('leadId') || '';
  const campaignName = decodeURIComponent(searchParams.get('campaignName') || 'N/A');
  // ... other params if needed

  const [currentProspectJourneyStage, setCurrentProspectJourneyStage] = useState<ProspectStage['id']>(
    searchParams.get('stage') as ProspectStage['id'] || 'CallScriptReady'
  );


  const handleInitiateCall = async () => {
     toast({
        title: "Feature Coming Soon",
        description: "AI calling with Sarvam models will be available soon. Call not initiated.",
        variant: "default"
    });
    setCurrentProspectJourneyStage('AICallInProgress'); // Update stage even if it's a placeholder

    // Original logic commented out:
    /*
    if (!phoneNumber || !selectedModelId || !script) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a phone number, select a model, and ensure a script is available.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setCallResult(null);
    try {
      const result = await initiateSarvamCall({
        phoneNumber,
        script,
        modelId: selectedModelId,
      });
      setCallResult(result);
      if (result.status === 'initiated') {
        toast({
          title: 'Call Initiated!',
          description: `Sarvam AI call initiated. Call ID: ${result.callId}`,
        });
        setCurrentProspectJourneyStage('AICallInProgress');
        // Navigate to a call status/monitoring page or back to campaign, passing Sarvam call ID
        router.push(`/risk-lead-visualization?stage=AICallInProgress&leadId=${leadId}&campaignName=${encodeURIComponent(campaignName)}&sarvamCallId=${result.callId}`);
      } else {
        toast({
          title: 'Call Initiation Failed',
          description: result.message || 'Could not initiate call via Sarvam AI.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
    */
  };
  
  const selectedModelDetails = availableSarvamModels.find(model => model.id === selectedModelId);

  return (
    <div className="container mx-auto p-4 md:p-8">
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
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <PhoneOutgoing className="mr-3 h-8 w-8" /> Select Sarvam AI Model & Initiate Call
          </CardTitle>
          <CardDescription>
            Choose an AI voice model for your call. AI Calling feature is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-lg">Lead's Phone Number</Label>
            <Input 
              id="phoneNumber" 
              type="tel" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              placeholder="+1 (555) 123-4567" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sarvamModel" className="text-lg">Sarvam AI Voice Model</Label>
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
              <SelectTrigger id="sarvamModel">
                <SelectValue placeholder="Select a Sarvam AI Model" />
              </SelectTrigger>
              <SelectContent>
                {availableSarvamModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             {selectedModelDetails && (
                <Card className="mt-2 p-3 bg-muted/50 border-primary/30">
                    <CardDescription className="text-sm">
                        <strong>Description:</strong> {selectedModelDetails.description} <br />
                        <strong>Characteristics:</strong> {selectedModelDetails.voiceCharacteristics.join(', ')}
                    </CardDescription>
                </Card>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="callScriptPreview" className="text-lg">Call Script Preview (Read-only)</Label>
            <Textarea id="callScriptPreview" value={script} readOnly rows={6} className="bg-muted/30" />
          </div>
          
          <Button onClick={handleInitiateCall} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white" size="lg" disabled>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
            Initiate AI Call (Coming Soon)
          </Button>

          {callResult && (
            <div className={`mt-4 p-3 rounded-md ${callResult.status === 'initiated' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border ${callResult.status === 'initiated' ? 'border-green-300' : 'border-red-300'}`}>
              <p className="font-semibold flex items-center">
                {callResult.status === 'initiated' ? <CheckCircle className="h-5 w-5 mr-2"/> : <AlertTriangle className="h-5 w-5 mr-2"/>}
                Status: {callResult.status.charAt(0).toUpperCase() + callResult.status.slice(1)}
              </p>
              {callResult.message && <p className="text-sm">{callResult.message}</p>}
              {callResult.callId && <p className="text-sm">Sarvam Call ID: {callResult.callId}</p>}
            </div>
          )}
            {currentProspectJourneyStage === 'AICallInProgress' && !callResult && (
                 <p className="text-muted-foreground mt-4">The AI calling feature is under development. This page is a placeholder for selecting the AI model and initiating the call.</p>
            )}
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Script Approval
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          <HomeIcon className="mr-2 h-4 w-4" /> Dashboard
        </Button>
      </div>
    </div>
  );
}


export default function SelectSarvamModelPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-3 text-lg text-muted-foreground">Loading AI Model Selection...</p>
            </div>
        }>
            <SelectSarvamModelContent />
        </Suspense>
    )
}
