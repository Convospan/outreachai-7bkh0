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
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {toast} from '@/hooks/use-toast';
import { initiateSarvamCall } from '@/services/sarvam';
import Link from 'next/link';
import { Phone, Bot, ChevronRight, HomeIcon, Loader2 } from 'lucide-react';

// Define available Sarvam AI models/voices - this would ideally come from Sarvam or config
const SARVAM_MODELS = [
  { id: 'sarvam-default-voice', name: 'Sarvam Default Voice (General)' },
  { id: 'sarvam-professional-male', name: 'Sarvam Professional Male' },
  { id: 'sarvam-friendly-female', name: 'Sarvam Friendly Female' },
  // Add more models as available/needed
];

function SelectSarvamModelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [script, setScript] = useState('');
  const [callId, setCallId] = useState('');
  const [leadId, setLeadId] = useState('');
  // Other params can be stored if needed for context or display
  const [campaignDetails, setCampaignDetails] = useState<any>({});


  const [selectedModel, setSelectedModel] = useState<string>(SARVAM_MODELS[0].id);
  const [targetPhoneNumber, setTargetPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [sarvamCallStatus, setSarvamCallStatus] = useState<string | null>(null);
  const [sarvamCallId, setSarvamCallId] = useState<string | null>(null);

  useEffect(() => {
    const scriptParam = searchParams.get('script');
    const callIdParam = searchParams.get('callId');
    const leadIdParam = searchParams.get('leadId');
    
    if (scriptParam) setScript(decodeURIComponent(scriptParam));
    if (callIdParam) setCallId(callIdParam);
    if (leadIdParam) setLeadId(leadIdParam);

    // Store other params for context if needed
    setCampaignDetails({
        campaignName: searchParams.get('campaignName') ? decodeURIComponent(searchParams.get('campaignName')!) : '',
        productName: searchParams.get('productName') ? decodeURIComponent(searchParams.get('productName')!) : '',
        // ... and so on for other params
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

    try {
      // In a real scenario, the 'modelId' might be passed to Sarvam
      // For now, we are just logging it, as the `initiateSarvamCall` doesn't use it yet
      console.log("Selected Sarvam Model ID:", selectedModel); 

      const sarvamResult = await initiateSarvamCall({
        phoneNumber: targetPhoneNumber,
        script: script,
        // Potentially add `modelId: selectedModel` if Sarvam SDK supports it
      });

      if (sarvamResult.status === 'initiated' && sarvamResult.callId) {
        setSarvamCallStatus(`Call initiated. Sarvam Call ID: ${sarvamResult.callId}`);
        setSarvamCallId(sarvamResult.callId);
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
      }
    } catch (error: any) {
      console.error('Failed to initiate Sarvam call:', error);
      setSarvamCallStatus(`Error: ${error.message || 'Failed to initiate call via Sarvam.'}`);
      toast({
        title: 'Error',
        description: 'Failed to initiate call via Sarvam.',
        variant: 'destructive',
      });
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
      <Card className="shadow-xl drop-shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Select Sarvam AI Model & Initiate Call</CardTitle>
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
            disabled={isCalling || !targetPhoneNumber || !selectedModel} 
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Phone className="mr-2 h-5 w-5" />
            {isCalling ? 'Initiating Call...' : 'Initiate Call with Sarvam AI'}
          </Button>

          {sarvamCallStatus && (
            <p className={`mt-4 text-sm font-medium ${sarvamCallId ? 'text-green-600' : 'text-destructive'}`}>{sarvamCallStatus}</p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between mt-8">
        <Link href="/call/approve" passHref>
          <Button variant="outline"> <Bot className="mr-2 h-4 w-4" />Back to Script Generation</Button>
        </Link>
        {sarvamCallId && ( 
          <Link href={`/risk-lead-visualization?callId=${callId}&sarvamCallId=${sarvamCallId}`} passHref>
            <Button>Next: Risk & Lead Visualization <ChevronRight className="ml-2 h-4 w-4" /></Button>
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
        <Suspense fallback={<div>Loading...</div>}>
            <SelectSarvamModelContent />
        </Suspense>
    )
}
