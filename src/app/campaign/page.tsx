
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
// import type {GoogleCalendarEvent} from '@/services/google-calendar'; // Removed GCal
// import {
//   createGoogleCalendarEvent, // Removed GCal
//   createOAuth2Client, // Removed GCal
//   getGoogleCalendarTokensFromCode, // Removed GCal
//   generateGoogleCalendarAuthUrl, // Removed GCal
// } from '@/services/google-calendar'; // Removed GCal
import type {LinkedInProfile} from '@/services/linkedin';
import {getLinkedInProfileByToken, sendLinkedInMessage, fetchLinkedInMessages } from '@/services/linkedin'; // Use getLinkedInProfileByToken
import type {TwitterProfile} from '@/services/twitter';
// import type {Auth} from 'googleapis'; // Removed GCal
import Link from 'next/link';
import {useEffect, useState, Suspense} from 'react';
import { BotMessageSquare, MessageSquare, Send, Mail, CalendarPlus, LinkedinIcon, UserCheck, PhoneOutgoing, CheckCircle, ShieldCheck, Edit, PlayCircle, ArrowLeft, HomeIcon, ChevronRight, Loader2 } from 'lucide-react';
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
  { id: 'LinkedInConnected', name: 'LinkedIn Connected', icon: <LinkedinIcon className="h-4 w-4" /> },
  { id: 'LinkedInIntroSent', name: 'Intro Message Sent', icon: <Send className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp1', name: 'Follow-up 1 Sent', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'LinkedInFollowUp2', name: 'Follow-up 2 Sent', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'EmailAddressCaptured', name: 'Email Captured', icon: <Mail className="h-4 w-4" /> },
  { id: 'EmailDripInitiated', name: 'Email Drip Started', icon: <BotMessageSquare className="h-4 w-4" /> },
  { id: 'ComplianceChecked', name: 'Compliance Checked', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'CallScriptReady', name: 'Call Script Ready', icon: <Edit className="h-4 w-4" /> },
  { id: 'AICallInProgress', name: 'AI Call In Progress', icon: <PlayCircle className="h-4 w-4" /> },
  // { id: 'CallScheduled', name: 'Call Scheduled (GCal)', icon: <CalendarPlus className="h-4 w-4" /> }, // Removed GCal
  { id: 'CallCompleted', name: 'Call Completed', icon: <PhoneOutgoing className="h-4 w-4" /> },
  { id: 'LeadQualified', name: 'Lead Qualified', icon: <CheckCircle className="h-4 w-4" /> },
];


function CampaignPageContent() {
  const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'email' | 'whatsapp'>('linkedin');
  const [currentMessage, setCurrentMessage] = useState('');
  const [linkedinUsername, setLinkedInUsername] = useState(''); 
  const [twitterUsername, setTwitterUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState(''); 
  const [prospectEmailForDrip, setProspectEmailForDrip] = useState('');

  const [linkedinProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const [emailProfile, setEmailProfile] = useState<EmailProfile | null>(null); 

  const [additionalContext, setAdditionalContext] = useState('');
  const {toast} = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();


  const [linkedinConversation, setLinkedinConversation] = useState<ConversationMessage[]>([]);
  const [isLinkedInOutreachActive, setIsLinkedInOutreachActive] = useState(false);
  const [currentObjective, setCurrentObjective] = useState<GenerateOutreachScriptInput['objective']>('build_rapport');
  const [suggestedNextObjective, setSuggestedNextObjective] = useState<GenerateOutreachScriptOutput['suggestedNextObjective'] | undefined>(undefined);
  const [isLoadingLinkedInData, setIsLoadingLinkedInData] = useState(false);
  const [linkedInAccessToken, setLinkedInAccessToken] = useState<string | null>(null);


  const [companyName, setCompanyName] = useState('');
  const [includeCallToAction, setIncludeCallToAction] = useState(true);

  // Google Calendar state removed
  // const [googleAuthClient, setGoogleAuthClient] = useState<Auth.OAuth2Client | null>(null);
  // const [isGoogleCalendarAuthorized, setIsGoogleCalendarAuthorized] = useState(false);
  // const [calendarEventSummary, setCalendarEventSummary] = useState('');
  // const [calendarEventDescription, setCalendarEventDescription] = useState('');
  // const [calendarEventStart, setCalendarEventStart] = useState('');
  // const [calendarEventEnd, setCalendarEventEnd] = useState('');
  // const [calendarEventAttendees, setCalendarEventAttendees] = useState('');
  // const [addGoogleMeet, setAddGoogleMeet] = useState(true);

  const [currentProspectJourneyStage, setCurrentProspectJourneyStage] = useState<ProspectStage['id']>('Identified');
  const [leadId, setLeadId] = useState<string | null>(null); 


  useEffect(() => {
    const token = localStorage.getItem('linkedInAccessToken'); 
    if (token) {
      setLinkedInAccessToken(token);
    }

    // Google Calendar Auth Client Init REMOVED
    // const initGoogleAuthClient = async () => { ... };
    // initGoogleAuthClient();
  }, [toast]);

 // Google Calendar Callback Handling REMOVED
 // useEffect(() => { ... }, [googleAuthClient, isGoogleCalendarAuthorized, toast, router, searchParams]);


  // Google Calendar Authorize function REMOVED
  // const handleGoogleCalendarAuthorize = async () => { ... };

  // Google Calendar Schedule Event function REMOVED
  // const handleScheduleGoogleCalendarEvent = async () => { ... };


  useEffect(() => {
    const fetchAndEnrichLinkedInProfile = async () => {
      if (platform === 'linkedin' && linkedInAccessToken && !linkedinProfile) { 
        setIsLoadingLinkedInData(true);
        setCurrentProspectJourneyStage('Identified');
        try {
          const profile = await getLinkedInProfileByToken(linkedInAccessToken);
          setLeadId(profile.id); 

          const enrichInput: EnrichLinkedInProfileInput = {
            name: profile.firstName || profile.lastName || 'LinkedIn User', 
            company: companyName, 
            linkedinProfile: profile,
            additionalContext: additionalContext,
          };
          const enriched = await enrichLinkedInProfile(enrichInput);
          
          const finalProfile = {
            ...profile,
            headline: enriched.enrichedProfile || profile.headline, 
          };
          setLinkedInProfile(finalProfile);
          setIsLinkedInOutreachActive(true);
          setCurrentProspectJourneyStage('LinkedInConnected');
          // Added handleSendLinkedInMessage, isLoadingLinkedInData, and linkedinProfile to dependencies
          await handleSendLinkedInMessage(true, finalProfile); 

        } catch (error: any) {
          console.error('Failed to fetch/enrich LinkedIn profile:', error);
          toast({ title: 'LinkedIn Profile Error', description: error.message || 'Failed to fetch LinkedIn profile.', variant: 'destructive' });
          setLinkedInAccessToken(null); 
          localStorage.removeItem('linkedInAccessToken');
        } finally {
          setIsLoadingLinkedInData(false);
        }
      } else if (platform === 'linkedin' && !linkedInAccessToken && !isLoadingLinkedInData) {
        // User will be redirected via UI button if not connected
      }
    };

    fetchAndEnrichLinkedInProfile();
  }, [platform, linkedInAccessToken, companyName, additionalContext, toast, handleSendLinkedInMessage, isLoadingLinkedInData, linkedinProfile]); // Added dependencies


 const handleSendLinkedInMessage = async (isIntroductory = false, currentProfileParam?: LinkedInProfile | null) => {
    const profileToUse = currentProfileParam || linkedinProfile;
    if (!profileToUse) {
      toast({ title: "LinkedIn Profile Needed", description: "LinkedIn profile data is not available.", variant: "destructive" });
      return;
    }
     if (!linkedInAccessToken) {
      toast({ title: "LinkedIn Not Connected", description: "Please connect your LinkedIn account first.", variant: "destructive" });
      return;
    }
    
    const newStage = isIntroductory ? 'LinkedInIntroSent' : 
                     linkedinConversation.filter(m => m.sender === 'user').length === 0 ? 'LinkedInFollowUp1' :
                     'LinkedInFollowUp2';
    setCurrentProspectJourneyStage(newStage as ProspectStage['id']);

    const input: GenerateOutreachScriptInput = {
      platform: 'linkedin',
      linkedinProfile: { id: profileToUse.id, headline: profileToUse.headline, profileUrl: profileToUse.profileUrl },
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
      
      const sendResult = await sendLinkedInMessage(profileToUse.id, aiMessage, linkedInAccessToken);
      if (!sendResult.success) {
          throw new Error(sendResult.error || "Failed to send LinkedIn message via API.");
      }

      setLinkedinConversation(prev => [...prev, { sender: 'user', message: aiMessage, timestamp: new Date() }]);
      
      setTimeout(async () => {
        try {
            const lastTimestamp = linkedinConversation.length > 0 ? linkedinConversation[linkedinConversation.length-1].timestamp.getTime() : undefined;
            const fetchedMessagesResult = await fetchLinkedInMessages(profileToUse.id, linkedInAccessToken!, lastTimestamp); // Assuming fetchLinkedInMessages is adjusted
            
            if (fetchedMessagesResult.success && fetchedMessagesResult.messages && fetchedMessagesResult.messages.length > 0) {
                const newProspectMessages = fetchedMessagesResult.messages
                    .map(msg => ({ sender: 'prospect' as 'user' | 'prospect', message: msg.text || "Prospect replied.", timestamp: new Date(msg.timestamp)})); // Simplified sender logic
                
                if(newProspectMessages.length > 0){
                    setLinkedinConversation(prev => [...prev, ...newProspectMessages]);
                    const latestProspectReply = newProspectMessages[newProspectMessages.length -1].message;
                    const emailMatch = latestProspectReply.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
                    if (emailMatch && emailMatch.length > 0) {
                        setProspectEmailForDrip(emailMatch[0]);
                        toast({title: "Email Captured!", description: `Prospect's email ${emailMatch[0]} captured.`});
                        setSuggestedNextObjective('transition_to_email');
                        setCurrentProspectJourneyStage('EmailAddressCaptured');
                    } else {
                        setCurrentObjective(result.suggestedNextObjective || 'continue_linkedin_chat');
                    }
                }
            } else if (fetchedMessagesResult.error) {
                console.warn("Could not fetch prospect replies:", fetchedMessagesResult.error);
            }
        } catch (fetchError: any) {
            console.error("Error fetching prospect messages:", fetchError.message);
        }
      }, 3000 + Math.random() * 2000);

      toast({ title: 'LinkedIn Message Sent', description: 'AI-generated message sent via LinkedIn API.' });
    } catch (error: any) {
      console.error('Failed to generate/send LinkedIn message:', error);
      toast({ title: 'Error', description: error.message || 'Failed to process LinkedIn message.', variant: 'destructive' });
    }
  };

  const handleTransitionToEmail = () => {
    if (!prospectEmailForDrip) {
        toast({title: "Prospect Email Missing", description: "Cannot start email drip without prospect's email.", variant: "destructive"});
        return;
    }
    router.push(`/campaign/email-drip?emails=${encodeURIComponent(prospectEmailForDrip)}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername)}`);
  };

  const handleConnectLinkedIn = () => {
    router.push('/campaign/create/linkedin-auth');
  }


  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card className="mb-6 shadow-lg drop-shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Prospect Journey Visualizer</CardTitle>
                <CardDescription>Track the prospect's progress through the outreach funnel.</CardDescription>
            </CardHeader>
            <CardContent>
                <ProspectJourneyVisualizer stages={prospectJourneyStages} currentStageId={currentProspectJourneyStage} />
            </CardContent>
        </Card>

      <Card className="shadow-xl drop-shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Campaign Automation Hub</CardTitle>
          <CardDescription>Orchestrate your outreach across LinkedIn, Email, WhatsApp, and more.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Primary Outreach Platform</Label>
              <Select onValueChange={value => {
                  setPlatform(value as 'linkedin' | 'twitter' | 'email' | 'whatsapp');
                  setIsLinkedInOutreachActive(value === 'linkedin' && !!linkedinProfile);
                  setCurrentProspectJourneyStage('Identified'); 
              }} defaultValue="linkedin">
                <SelectTrigger id="platform"><SelectValue placeholder="Select a platform" /></SelectTrigger>
                <SelectContent>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="twitter">Twitter/X (Manual Script Gen)</SelectItem>
                            <SelectItem value="email">Email Drip (Direct)</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp (Manual Script Gen)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {platform === 'linkedin' && (
              <>
               {!linkedInAccessToken && !isLoadingLinkedInData && (
                <div className="md:col-span-2">
                    <Button onClick={handleConnectLinkedIn} variant="outline" className="w-full">
                        <LinkedinIcon className="mr-2 h-5 w-5" /> Connect LinkedIn Account
                    </Button>
                </div>
                )}
                {isLoadingLinkedInData && <div className="md:col-span-2 flex items-center justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <p className="ml-2">Loading LinkedIn Data...</p></div>}
                <div>
                  <Label htmlFor="companyName">Company Name (for enrichment)</Label>
                  <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Enter Company Name" />
                </div>
              </>
            )}
            {platform === 'email' && (
              <div>
                <Label htmlFor="directEmailAddress">Target Email Address</Label>
                <Input id="directEmailAddress" type="email" value={emailAddress} onChange={e => {setEmailAddress(e.target.value); if(e.target.value) setCurrentProspectJourneyStage('EmailAddressCaptured');}} placeholder="prospect@example.com" />
              </div>
            )}
             {platform === 'twitter' && (
              <div>
                <Label htmlFor="twitterUsername">Twitter/X Username</Label>
                <Input id="twitterUsername" value={twitterUsername} onChange={e => setTwitterUsername(e.target.value)} placeholder="@username" />
              </div>
            )}
            {platform === 'whatsapp' && (
                 <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input id="whatsappNumber" type="tel" placeholder="+12345678900" />
                </div>
            )}
          </div>

          <div>
            <Label htmlFor="additionalContext">Overall Campaign Context/Goal</Label>
            <Textarea id="additionalContext" value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} placeholder="E.g., Introduce new SaaS product for project management, target VPs of Engineering." />
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="includeCallToAction" checked={includeCallToAction} onCheckedChange={checked => setIncludeCallToAction(checked as boolean)} />
            <Label htmlFor="includeCallToAction">Attempt to include a Call to Action (e.g., request email, schedule call)</Label>
          </div>

          {platform === 'email' && emailAddress && !prospectEmailForDrip && (
             <Button onClick={() => router.push(`/campaign/email-drip?emails=${encodeURIComponent(emailAddress)}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername)}`)} className="w-full bg-green-500 hover:bg-green-600">
                <Mail className="mr-2 h-4 w-4"/> Configure Email Drip for {emailAddress}
             </Button>
          )}


          {platform === 'linkedin' && linkedinProfile && isLinkedInOutreachActive && (
            <Card className="mt-4 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center"><LinkedinIcon className="mr-2 h-6 w-6 text-blue-700" /> LinkedIn Conversation with {linkedinProfile.firstName || linkedinUsername}</CardTitle>
                <CardDescription>AI-driven message sequence. Current Objective: <span className="font-semibold text-primary">{currentObjective?.replace(/_/g, ' ')}</span></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 h-64 overflow-y-auto p-2 border rounded-md mb-3 bg-muted/30">
                  {linkedinConversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-2.5 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground border'}`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs text-muted-foreground/80 mt-1 text-right">{msg.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                   {linkedinConversation.length === 0 && !isLoadingLinkedInData && <p className="text-muted-foreground text-center py-4">Introductory message will be generated...</p>}
                   {isLoadingLinkedInData && <div className="flex justify-center items-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary"/> <p className="ml-2">Loading intro message...</p></div>}
                </div>
                 <div className="flex items-center gap-2">
                     <Select value={currentObjective} onValueChange={(val) => setCurrentObjective(val as GenerateOutreachScriptInput['objective'])}>
                        <SelectTrigger className="w-[200px]"> <SelectValue placeholder="Set Message Objective"/> </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="build_rapport">Build Rapport</SelectItem>
                            <SelectItem value="gather_information">Gather Information</SelectItem>
                            <SelectItem value="request_email">Request Email</SelectItem>
                            <SelectItem value="schedule_call">Schedule Call</SelectItem>
                            <SelectItem value="general_follow_up">General Follow-up</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => handleSendLinkedInMessage(false)} className="bg-blue-600 hover:bg-blue-700" disabled={isLoadingLinkedInData}>
                        <Send className="mr-2 h-4 w-4" /> Generate & Send Next LinkedIn Message
                    </Button>
                </div>
                {suggestedNextObjective === 'transition_to_email' && prospectEmailForDrip && (
                    <Button onClick={handleTransitionToEmail} className="mt-3 w-full bg-green-600 hover:bg-green-700">
                        <Mail className="mr-2 h-4 w-4"/> Configure Email Drip for {prospectEmailForDrip}
                    </Button>
                )}
                 {platform === 'linkedin' && (suggestedNextObjective === 'schedule_call' || currentObjective === 'schedule_call') && (
                    <p className="mt-3 text-sm text-green-600">Prospect seems interested in a call! Use the call approval module to proceed.</p> 
                )}
              </CardContent>
            </Card>
          )}
          
          {platform !== 'linkedin' && platform !== 'email' && (
             <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Generate Script for {platform.charAt(0).toUpperCase() + platform.slice(1)}</CardTitle>
                     <CardDescription>For Twitter/X or WhatsApp, generate a script and then manually send it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={async () => {
                       const input: GenerateOutreachScriptInput = {
                            platform: platform,
                            additionalContext: additionalContext,
                            ...(platform === 'twitter' && twitterProfile ? { twitterProfile: { id: twitterProfile.id, username: twitterProfile.username, name: twitterProfile.name } } : {}),
                            objective: 'general_follow_up', 
                        };
                        try {
                            const result = await generateOutreachScript(input);
                            setCurrentMessage(result.script); 
                            setSuggestedNextObjective(result.suggestedNextObjective);
                             toast({ title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Script Generated` });
                        } catch (error) {
                             console.error(`Failed to generate ${platform} script:`, error);
                             toast({ title: 'Error', description: `Failed to generate ${platform} script.`, variant: 'destructive' });
                        }
                    }} className="w-full">
                       <BotMessageSquare className="mr-2 h-4 w-4" /> Generate {platform.charAt(0).toUpperCase() + platform.slice(1)} Script
                    </Button>
                    {currentMessage && (
                        <div className="mt-4">
                             <Label htmlFor="manualMessage">Generated Script:</Label>
                             <Textarea id="manualMessage" value={currentMessage} readOnly rows={5}/>
                        </div>
                    )}
                     {currentMessage && (suggestedNextObjective === 'schedule_call' || currentObjective === 'schedule_call') && (
                        <p className="mt-3 text-sm text-green-600">Script suggests a call. Proceed to the call approval module.</p>
                    )}
                </CardContent>
             </Card>
          )}


          {/* Google Calendar Accordion REMOVED */}
          {/* <Accordion type="single" collapsible className="w-full mt-6"> ... </Accordion> */}

        </CardContent>
      </Card>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => router.push('/')}> <HomeIcon className="mr-2 h-4 w-4" /> Back to Dashboard</Button>
        {(currentProspectJourneyStage === 'EmailStep3Sent' || currentProspectJourneyStage === 'LinkedInFollowUp2' || currentMessage) && ( 
          <Link href={`/compliance/check?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || 'Campaign')}`} passHref>
            <Button>Next: Check Compliance <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        )}
         {currentProspectJourneyStage === 'CallCompleted' && (
             <Link href={`/risk-lead-visualization?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || 'Campaign')}`} passHref>
                 <Button variant="default">View Risk & Lead Visualization <ChevronRight className="ml-2 h-4 w-4" /></Button>
             </Link>
         )}
          {(currentProspectJourneyStage === 'CallScheduled' || currentProspectJourneyStage === 'AICallInProgress') && (
            <Link href={`/call/approve?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || 'Campaign')}`} passHref>
                <Button>Manage AI Call <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </Link>
        )}
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

