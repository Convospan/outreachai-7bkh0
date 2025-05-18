// src/app/campaign/email-drip/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { GenerateOutreachSequenceOutput } from '@/ai/flows/generate-outreach-sequence';
import ProspectJourneyVisualizer, { type ProspectStage } from '@/components/ProspectJourneyVisualizer';
import { Loader2, Mail, BotMessageSquare, Send, ChevronRight, ArrowLeft, HomeIcon, UserCheck, LinkedinIcon, MessageSquare, ShieldCheck, Edit, PlayCircle, CalendarPlus, PhoneOutgoing, CheckCircle } from 'lucide-react';

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

function EmailDripCampaignPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [targetEmails, setTargetEmails] = useState<string[]>([]);
  const [emailDripPrompt, setEmailDripPrompt] = useState<string>('Follow up on our previous conversation and offer a demo.');
  const [numEmailDripSteps, setNumEmailDripSteps] = useState<number>(3);
  const [generatedSequence, setGeneratedSequence] = useState<GenerateOutreachSequenceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProspectJourneyStage, setCurrentProspectJourneyStage] = useState<ProspectStage['id']>('EmailAddressCaptured');
  const [leadId, setLeadId] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState<string>('');

  useEffect(() => {
    const emailsParam = searchParams.get('emails');
    const leadIdParam = searchParams.get('leadId');
    const campaignNameParam = searchParams.get('campaignName');

    if (emailsParam) {
      setTargetEmails(emailsParam.split(',').map(e => e.trim()).filter(e => e));
    }
    if (leadIdParam) {
      setLeadId(leadIdParam);
    }
    if(campaignNameParam){
      setCampaignName(decodeURIComponent(campaignNameParam));
    }
     if (emailsParam && emailsParam.split(',').map(e => e.trim()).filter(e => e).length > 0) {
        setCurrentProspectJourneyStage('EmailAddressCaptured');
    } else {
        setCurrentProspectJourneyStage('Identified');
    }

  }, [searchParams]);

  const handleGenerateSequence = async () => {
    toast({ title: "Feature Coming Soon", description: "Automated email sequence generation will be available soon.", variant: "default" });
    setCurrentProspectJourneyStage('EmailDripInitiated'); // Update stage even if it's a placeholder action
  };

  const handleLaunchDrip = () => {
    toast({ title: "Feature Coming Soon", description: "Launching email drip campaigns will be available soon.", variant: "default"});
    // router.push(`/compliance/check?stage=EmailDripInitiated&leadId=${leadId || ''}&campaignName=${encodeURIComponent(campaignName)}`);
  };

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
            <Mail className="mr-3 h-8 w-8" /> Configure Email Drip Campaign
          </CardTitle>
          <CardDescription>
            Set up your automated email sequence. Target Emails: {targetEmails.join(', ') || "Define below or from previous step"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!targetEmails.length && (
             <div className="space-y-2">
                <Label htmlFor="targetEmailsInput">Target Email Addresses (comma-separated)</Label>
                <Input 
                    id="targetEmailsInput" 
                    placeholder="e.g., prospect1@example.com, prospect2@example.com"
                    onChange={(e) => setTargetEmails(e.target.value.split(',').map(em => em.trim()).filter(em => em))}
                />
            </div>
          )}
           <div className="space-y-2">
            <Label htmlFor="campaignNameInput">Campaign Name (Optional)</Label>
            <Input 
                id="campaignNameInput" 
                placeholder="E.g., Q3 Product Launch"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailDripPrompt">Email Drip Goal/Core Message</Label>
            <Textarea 
              id="emailDripPrompt" 
              value={emailDripPrompt} 
              onChange={(e) => setEmailDripPrompt(e.target.value)} 
              placeholder="E.g., Nurture new leads from webinar, Introduce feature X and its benefits, Re-engage cold leads..."
              rows={4} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numEmailDripSteps">Number of Emails in Sequence</Label>
            <Input 
              type="number" 
              id="numEmailDripSteps" 
              value={numEmailDripSteps} 
              onChange={(e) => setNumEmailDripSteps(Math.max(1, Math.min(7, Number(e.target.value))))} 
              min="1" 
              max="7" 
            />
          </div>
          <Button onClick={handleGenerateSequence} disabled={targetEmails.length === 0} className="w-full md:w-auto">
            <BotMessageSquare className="mr-2 h-5 w-5" />
            Generate Email Sequence (Coming Soon)
          </Button>

          {generatedSequence && generatedSequence.sequence.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-xl font-semibold text-primary">Generated Email Sequence (Preview):</h3>
              <div className="border rounded-md max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Step</TableHead>
                      <TableHead>Email Content Preview</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedSequence.sequence.map((emailContent, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="whitespace-pre-wrap text-sm">{emailContent.substring(0, 150)}{emailContent.length > 150 ? '...' : ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button onClick={handleLaunchDrip} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white" size="lg" disabled>
                <Send className="mr-2 h-5 w-5" /> Launch Email Drip (Coming Soon)
              </Button>
            </div>
          )}
           {currentProspectJourneyStage === 'EmailDripInitiated' && (!generatedSequence || generatedSequence.sequence.length === 0) && (
            <p className="text-muted-foreground mt-4">Configure your drip campaign details above. Sequence generation and launching are coming soon!</p>
          )}
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {/* Navigation to next step (e.g., compliance) can be conditional based on actual drip launch */}
        <Button variant="outline" onClick={() => router.push(`/compliance/check?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(campaignName)}`)}>
            Next: Compliance Check <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          <HomeIcon className="mr-2 h-4 w-4" /> Dashboard
        </Button>
      </div>
    </div>
  );
}


export default function EmailDripCampaignPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">Loading Email Drip Campaign Setup...</p>
      </div>
    }>
      <EmailDripCampaignPageContent />
    </Suspense>
  )
}
