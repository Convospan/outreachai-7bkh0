/* eslint-disable react/no-unescaped-entities */
'use client';

import type {GenerateOutreachSequenceOutput} from '@/ai/flows/generate-outreach-sequence';
import {generateOutreachScript, type GenerateOutreachScriptInput, type GenerateOutreachScriptOutput} from '@/ai/flows/generate-outreach-script';
import {enrichLinkedInProfile, type EnrichLinkedInProfileOutput} from '@/ai/flows/enrich-linkedin-profile';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHeader, TableHead, TableRow} from '@/components/ui/table';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import type {EmailProfile} from '@/services/email';
import {getEmailProfile} from '@/services/email';
import type {GoogleCalendarEvent} from '@/services/google-calendar';
import {
  createGoogleCalendarEvent,
  createOAuth2Client,
  generateGoogleCalendarAuthUrl,
  getGoogleCalendarTokensFromCode,
} from '@/services/google-calendar';
import type {LinkedInProfile} from '@/services/linkedin';
import {getLinkedInProfile} from '@/services/linkedin';
import type {TwitterProfile} from '@/services/twitter';
import {getTwitterProfile} from '@/services/twitter';
import type {Auth} from 'googleapis';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import { BotMessageSquare, MessageSquare, Send, Mail, CalendarPlus, LinkedinIcon } from 'lucide-react';

interface MessageTemplate {
  platform: 'linkedin' | 'twitter' | 'email' | 'whatsapp';
  template: string;
}

interface ConversationMessage {
  sender: 'user' | 'prospect';
  message: string;
  timestamp: Date;
}

const defaultTemplates: MessageTemplate[] = [
  {platform: 'linkedin', template: 'Hello, I saw your profile and...'},
  {platform: 'twitter', template: 'Hey, I enjoyed your tweet about...'},
  {platform: 'email', template: 'Dear [Name], I hope this email finds you well...'},
  {platform: 'whatsapp', template: 'Hello, I found your contact and...'},
];

export default function CampaignPage() {
  const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'email' | 'whatsapp'>('linkedin');
  const [currentMessage, setCurrentMessage] = useState('');
  const [generatedTemplates, setGeneratedTemplates] = useState<MessageTemplate[]>(defaultTemplates);
  const [linkedinUsername, setLinkedInUsername] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState(''); // Used for email drip target
  const [prospectEmailForDrip, setProspectEmailForDrip] = useState(''); // Email obtained from prospect

  const [linkedinProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const [emailProfile, setEmailProfile] = useState<EmailProfile | null>(null); // For general email info if needed

  const [additionalContext, setAdditionalContext] = useState('');
  const {toast} = useToast();

  // LinkedIn Conversation State
  const [linkedinConversation, setLinkedinConversation] = useState<ConversationMessage[]>([]);
  const [currentLinkedinMessage, setCurrentLinkedinMessage] = useState('');
  const [isLinkedInOutreachActive, setIsLinkedInOutreachActive] = useState(false);
  const [currentObjective, setCurrentObjective] = useState<GenerateOutreachScriptInput['objective']>('build_rapport');
  const [suggestedNextObjective, setSuggestedNextObjective] = useState<GenerateOutreachScriptOutput['suggestedNextObjective'] | undefined>(undefined);


  // Email Drip State
  const [numEmailDripSteps, setNumEmailDripSteps] = useState<number>(3);
  const [generatedEmailDripSequence, setGeneratedEmailDripSequence] = useState<GenerateOutreachSequenceOutput | null>(null);
  const [emailDripPrompt, setEmailDripPrompt] = useState<string>('Follow up on our LinkedIn conversation and offer a demo.');
  const [isEmailDripTriggered, setIsEmailDripTriggered] = useState(false);


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
      const authUrl = await generateGoogleCalendarAuthUrl(googleAuthClient);
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
    // ... (rest of the scheduling logic)
  };


  useEffect(() => {
    const fetchLinkedInProfileData = async () => {
      if (platform === 'linkedin' && linkedinUsername) {
        try {
          let profile = await getLinkedInProfile(linkedinUsername);
          if (!profile.headline || !profile.profileUrl) { // Basic check for enrichment
            const enriched = await enrichLinkedInProfile({
              name: linkedinUsername,
              company: companyName,
              linkedinProfile: profile,
              additionalContext: additionalContext
            });
            // This part needs careful handling: enrichLinkedInProfile returns a string.
            // You'd need to parse it or adjust the flow to update the profile object.
            // For now, let's assume enrichment provides some update or log it.
            console.log("Enriched profile data string:", enriched.enrichedProfile);
            // You might need to update the profile state here based on parsed enriched data.
            toast({title: "Profile Enriched", description: "Additional profile details fetched."});
          }
          setLinkedInProfile(profile);
          setIsLinkedInOutreachActive(true); // Auto-start LinkedIn outreach
          // Generate initial introductory message
          await handleSendLinkedInMessage(true);

        } catch (error) {
          console.error('Failed to fetch/enrich LinkedIn profile:', error);
          toast({ title: 'Error', description: 'Failed to fetch LinkedIn profile.', variant: 'destructive' });
        }
      } else {
        setLinkedInProfile(null);
        setIsLinkedInOutreachActive(false);
        setLinkedinConversation([]);
      }
    };

    const fetchTwitterProfile = async () => { /* ... */ };
    const fetchEmailProfileData = async () => { /* ... */ };

    if (platform === 'linkedin') fetchLinkedInProfileData();
    if (platform === 'twitter') fetchTwitterProfile();
    if (platform === 'email') fetchEmailProfileData();

  }, [platform, linkedinUsername, companyName, additionalContext, toast]);


 const handleSendLinkedInMessage = async (isIntroductory = false) => {
    if (!linkedinProfile) {
      toast({ title: "LinkedIn Profile Needed", description: "Please provide a LinkedIn username first.", variant: "destructive" });
      return;
    }

    const input: GenerateOutreachScriptInput = {
      platform: 'linkedin',
      linkedinProfile: { id: linkedinProfile.id, headline: linkedinProfile.headline, profileUrl: linkedinProfile.profileUrl },
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
      setCurrentMessage(''); // Clear the main message input
      
      // Simulate prospect's reply after a delay
      setTimeout(() => {
        const prospectReply = `Thanks for reaching out! This sounds interesting. My email is prospect@example.com.`; // Simulated reply
        setLinkedinConversation(prev => [...prev, { sender: 'prospect', message: prospectReply, timestamp: new Date() }]);
        
        // AI analyzes reply and suggests next step or triggers action
        if (prospectReply.includes('@') && prospectReply.includes('.com')) { // Simple email detection
            const extractedEmail = prospectReply.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
            if (extractedEmail && extractedEmail.length > 0) {
                setProspectEmailForDrip(extractedEmail[0]);
                 toast({title: "Email Captured!", description: `Prospect's email ${extractedEmail[0]} captured. Ready to start email drip.`});
                setSuggestedNextObjective('transition_to_email');
            }
        } else if (suggestedNextObjective === 'request_email') {
            setCurrentObjective('request_email'); // Keep trying to get email
        } else {
            setCurrentObjective('continue_linkedin_chat');
        }

      }, 2000 + Math.random() * 2000);


      toast({ title: 'LinkedIn Message Sent (Simulated)', description: 'AI-generated message added to conversation.' });
    } catch (error) {
      console.error('Failed to generate/send LinkedIn message:', error);
      toast({ title: 'Error', description: 'Failed to process LinkedIn message.', variant: 'destructive' });
    }
  };

  const handleTransitionToEmail = async () => {
    if (!prospectEmailForDrip) {
        toast({title: "Prospect Email Missing", description: "Cannot start email drip without prospect's email.", variant: "destructive"});
        return;
    }
    setIsEmailDripTriggered(true);
    setIsLinkedInOutreachActive(false); // Optionally pause/end LinkedIn chat
    setPlatform('email'); // Switch context to email
    setEmailAddress(prospectEmailForDrip); // Set target for email drip
    toast({title: "Transitioning to Email", description: `Preparing email drip for ${prospectEmailForDrip}. Please configure and generate sequence.`});
  };


  const handleGenerateEmailDripSequence = async () => {
    if(!isEmailDripTriggered || !emailAddress) {
        toast({title: "Email Drip Not Ready", description: "Transition to email first or provide prospect's email.", variant: "destructive"});
        return;
    }
    try {
      const response = await fetch('/api/sequence/select', { // Assuming this endpoint is for generic sequences
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'email', // Specifically for email
          prompt: emailDripPrompt,
          numSteps: numEmailDripSteps,
          // You might want to pass additional context like linkedinConversation summary
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: GenerateOutreachSequenceOutput = await response.json();
      setGeneratedEmailDripSequence(data);
      toast({ title: 'Email Drip Sequence Generated', description: 'Review and schedule your email drip.' });
    } catch (error: any) {
      console.error('Failed to generate email drip sequence:', error);
      toast({ title: 'Error', description: 'Failed to generate email drip sequence.', variant: 'destructive' });
    }
  };


  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Campaign Automation Hub</CardTitle>
          <CardDescription>Orchestrate your outreach across LinkedIn, Email, and more.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Primary Outreach Platform</Label>
              <Select onValueChange={value => {
                  setPlatform(value as 'linkedin' | 'twitter' | 'email' | 'whatsapp');
                  setIsLinkedInOutreachActive(value === 'linkedin');
                  setIsEmailDripTriggered(false); // Reset email drip if platform changes
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
           {/* ... other platform inputs (Twitter, direct Email, WhatsApp) ... */}
          </div>

          <div>
            <Label htmlFor="additionalContext">Overall Campaign Context/Goal</Label>
            <Textarea id="additionalContext" value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} placeholder="E.g., Introduce new SaaS product for project management, target VPs of Engineering." />
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="includeCallToAction" checked={includeCallToAction} onCheckedChange={checked => setIncludeCallToAction(checked as boolean)} />
            <Label htmlFor="includeCallToAction">Attempt to include a Call to Action (e.g., request email, schedule call)</Label>
          </div>


          {/* LinkedIn Outreach Section */}
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
                        <Mail className="mr-2 h-4 w-4"/> Transition to Email Drip for {prospectEmailForDrip}
                    </Button>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Email Drip Section - Shown when platform is 'email' OR when transitioned */}
          {(platform === 'email' || isEmailDripTriggered) && (
             <Card className="mt-4 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center"><Mail className="mr-2 h-6 w-6 text-green-600"/> Email Drip Campaign Configuration</CardTitle>
                <CardDescription>
                    {prospectEmailForDrip ? `Targeting: ${prospectEmailForDrip}` : "Enter target email address below if starting directly."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {!prospectEmailForDrip && (
                    <div>
                        <Label htmlFor="targetEmailForDrip">Target Email Address</Label>
                        <Input id="targetEmailForDrip" type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} placeholder="Enter prospect's email"/>
                    </div>
                 )}
                <div>
                  <Label htmlFor="emailDripPrompt">Email Drip Prompt/Goal</Label>
                  <Textarea id="emailDripPrompt" value={emailDripPrompt} onChange={e => setEmailDripPrompt(e.target.value)} placeholder="E.g., Follow up on our LinkedIn chat, offer a demo for product X." />
                </div>
                <div>
                  <Label htmlFor="numEmailDripSteps">Number of Emails in Drip</Label>
                  <Input type="number" id="numEmailDripSteps" value={numEmailDripSteps} onChange={e => setNumEmailDripSteps(Number(e.target.value))} min="1" max="7" />
                </div>
                <Button onClick={handleGenerateEmailDripSequence} className="w-full bg-green-600 hover:bg-green-700">
                  <BotMessageSquare className="mr-2 h-4 w-4"/> Generate Email Drip Sequence
                </Button>
                {generatedEmailDripSequence && (
                  <div className="mt-4">
                    <Label className="text-md font-semibold">Generated Email Drip:</Label>
                    <div className="border rounded-md max-h-60 overflow-y-auto">
                      <Table>
                        <TableHeader><TableRow><TableHead className="w-[80px]">Step</TableHead><TableHead>Email Content</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {generatedEmailDripSequence.sequence.map((step, index) => (
                            <TableRow key={index}><TableCell className="font-medium">{index + 1}</TableCell><TableCell className="whitespace-pre-wrap text-sm">{step}</TableCell></TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}


          {/* Fallback for other platforms - manual script generation */}
          {platform !== 'linkedin' && !isEmailDripTriggered && (
             <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Generate Script for {platform.charAt(0).toUpperCase() + platform.slice(1)}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => handleSendLinkedInMessage(true)} className="w-full"> {/* Reusing logic, but it's not ideal. Needs dedicated flow for other platforms */}
                       <BotMessageSquare className="mr-2 h-4 w-4" /> Generate {platform.charAt(0).toUpperCase() + platform.slice(1)} Script
                    </Button>
                    {currentMessage && (
                        <div className="mt-4">
                             <Label htmlFor="manualMessage">Generated Script:</Label>
                             <Textarea id="manualMessage" value={currentMessage} readOnly rows={5}/>
                        </div>
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
                    <div className="grid gap-2">
                      <Label htmlFor="eventSummary">Event Summary</Label>
                      <Input id="eventSummary" value={calendarEventSummary} onChange={e => setCalendarEventSummary(e.target.value)} placeholder="Meeting with Prospect" />
                    </div>
                    {/* ... Other Google Calendar event fields ... */}
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
        <Link href="/" passHref><Button variant="outline">Back to Dashboard</Button></Link>
        {(currentMessage || generatedEmailDripSequence) && (
          <Link href="/compliance/check" passHref><Button>Next: Check Compliance</Button></Link>
        )}
      </div>
    </div>
  );
}
