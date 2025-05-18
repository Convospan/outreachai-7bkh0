"use client";

import { useState, useEffect } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { ComplianceStatus, checkCompliance } from '@/services/compliance';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {useToast} from "@/hooks/use-toast";
import ProspectJourneyVisualizer, { type ProspectStage } from '@/components/ProspectJourneyVisualizer';
import { useSearchParams, useRouter } from 'next/navigation';
import { BotMessageSquare, MessageSquare, Send, Mail, CalendarPlus, LinkedinIcon, UserCheck, PhoneOutgoing, CheckCircle, ShieldCheck, Edit, PlayCircle } from 'lucide-react';

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

export default function ComplianceCheckPage() {
  const [script, setScript] = useState('');
  const [consent, setConsent] = useState(false);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [tier, setTier] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const {toast} = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentProspectJourneyStage, setCurrentProspectJourneyStage] = useState<ProspectStage['id']>(
    searchParams.get('stage') as ProspectStage['id'] || 'EmailDripInitiated' // Default or passed via query
  );


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
        // variant: 'warning', // Corrected: Removed invalid variant
      });
    } else { // status.status === 'ok'
      toast({
        title: 'Compliance Check Passed',
        description: status.message,
      });
      setCurrentProspectJourneyStage('ComplianceChecked');
    }
  };

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
          <CardTitle>Compliance Check</CardTitle>
          <CardDescription className="text-muted-foreground">Check if your outreach script is compliant with LinkedIn ToS and GDPR. Compliance checks are only available with active Pro or Enterprise subscriptions.</CardDescription>
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
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
            />
            <Label htmlFor="consent">Consent Given (GDPR)</Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tier">Subscription Tier</Label>
            <Select value={tier} onValueChange={(value) => setTier(value as 'basic' | 'pro' | 'enterprise')}>
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
            <div className={`mt-4 p-4 rounded-md ${complianceStatus.status === 'ok' ? 'bg-green-100 text-green-800' : complianceStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-semibold">Status: {complianceStatus.status.toUpperCase()}</p>
              <p>{complianceStatus.message}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={() => router.back()}>Back to Campaign</Button>
        {complianceStatus?.status === 'ok' && currentProspectJourneyStage === 'ComplianceChecked' && (
          <Link href={`/call/approve?stage=${currentProspectJourneyStage}`} passHref>
            <Button>Next: Approve Call Script</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
