/* eslint-disable react/no-unescaped-entities */
'use client';

import type {GenerateOutreachSequenceOutput} from '@/ai/flows/generate-outreach-sequence';
import {generateOutreachScript, type GenerateOutreachScriptInput, type GenerateOutreachScriptOutput} from '@/ai/flows/generate-outreach-script';
import {enrichLinkedInProfile, type EnrichLinkedInProfileInput} from '@/ai/flows/enrich-linkedin-profile'; // Corrected type import
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
import type {GoogleCalendarEvent} from '@/services/google-calendar';
import {
  createGoogleCalendarEvent,
  createOAuth2Client,
  getGoogleCalendarTokensFromCode,
  generateGoogleCalendarAuthUrl, // Corrected import name
} from '@/services/google-calendar';
import type {LinkedInProfile} from '@/services/linkedin';
import {getLinkedInProfile} from '@/services/linkedin';
import type {TwitterProfile} from '@/services/twitter';
// import {getTwitterProfile} from '@/services/twitter'; // Assuming getTwitterProfile is available if needed
import type {Auth} from 'googleapis';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import { BotMessageSquare, MessageSquare, Send, Mail, CalendarPlus, LinkedinIcon, UserCheck, PhoneOutgoing, CheckCircle, ShieldCheck, Edit, PlayCircle, ArrowLeft, HomeIcon, ChevronRight } from 'lucide-react';
import ProspectJourneyVisualizer, { type ProspectStage } from '@/components/ProspectJourneyVisualizer';
import { useRouter } from 'next/navigation';


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
  { id: 'CallScheduled', name: 'Call Scheduled (GCal)', icon: <CalendarPlus className="h-4 w-4" /> },
  { id: 'CallCompleted', name: 'Call Completed', icon: <PhoneOutgoing className="h-4 w-4" /> },
  { id: 'LeadQualified', name: 'Lead Qualified', icon: <CheckCircle className="h-4 w-4" /> },
];


export default function CampaignPage() {
  const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'email' | 'whatsapp'>('linkedin');
  const [currentMessage, setCurrentMessage] = useState('');
  const [linkedinUsername, setLinkedInUsername] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState(''); // Used for email drip target
  const [prospectEmailForDrip, setProspectEmailForDrip] = useState(''); // Email obtained from prospect

  const [linkedinProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const [emailProfile, setEmailProfile] = useState<EmailProfile | null>(null); // For general email info if needed

  const [additionalContext, setAdditionalContext] = useState('');
  const {toast} = useToast();
  const router = useRouter();

  // LinkedIn Conversation State
  const [linkedinConversation, setLinkedinConversation] = useState<ConversationMessage[]>([]);
  const [isLinkedInOutreachActive, setIsLinkedInOutreachActive] = useState(false);
  const [currentObjective, setCurrentObjective] = useState<GenerateOutreachScriptInput['objective']>('build_rapport');
  const [suggestedNextObjective, setSuggestedNextObjective] = useState<GenerateOutreachScriptOutput['suggestedNextObjective'] | undefined>(undefined);


  const [companyName, setCompanyName] = useState('');
  const [includeCallToAction, setIncludeCallToAction] = useState(true);

  const [googleAuthClient, setGoogleAuthClient] = useState<Auth.OAuth2Client | null>(null);
  const [isGoogleCalendarAuthorized, setIsGoogleCalendarAuthorized] = useState(false);
  const [calendarEventSummary, setCalendarEventSummary] = useState('');
  const [calendarEventDescription, setCalendarEventDescription] = useState('');
  const [calendarEventStart, setCalendarEventStart] = useState('');
  const [calendarEventEnd, setCalendarEventEnd] = useState('');
  const [calendarEventAttendees, setCalendarEventAttendees] = useState('');
  const [addGoogleMeet, setAddGoogleMeet] = useState(true);

  // Prospect Journey State
  const [currentProspectJourneyStage, setCurrentProspectJourneyStage] = useState<ProspectStage['id']>('Identified');
  const [leadId, setLeadId] = useState<string | null>(null); // To store lead ID if applicable


  useEffect(() => {
    const initGoogleAuthClient = async () => {
      try {
        const client = await createOAuth2Client();
        setGoogleAuthClient(client);
      } catch (error) {
        console.error('Failed to initialize Google Auth Client:', error);
        toast({ title: 'Google Calendar Error', description: 'Could not initialize Google Calendar integration.', variant: 'destructive' });
      }
    };
    initGoogleAuthClient();
  }, [toast]);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code && googleAuthClient && !isGoogleCalendarAuthorized) {
        try {
          const tokens = await getGoogleCalendarTokensFromCode(code, googleAuthClient);
          if (tokens) {
            googleAuthClient.setCredentials(tokens);
            setIsGoogleCalendarAuthorized(true);
            toast({ title: 'Google Calendar Authorized', description: 'Successfully connected to Google Calendar.' });
            window.history.replaceState({}, document.title, window.location.pathname);
             setCurrentProspectJourneyStage('CallScheduled'); // Update journey
          } else {
            throw new Error('Failed to obtain tokens.');
          }
        } catch (error) {
          console.error('Error exchanging Google Calendar code for tokens:', error);
          toast({ title: 'Google Calendar Authorization Failed', description: 'Could not authorize Google Calendar. Please try again.', variant: 'destructive' });
        }
      }
    };
    if (googleAuthClient) handleGoogleCallback();
  }, [googleAuthClient, isGoogleCalendarAuthorized, toast]);

  const handleGoogleCalendarAuthorize = async () => {
    if (googleAuthClient) {
      const authUrl = await generateGoogleCalendarAuthUrl(googleAuthClient); // Changed this
      window.location.href = authUrl;
    } else {
      toast({ title: 'Google Calendar Error', description: 'Google Calendar client not initialized. Please refresh.', variant: 'destructive' });
    }
  };

  const handleScheduleGoogleCalendarEvent = async () => {
    if (!isGoogleCalendarAuthorized || !googleAuthClient) {
      toast({ title: 'Google Calendar Not Authorized', description: 'Please authorize Google Calendar access first.', variant: 'destructive' });
      return;
    }
    if (!calendarEventSummary || !calendarEventStart || !calendarEventEnd) {
      toast({title: 'Missing Event Details', description: 'Please provide summary, start, and end times.', variant: 'destructive'});
      return;
    }
    const eventDetails: GoogleCalendarEvent = {
        summary: calendarEventSummary,
        description: calendarEventDescription,
        start: { dateTime: new Date(calendarEventStart).toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: new Date(calendarEventEnd).toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        attendees: calendarEventAttendees.split(',').map(email => ({ email: email.trim() })).filter(att => att.email),
        reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 30 }] },
    };

    try {
        setCurrentProspectJourneyStage('CallScheduled');
        const createdEvent = await createGoogleCalendarEvent(eventDetails, googleAuthClient, addGoogleMeet);
        if (createdEvent) {
            toast({title: 'Event Scheduled!', description: `Event "${createdEvent.summary}" created. Check your Google Calendar.`});
            setCurrentProspectJourneyStage('CallCompleted'); // Or a specific 'CallMade' stage
            setCalendarEventSummary('');
            setCalendarEventDescription('');
            setCalendarEventStart('');
            setCalendarEventEnd('');
            setCalendarEventAttendees('');
        } else {
            throw new Error('Failed to create event in Google Calendar.');
        }
    } catch (error: any) {
        console.error('Failed to schedule Google Calendar event:', error);
        toast({title: 'Scheduling Error', description: error.message || 'Could not schedule event.', variant: 'destructive'});
    }
  };


  useEffect(() => {
    const fetchLinkedInProfileData = async () => {
      if (platform === 'linkedin' && linkedinUsername) {
        setCurrentProspectJourneyStage('Identified');
        try {
          const profile = await getLinkedInProfile(linkedinUsername); // Simpler initial fetch
           setLeadId(profile.id); // Assuming profile.id can serve as a leadId

          const enrichInput: EnrichLinkedInProfileInput = {
            name: profile.firstName || linkedinUsername,
            company: companyName,
            linkedinProfile: profile,
            additionalContext: additionalContext,
          };
          const enriched = await enrichLinkedInProfile(enrichInput);
          
          const finalProfile = {
            ...profile,
            headline: enriched.enrichedProfile || profile.headline, // Update with enriched data
          };
          setLinkedInProfile(finalProfile);
          setCurrentProspectJourneyStage('LinkedInConnected');
          setIsLinkedInOutreachActive(true);
          await handleSendLinkedInMessage(true, finalProfile); // Pass finalProfile

        } catch (error) {
          console.error('Failed to fetch/enrich LinkedIn profile:', error);
          toast({ title: 'Error', description: 'Failed to fetch LinkedIn profile.', variant: 'destructive' });
        }
      } else {
        setLinkedInProfile(null);
        setIsLinkedInOutreachActive(false);
        setLinkedinConversation([]);
        setCurrentProspectJourneyStage('Identified');
      }
    };

    if (platform === 'linkedin') fetchLinkedInProfileData();
    // Other platform fetches would go here
  }, [platform, linkedinUsername, companyName, additionalContext, toast]); // Removed handleSendLinkedInMessage


 const handleSendLinkedInMessage = async (isIntroductory = false, currentProfile?: LinkedInProfile | null) => {
    const profileToUse = currentProfile || linkedinProfile;
    if (!profileToUse) {
      toast({ title: "LinkedIn Profile Needed", description: "Please provide a LinkedIn username first.", variant: "destructive" });
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
      setLinkedinConversation(prev => [...prev, { sender: 'user', message: aiMessage, timestamp: new Date() }]);
      
      setTimeout(() => {
        const prospectReply = `Thanks for reaching out! This sounds interesting. My email is prospect${Math.floor(Math.random()*100)}@example.com.`;
        setLinkedinConversation(prev => [...prev, { sender: 'prospect', message: prospectReply, timestamp: new Date() }]);
        
        const emailMatch = prospectReply.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
        if (emailMatch && emailMatch.length > 0) {
            setProspectEmailForDrip(emailMatch[0]);
            toast({title: "Email Captured!", description: `Prospect's email ${emailMatch[0]} captured. Ready to start email drip.`});
            setSuggestedNextObjective('transition_to_email');
            setCurrentProspectJourneyStage('EmailAddressCaptured');
        } else {
            setCurrentObjective(result.suggestedNextObjective || 'continue_linkedin_chat');
        }
      }, 2000 + Math.random() * 2000);

      toast({ title: 'LinkedIn Message Sent (Simulated)', description: 'AI-generated message added to conversation.' });
    } catch (error) {
      console.error('Failed to generate/send LinkedIn message:', error);
      toast({ title: 'Error', description: 'Failed to process LinkedIn message.', variant: 'destructive' });
    }
  };

  const handleTransitionToEmail = () => {
    if (!prospectEmailForDrip) {
        toast({title: "Prospect Email Missing", description: "Cannot start email drip without prospect's email.", variant: "destructive"});
        return;
    }
    router.push(`/campaign/email-drip?emails=${encodeURIComponent(prospectEmailForDrip)}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername)}`);
  };


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
                <div>
                  <Label htmlFor="linkedinUsername">LinkedIn Username/Profile URL</Label>
                  <Input id="linkedinUsername" value={linkedinUsername} onChange={e => setLinkedInUsername(e.target.value)} placeholder="Enter LinkedIn username or profile URL" />
                </div>
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
            {/* Inputs for other platforms like Twitter username, WhatsApp number */}
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
                   {linkedinConversation.length === 0 && <p className="text-muted-foreground text-center py-4">Introductory message will be generated...</p>}
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
                    <Button onClick={() => handleSendLinkedInMessage(false)} className="bg-blue-600 hover:bg-blue-700">
                        <Send className="mr-2 h-4 w-4" /> Generate & Send Next LinkedIn Message
                    </Button>
                </div>
                {suggestedNextObjective === 'transition_to_email' && prospectEmailForDrip && (
                    <Button onClick={handleTransitionToEmail} className="mt-3 w-full bg-green-600 hover:bg-green-700">
                        <Mail className="mr-2 h-4 w-4"/> Configure Email Drip for {prospectEmailForDrip}
                    </Button>
                )}
                 {platform === 'linkedin' && (suggestedNextObjective === 'schedule_call' || currentObjective === 'schedule_call') && (
                    <p className="mt-3 text-sm text-green-600">Prospect seems interested in a call! Use the Google Calendar integration below to schedule it.</p>
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
                            // ...(platform === 'email' && emailProfile ? { emailProfile: { email: emailProfile.email, provider: emailProfile.provider } } : {}), // This part is for direct email, handled by drip page now
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
                        <p className="mt-3 text-sm text-green-600">Script suggests a call. Use Google Calendar integration below.</p>
                    )}
                </CardContent>
             </Card>
          )}


          <Accordion type="single" collapsible className="w-full mt-6">
            <AccordionItem value="google-calendar">
              <AccordionTrigger className="text-base">
                <div className="flex items-center"><CalendarPlus className="mr-2 h-5 w-5 text-primary"/>Schedule Google Calendar Event</div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-3">
                {!isGoogleCalendarAuthorized ? (
                  <Button onClick={handleGoogleCalendarAuthorize} variant="outline">Authorize Google Calendar</Button>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="eventSummary">Event Summary</Label>
                            <Input id="eventSummary" value={calendarEventSummary} onChange={e => setCalendarEventSummary(e.target.value)} placeholder="Meeting with Prospect" />
                        </div>
                         <div>
                            <Label htmlFor="eventAttendees">Attendees (comma-separated emails)</Label>
                            <Input id="eventAttendees" value={calendarEventAttendees} onChange={e => setCalendarEventAttendees(e.target.value)} placeholder="prospect@example.com, you@example.com" />
                        </div>
                        <div>
                            <Label htmlFor="eventStart">Start Date & Time</Label>
                            <Input id="eventStart" type="datetime-local" value={calendarEventStart} onChange={e => setCalendarEventStart(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="eventEnd">End Date & Time</Label>
                            <Input id="eventEnd" type="datetime-local" value={calendarEventEnd} onChange={e => setCalendarEventEnd(e.target.value)} />
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="eventDescription">Event Description (Optional)</Label>
                        <Textarea id="eventDescription" value={calendarEventDescription} onChange={e => setCalendarEventDescription(e.target.value)} placeholder="Discuss project X, follow up on recent conversation..." />
                    </div>
                     <div className="flex items-center space-x-2">
                      <Checkbox id="addGoogleMeet" checked={addGoogleMeet} onCheckedChange={(checked) => setAddGoogleMeet(checked as boolean)} />
                      <Label htmlFor="addGoogleMeet">Add Google Meet Link</Label>
                    </div>
                    <Button onClick={handleScheduleGoogleCalendarEvent}>Schedule Event</Button>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => router.push('/')}> <HomeIcon className="mr-2 h-4 w-4" /> Back to Dashboard</Button>
        {(currentProspectJourneyStage === 'EmailStep3Sent' || currentProspectJourneyStage === 'LinkedInFollowUp2' || currentMessage) && ( // Example conditions
          <Link href={`/compliance/check?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || campaignName)}`} passHref>
            <Button>Next: Check Compliance <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        )}
         {currentProspectJourneyStage === 'CallCompleted' && (
             <Link href={`/risk-lead-visualization?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || campaignName)}`} passHref>
                 <Button variant="default">View Risk & Lead Visualization <ChevronRight className="ml-2 h-4 w-4" /></Button>
             </Link>
         )}
          {(currentProspectJourneyStage === 'CallScheduled' || currentProspectJourneyStage === 'AICallInProgress') && (
            <Link href={`/call/approve?stage=${currentProspectJourneyStage}&leadId=${leadId || ''}&campaignName=${encodeURIComponent(linkedinProfile?.firstName || linkedinUsername || campaignName)}`} passHref>
                <Button>Manage AI Call <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </Link>
        )}
      </div>
    </div>
  );
}
