
/* eslint-disable react/no-unescaped-entities */
'use client';

import type {GenerateOutreachSequenceOutput} from '@/ai/flows/generate-outreach-sequence';
import {generateOutreachScript, type GenerateOutreachScriptInput, type GenerateOutreachScriptOutput} from '@/ai/flows/generate-outreach-script';
import {enrichLinkedInProfile, type EnrichLinkedInProfileInput} from '@/ai/flows/enrich-linkedin-profile';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import type {EmailProfile} from '@/services/email';
import type {LinkedInProfile} from '@/services/linkedin'; // Interface is still useful
// import {getLinkedInProfileByToken, sendLinkedInMessage, fetchLinkedInMessages } from '@/services/linkedin'; // Direct API calls removed
import type {TwitterProfile} from '@/services/twitter';
import Link from 'next/link';
import {useEffect, useState, Suspense, useCallback} from 'react';
import { BotMessageSquare, MessageSquare, Send, Mail, LinkedinIcon, UserCheck, PhoneOutgoing, CheckCircle, ShieldCheck, Edit, PlayCircle, ArrowLeft, HomeIcon, ChevronRight, Loader2, Download } from 'lucide-react';
import ProspectJourneyVisualizer, { type ProspectStage } from '@/components/ProspectJourneyVisualizer';
import { useRouter, useSearchParams } from 'next/navigation';


interface MessageTemplate {
  platform: 'linkedin' | 'twitter' | 'email' | 'whatsapp';
  template: string;
}

interface ConversationMessage {
  sender: 'user' | 'prospect';
  message: string;
  timestamp: Date;
}

const prospectJourneyStages: ProspectStage[] = [
  { id: 'Identified', name: 'Identified', icon: <UserCheck className="h-4 w-4" /> },
  { id: 'LinkedInDataFetched', name: 'LinkedIn Data (via Extension)', icon: <LinkedinIcon className="h-4 w-4" /> },
  { id: 'LinkedInIntroSent', name: 'Intro Message Sent (via Extension/Backend)', icon: <Send className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp1', name: 'Follow-up 1 Sent (via Extension/Backend)', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp2', name: 'Follow-up 2 Sent (via Extension/Backend)', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'EmailAddressCaptured', name: 'Email Captured', icon: <Mail className="h-4 w-4" /> },
  { id: 'EmailDripInitiated', name: 'Email Drip (Coming Soon)', icon: <BotMessageSquare className="h-4 w-4" /> },
  { id: 'ComplianceChecked', name: 'Compliance Checked', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'AICallInProgress', name: 'AI Call (Coming Soon)', icon: <PlayCircle className="h-4 w-4" /> },
  { id: 'CallCompleted', name: 'Call Completed', icon: <PhoneOutgoing className="h-4 w-4" /> }, // Assuming this relates to manual or future AI calls
  { id: 'LeadQualified', name: 'Lead Qualified', icon: <CheckCircle className="h-4 w-4" /> },
];


function CampaignPageContent() {
  const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'email' | 'whatsapp'>('linkedin');
  const [currentMessage, setCurrentMessage] = useState('');
  // linkedinUsername might still be useful if user manually inputs it as a target
  const [linkedinUsername, setLinkedInUsername] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [prospectEmailForDrip, setProspectEmailForDrip] = useState('');

  // linkedinProfile will now be populated by data received from the Chrome extension (via backend)
  // or manually entered by the user if the extension isn't used for a particular lead.
  const [linkedinProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const [emailProfile, setEmailProfile] = useState<EmailProfile | null>(null);

  const [additionalContext, setAdditionalContext] = useState('Looking to introduce ConvoSpan AI, a B2B outreach automation tool.');
  const {toast} = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();


  const [linkedinConversation, setLinkedinConversation] = useState<ConversationMessage[]>([]);
  const [isLinkedInOutreachActive, setIsLinkedInOutreachActive] = useState(false); // May change meaning now
  const [currentObjective, setCurrentObjective] = useState<GenerateOutreachScriptInput['objective']>('build_rapport');
  const [suggestedNextObjective, setSuggestedNextObjective] = useState<GenerateOutreachScriptOutput['suggestedNextObjective'] | undefined>(undefined);
  const [isLoadingLinkedInData, setIsLoadingLinkedInData] = useState(false); // Could be used when waiting for extension data
  // linkedInAccessToken is no longer needed for direct API calls from this page
  // const [linkedInAccessToken, setLinkedInAccessToken] = useState<string | null>(null);


  const [companyName, setCompanyName] = useState(''); // Still useful for enrichment context
  const [includeCallToAction, setIncludeCallToAction] = useState(true);


  const [currentProspectJourneyStage, setCurrentProspectJourneyStage] = useState<ProspectStage['id']>('Identified');
  const [leadId, setLeadId] = useState<string | null>(null); // This would be the ID of the lead record in Firestore

  // This effect might change. Instead of fetching profile with token,
  // it might check if profile data exists (e.g., fetched by extension and stored).
  useEffect(() => {
    // If platform is LinkedIn, check if we have profile data for the current leadId
    // This data would have been populated by the Chrome extension sending it to our backend.
    const checkLinkedInData = async () => {
      if (platform === 'linkedin' && leadId) {
        setIsLoadingLinkedInData(true);
        try {
          // Simulate fetching stored profile data for this leadId from your backend
          // const response = await fetch(`/api/leads/${leadId}/linkedin-profile`);
          // const data = await response.json();
          // if (data.profile) {
          //   setLinkedInProfile(data.profile);
          //   setIsLinkedInOutreachActive(true);
          //   setCurrentProspectJourneyStage('LinkedInDataFetched');
          // } else {
          //   toast({title: "LinkedIn Profile Needed", description: "No LinkedIn data found for this lead. Use the Chrome extension on their profile.", variant: "destructive"});
          //   setCurrentProspectJourneyStage('Identified');
          // }
          // For now, let's assume if user selects LinkedIn and has a lead, we ask them to use extension
          // Or they manually input target data
           toast({title: "LinkedIn Outreach", description: "Ensure the Chrome extension has captured data for the target lead, or manually input target details.", variant: "default"});
           setCurrentProspectJourneyStage('LinkedInDataFetched'); // Assume data will be available or entered
        } catch (error: any) {
          toast({ title: 'Error', description: 'Could not check for LinkedIn profile data.', variant: 'destructive' });
        } finally {
          setIsLoadingLinkedInData(false);
        }
      }
    };
    checkLinkedInData();
  }, [platform, leadId, toast]);


  const handleGenerateAndQueueMessage = useCallback(async (isIntroductory = false) => {
    let profileDataForScript: GenerateOutreachScriptInput['linkedinProfile'] = undefined;

    if (platform === 'linkedin') {
      if (linkedinProfile) { // Data might be manually set or previously fetched
        profileDataForScript = { id: linkedinProfile.id, headline: linkedinProfile.headline, profileUrl: linkedinProfile.profileUrl };
      } else if (linkedinUsername) {
        // If no full profile, but username is entered, use that as a minimal identifier.
        // The script might be less personalized but can still be generated.
        // Enrichment might happen on the backend if this username is then processed.
        profileDataForScript = { id: linkedinUsername, headline: `Profile for ${linkedinUsername}`, profileUrl: `https://linkedin.com/in/${linkedinUsername}` };
        toast({ title: "Using LinkedIn Username", description: "Generating script based on username. For richer personalization, ensure full profile data is captured via the extension.", variant: "default"});
      } else {
        toast({ title: "LinkedIn Target Needed", description: "Please provide a LinkedIn profile (via extension) or enter a username.", variant: "destructive" });
        return;
      }
    }

    // Determine the next stage based on conversation history
    const existingUserMessagesCount = linkedinConversation.filter(m => m.sender === 'user').length;
    let nextStage: ProspectStage['id'] = currentProspectJourneyStage;
    if (platform === 'linkedin') {
        if (isIntroductory) {
            nextStage = 'LinkedInIntroSent';
        } else if (existingUserMessagesCount === 0) { // First message after intro
            nextStage = 'LinkedInFollowUp1';
        } else if (existingUserMessagesCount === 1) { // Second message after intro
            nextStage = 'LinkedInFollowUp2';
        }
        // If more follow-ups, stage might stay or transition based on response
    }


    const input: GenerateOutreachScriptInput = {
      platform: platform,
      linkedinProfile: profileDataForScript,
      // twitterProfile: if platform is twitter, populate this
      // emailProfile: if platform is email, populate this
      additionalContext: additionalContext,
      includeCallToAction: includeCallToAction,
      conversationHistory: isIntroductory ? [] : linkedinConversation.map(m => ({sender: m.sender, message: m.message})),
      isIntroductoryMessage: isIntroductory,
      objective: currentObjective,
    };

    try {
      const result = await generateOutreachScript(input);
      const aiMessage = result.script;
      setSuggestedNextObjective(result.suggestedNextObjective);

      // TODO: Instead of direct API call, this message needs to be queued
      // for the Chrome extension or a backend automation (like the Puppeteer function) to send.
      // This might involve an API call to your backend to add to an action queue for the lead.
      // For example: await fetch(`/api/leads/${leadId}/queue-action`, { method: 'POST', body: JSON.stringify({ type: 'sendMessage', platform: 'linkedin', content: aiMessage }) });

      setLinkedinConversation(prev => [...prev, { sender: 'user', message: aiMessage, timestamp: new Date() }]);
      setCurrentProspectJourneyStage(nextStage);
      toast({ title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Message Generated`, description: 'Message content ready. It will be sent via configured automation (e.g., Chrome Extension or backend queue).' });

      // Simulate receiving a reply for demo purposes if objective was to get email
      if (currentObjective === 'request_email' && platform === 'linkedin') {
        setTimeout(() => {
          const simulatedReply = `Sure, my email is test.prospect@example.com.`;
          setLinkedinConversation(prev => [...prev, { sender: 'prospect', message: simulatedReply, timestamp: new Date() }]);
          setProspectEmailForDrip('test.prospect@example.com');
          setSuggestedNextObjective('transition_to_email');
          setCurrentProspectJourneyStage('EmailAddressCaptured');
          toast({title: "Email Captured!", description: `Prospect's email test.prospect@example.com captured from simulated reply.`});
        }, 3000);
      }


    } catch (error: any) {
      console.error(`Failed to generate ${platform} message:`, error);
      toast({ title: 'Error', description: error.message || `Failed to process ${platform} message.`, variant: 'destructive' });
    }
  }, [platform, linkedinProfile, linkedinUsername, additionalContext, includeCallToAction, linkedinConversation, currentObjective, toast, leadId]);


  const handleTransitionToEmail = () => {
    if (!prospectEmailForDrip) {
        toast({title: "Prospect Email Missing", description: "Cannot start email drip without prospect's email.", variant: "destructive"});
        return;
    }
    // Navigate to email drip page, passing necessary info
    router.push(`/campaign/email-drip?emails=${encodeURIComponent(prospectEmailForDrip)}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || 'Campaign')}&stage=EmailAddressCaptured`);
  };

  const handleConnectLinkedInInfo = () => {
    router.push('/campaign/create/linkedin-auth');
  }


  return (
    <div className="container mx-auto p-4 md:p-8 bg-background">
        <Card className="mb-6 shadow-lg drop-shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Prospect Journey Visualizer</CardTitle>
                <CardDescription>Track the prospect's progress through the outreach funnel. Lead ID: {leadId || "Not Set"}</CardDescription>
            </CardHeader>
            <CardContent>
                <ProspectJourneyVisualizer stages={prospectJourneyStages} currentStageId={currentProspectJourneyStage} />
            </CardContent>
        </Card>

      <Card className="shadow-xl drop-shadow-lg border-primary">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary">Campaign Automation Hub</CardTitle>
          <CardDescription className="text-muted-foreground">Orchestrate your outreach. For LinkedIn, ensure the ConvoSpan AI Chrome Extension is active.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="platform">Primary Outreach Platform</Label>
              <Select onValueChange={value => {
                  setPlatform(value as 'linkedin' | 'twitter' | 'email' | 'whatsapp');
                  setIsLinkedInOutreachActive(value === 'linkedin'); // Simplified logic
                  setCurrentProspectJourneyStage('Identified');
              }} defaultValue="linkedin">
                <SelectTrigger id="platform"><SelectValue placeholder="Select a platform" /></SelectTrigger>
                <SelectContent>
                            <SelectItem value="linkedin">LinkedIn (via Extension)</SelectItem>
                            <SelectItem value="email" disabled>Email Drip (Coming Soon)</SelectItem>
                            <SelectItem value="whatsapp" disabled>WhatsApp (Coming Soon)</SelectItem>
                            <SelectItem value="twitter" disabled>Twitter/X (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {platform === 'linkedin' && (
              <div className="space-y-1">
                 <Label htmlFor="linkedinUsername">Target LinkedIn Username (if extension not used for this lead)</Label>
                 <Input id="linkedinUsername" value={linkedinUsername} onChange={e => setLinkedInUsername(e.target.value)} placeholder="e.g., 'johndoe' or full URL" />
                 <Button onClick={handleConnectLinkedInInfo} variant="link" size="sm" className="p-0 h-auto text-xs">How to use with LinkedIn?</Button>
              </div>
            )}
             {platform === 'email' && (
              <div>
                <Label htmlFor="directEmailAddress">Target Email Address</Label>
                <Input id="directEmailAddress" type="email" value={emailAddress} onChange={e => {setEmailAddress(e.target.value); if(e.target.value) setCurrentProspectJourneyStage('EmailAddressCaptured');}} placeholder="prospect@example.com" />
              </div>
            )}
          </div>
          {platform === 'linkedin' && !isLoadingLinkedInData && !linkedinProfile &&
            <Card className="border-accent bg-accent/10">
                <CardContent className="pt-4 text-sm text-accent-foreground">
                    <p className="font-semibold flex items-center"><Download className="h-4 w-4 mr-2"/>Using LinkedIn with ConvoSpan AI</p>
                    <p>For the best experience and to fetch LinkedIn profile data automatically, please ensure the ConvoSpan AI Chrome Extension is installed and you are on the prospect's LinkedIn profile page.</p>
                    <Button size="sm" variant="outline" className="mt-2 border-accent text-accent hover:bg-accent/20" onClick={handleConnectLinkedInInfo}>Learn More & Get Extension</Button>
                </CardContent>
            </Card>
          }


          <div>
            <Label htmlFor="additionalContext">Overall Campaign Context/Goal</Label>
            <Textarea id="additionalContext" value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} placeholder="E.g., Introduce new SaaS product for project management, target VPs of Engineering." />
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="includeCallToAction" checked={includeCallToAction} onCheckedChange={checked => setIncludeCallToAction(checked as boolean)} />
            <Label htmlFor="includeCallToAction">Attempt to include a Call to Action (e.g., request email, schedule call)</Label>
          </div>

          {platform === 'linkedin' && (isLinkedInOutreachActive || linkedinUsername || linkedinProfile) && (
            <Card className="mt-4 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center"><LinkedinIcon className="mr-2 h-6 w-6 text-blue-700" /> LinkedIn Conversation with {linkedinProfile?.firstName || linkedinUsername || "Target"}</CardTitle>
                <CardDescription>AI-driven message sequence. Current Objective: <span className="font-semibold text-primary">{currentObjective?.replace(/_/g, ' ')}</span></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 h-64 overflow-y-auto p-2 border rounded-md mb-3 bg-muted/30">
                  {linkedinConversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-2.5 rounded-lg shadow-md ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground border'}`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs text-muted-foreground/80 mt-1 text-right">{msg.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                   {linkedinConversation.length === 0 && !isLoadingLinkedInData && <p className="text-muted-foreground text-center py-4">Introductory message will be generated and queued...</p>}
                   {isLoadingLinkedInData && <div className="flex justify-center items-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary"/> <p className="ml-2">Loading...</p></div>}
                </div>
                 <div className="flex flex-wrap items-center gap-2">
                     <Select value={currentObjective} onValueChange={(val) => setCurrentObjective(val as GenerateOutreachScriptInput['objective'])}>
                        <SelectTrigger className="w-full sm:w-[200px]"> <SelectValue placeholder="Set Message Objective"/> </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="build_rapport">Build Rapport</SelectItem>
                            <SelectItem value="gather_information">Gather Information</SelectItem>
                            <SelectItem value="request_email">Request Email</SelectItem>
                            <SelectItem value="schedule_call">Schedule Call (Manual)</SelectItem>
                            <SelectItem value="general_follow_up">General Follow-up</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => handleGenerateAndQueueMessage(linkedinConversation.length === 0)} className="bg-blue-600 hover:bg-blue-700 flex-grow sm:flex-grow-0" disabled={isLoadingLinkedInData}>
                        <Send className="mr-2 h-4 w-4" /> {linkedinConversation.length === 0 ? 'Generate & Queue Intro' : 'Generate & Queue Follow-up'}
                    </Button>
                </div>
                 {suggestedNextObjective === 'transition_to_email' && prospectEmailForDrip && (
                    <Button onClick={handleTransitionToEmail} className="mt-3 w-full bg-green-600 hover:bg-green-700">
                        <Mail className="mr-2 h-4 w-4"/> Configure Email Drip for {prospectEmailForDrip}
                    </Button>
                )}
                 {platform === 'linkedin' && (suggestedNextObjective === 'schedule_call' || currentObjective === 'schedule_call') && (
                    <p className="mt-3 text-sm text-green-600">Prospect seems interested in a call! Proceed to manual scheduling or (soon) AI Call agent.</p>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      <div className="flex flex-wrap justify-between items-center mt-6 gap-2">
        <Button variant="outline" onClick={() => router.push('/')}> <HomeIcon className="mr-2 h-4 w-4" /> Dashboard</Button>
        <div className="flex gap-2">
            {currentProspectJourneyStage !== 'Identified' && currentProspectJourneyStage !== 'LinkedInDataFetched' && (
                <Link href={`/compliance/check?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || 'Campaign')}`} passHref>
                    <Button variant="outline">Next: Compliance Check <ChevronRight className="ml-2 h-4 w-4" /></Button>
                </Link>
            )}
            {(currentProspectJourneyStage === 'ComplianceChecked' || currentProspectJourneyStage === 'AICallInProgress') && ( // Simplified for placeholder
                <Link href={`/call/approve?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || 'Campaign')}`} passHref>
                    <Button>Next: AI Call Agent (Coming Soon) <ChevronRight className="ml-2 h-4 w-4" /></Button>
                </Link>
            )}
             {currentProspectJourneyStage === 'CallCompleted' && (
                 <Link href={`/risk-lead-visualization?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || 'Campaign')}`} passHref>
                     <Button variant="default">View Risk & Lead Visualization <ChevronRight className="ml-2 h-4 w-4" /></Button>
                 </Link>
             )}
        </div>
      </div>
    </div>
  );
}

export default function CampaignPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto p-4 flex justify-center items-center min-h-[500px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-3 text-lg text-muted-foreground">Loading Campaign Hub...</p>
            </div>
        }>
            <CampaignPageContent />
        </Suspense>
    )
}
