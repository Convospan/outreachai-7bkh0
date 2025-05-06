/* eslint-disable react/no-unescaped-entities */
'use client';

import {useState, useEffect} from 'react';
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {generateOutreachScript, GenerateOutreachScriptInput} from '@/ai/flows/generate-outreach-script';
import {LinkedInProfile, getLinkedInProfile} from '@/services/linkedin';
import {TwitterProfile, getTwitterProfile} from '@/services/twitter';
import {EmailProfile, getEmailProfile} from '@/services/email';
import {useToast} from "@/hooks/use-toast"
import Link from 'next/link';
import { GenerateOutreachSequenceOutput } from '@/ai/flows/generate-outreach-sequence';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {enrichLinkedInProfile, EnrichLinkedInProfileOutput} from '@/ai/flows/enrich-linkedin-profile';
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from '@/components/ui/input';
import { createGoogleCalendarEvent, GoogleCalendarEvent, generateGoogleCalendarAuthUrl, createOAuth2Client, getGoogleCalendarTokensFromCode } from '@/services/google-calendar';
import type { Auth } from 'googleapis';

interface MessageTemplate {
  platform: 'linkedin' | 'twitter' | 'email' | 'whatsapp';
  template: string;
}

const defaultTemplates: MessageTemplate[] = [
  {platform: 'linkedin', template: 'Hello, I saw your profile and...'},
  {platform: 'twitter', template: 'Hey, I enjoyed your tweet about...'},
  {platform: 'email', template: 'Dear [Name], I hope this email finds you well...'},
  {platform: 'whatsapp', template: 'Hello, I found your contact and...'},
];

export default function CampaignPage() {
  const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'email' | 'whatsapp'>('linkedin');
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState<MessageTemplate[]>(defaultTemplates);
  const [linkedinUsername, setLinkedInUsername] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [linkedinProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const [emailProfile, setEmailProfile] = useState<EmailProfile | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const {toast} = useToast()
  const [numSteps, setNumSteps] = useState<number>(3);
  const [generatedSequence, setGeneratedSequence] = useState<GenerateOutreachSequenceOutput | null>(null);
  const [sequencePrompt, setSequencePrompt] = useState<string>('');

  const [companyName, setCompanyName] = useState(''); // Company name state
  const [includeCallToAction, setIncludeCallToAction] = useState(true);

  // Google Calendar State
  const [googleAuthClient, setGoogleAuthClient] = useState<Auth.OAuth2Client | null>(null);
  const [isGoogleCalendarAuthorized, setIsGoogleCalendarAuthorized] = useState(false);
  const [calendarEventSummary, setCalendarEventSummary] = useState('');
  const [calendarEventDescription, setCalendarEventDescription] = useState('');
  const [calendarEventStart, setCalendarEventStart] = useState('');
  const [calendarEventEnd, setCalendarEventEnd] = useState('');
  const [calendarEventAttendees, setCalendarEventAttendees] = useState('');


  useEffect(() => {
    const initGoogleAuthClient = async () => {
      try {
        const client = await createOAuth2Client();
        setGoogleAuthClient(client);
      } catch (error) {
        console.error("Failed to initialize Google Auth Client:", error);
        toast({
          title: "Google Calendar Error",
          description: "Could not initialize Google Calendar integration.",
          variant: "destructive",
        });
      }
    };
    initGoogleAuthClient();
  }, [toast]);


  useEffect(() => {
    // Handle Google Calendar OAuth callback
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code && googleAuthClient && !isGoogleCalendarAuthorized) {
        try {
          const tokens = await getGoogleCalendarTokensFromCode(code, googleAuthClient);
          if (tokens) {
            googleAuthClient.setCredentials(tokens);
            setIsGoogleCalendarAuthorized(true);
            toast({
              title: "Google Calendar Authorized",
              description: "Successfully connected to Google Calendar.",
            });
            // Remove code from URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            throw new Error("Failed to obtain tokens.");
          }
        } catch (error) {
          console.error("Error exchanging Google Calendar code for tokens:", error);
          toast({
            title: "Google Calendar Authorization Failed",
            description: "Could not authorize Google Calendar. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    handleGoogleCallback();
  }, [googleAuthClient, isGoogleCalendarAuthorized, toast]);


  const handleGoogleCalendarAuthorize = async () => {
    if (googleAuthClient) {
      const authUrl = generateGoogleCalendarAuthUrl(googleAuthClient);
      window.location.href = authUrl;
    } else {
      toast({
        title: "Google Calendar Error",
        description: "Google Calendar client not initialized. Please refresh.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleGoogleCalendarEvent = async () => {
    if (!isGoogleCalendarAuthorized || !googleAuthClient) {
      toast({
        title: 'Google Calendar Not Authorized',
        description: 'Please authorize Google Calendar access first.',
        variant: 'destructive',
      });
      return;
    }
    if (!calendarEventSummary || !calendarEventStart || !calendarEventEnd) {
        toast({
            title: 'Missing Event Details',
            description: 'Please provide summary, start, and end times for the event.',
            variant: 'destructive',
        });
        return;
    }

    const eventDetails: GoogleCalendarEvent = {
      summary: calendarEventSummary,
      description: calendarEventDescription,
      start: { dateTime: new Date(calendarEventStart).toISOString() },
      end: { dateTime: new Date(calendarEventEnd).toISOString() },
      attendees: calendarEventAttendees.split(',').map(email => ({ email: email.trim() })).filter(a => a.email),
    };

    try {
      const createdEvent = await createGoogleCalendarEvent(eventDetails, googleAuthClient);
      if (createdEvent) {
        toast({
          title: 'Google Calendar Event Scheduled',
          description: `Event "${createdEvent.summary}" created successfully.`,
        });
        // Optionally, clear form fields
        setCalendarEventSummary('');
        setCalendarEventDescription('');
        setCalendarEventStart('');
        setCalendarEventEnd('');
        setCalendarEventAttendees('');
      } else {
        throw new Error("Failed to create event in Google Calendar.");
      }
    } catch (error) {
      console.error('Failed to schedule Google Calendar event:', error);
      toast({
        title: 'Error Scheduling Event',
        description: 'Could not schedule the Google Calendar event. Please try again.',
        variant: 'destructive',
      });
    }
  };


  useEffect(() => {
    const fetchLinkedInProfile = async () => {
      if (platform === 'linkedin') {
        try {
          const profile = await getLinkedInProfile(linkedinUsername); // Use the state variable
          setLinkedInProfile(profile);
        } catch (error) {
          console.error('Failed to fetch LinkedIn profile:', error);
              toast({
                  title: "Error",
                  description: "Failed to fetch LinkedIn profile.",
                  variant: "destructive",
              })
        }
      } else {
          setLinkedInProfile(null); // Clear the profile when platform changes
      }
    };

    const fetchTwitterProfile = async () => {
      if (platform === 'twitter') {
        try {
          const profile = await getTwitterProfile(twitterUsername); // Use the state variable
          setTwitterProfile(profile);
        } catch (error) {
          console.error('Failed to fetch Twitter profile:', error);
              toast({
                  title: "Error",
                  description: "Failed to fetch Twitter profile.",
                  variant: "destructive",
              })
        }
      } else {
          setTwitterProfile(null); // Clear the profile when platform changes
      }
    };

    const fetchEmailProfile = async () => {
      if (platform === 'email') {
        try {
          const profile = await getEmailProfile(emailAddress); // Use the state variable
          setEmailProfile(profile);
        } catch (error) {
          console.error('Failed to fetch Email profile:', error);
              toast({
                  title: "Error",
                  description: "Failed to fetch Email profile.",
              variant: "destructive",
              })
        }
      } else {
          setEmailProfile(null); // Clear the profile when platform changes
      }
    };

    if (platform === 'linkedin') fetchLinkedInProfile();
    if (platform === 'twitter') fetchTwitterProfile();
    if (platform === 'email') fetchEmailProfile();
  }, [platform, linkedinUsername, twitterUsername, emailAddress, toast]);

  const handleGenerateTemplate = async () => {
    let profileData = linkedinProfile;

    if (platform === 'linkedin' && linkedinProfile && (!linkedinProfile.headline || !linkedinProfile.profileUrl)) {
      // Enrich LinkedIn profile if data is insufficient
      try {
        const enrichedProfileResult: EnrichLinkedInProfileOutput = await enrichLinkedInProfile({
          name: linkedinUsername, // Assuming linkedinUsername is the name
          company: companyName,
          linkedinProfile: linkedinProfile,
          additionalContext: additionalContext,
        });
        setMessage(enrichedProfileResult.enrichedProfile);
        setTemplates(prevTemplates => [...prevTemplates, {platform: platform, template: enrichedProfileResult.enrichedProfile}]);
        toast({
          title: "Success",
          description: "Successfully generated outreach script with enriched profile.",
        });
        return;
      } catch (enrichError) {
        console.error('Failed to enrich LinkedIn profile:', enrichError);
        toast({
          title: "Error",
          description: "Failed to enrich LinkedIn profile.",
          variant: "destructive",
        });
      }
    }

    const input: GenerateOutreachScriptInput = {
      platform: platform,
      linkedinProfile: profileData ? {
        id: profileData.id,
        headline: profileData.headline,
        profileUrl: profileData.profileUrl,
      } : undefined,
      twitterProfile: twitterProfile ? {
        id: twitterProfile.id,
        username: twitterProfile.username,
        name: twitterProfile.name,
      } : undefined,
      emailProfile: emailProfile ? {
        email: emailProfile.email,
        provider: emailProfile.provider,
      } : undefined,
      additionalContext: additionalContext,
      includeCallToAction: includeCallToAction,
    };

    try {
      const result = await generateOutreachScript(input);
      setMessage(result.script);
      setTemplates(prevTemplates => [...prevTemplates, {platform: platform, template: result.script}]);
          toast({
              title: "Success",
              description: "Successfully generated outreach script.",
          })
    } catch (error) {
      console.error('Failed to generate outreach script:', error);
          toast({
              title: "Error",
              description: "Failed to generate outreach script.",
              variant: "destructive",
          })
    }
  };

  const handleGenerateSequence = async () => {
    try {
      const response = await fetch('/api/sequence/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: platform,
          prompt: sequencePrompt,
          numSteps: numSteps,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GenerateOutreachSequenceOutput = await response.json();
      setGeneratedSequence(data);
      toast({
        title: "Success",
        description: "Successfully generated outreach sequence.",
      });
    } catch (error: any) {
      console.error('Failed to generate outreach sequence:', error);
      toast({
        title: "Error",
        description: "Failed to generate outreach sequence.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Automation</CardTitle>
          <CardDescription>Create automated message flows for different platforms.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="platform">Platform</Label>
            <Select onValueChange={(value) => setPlatform(value as 'linkedin' | 'twitter' | 'email' | 'whatsapp')}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select a platform"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="email">Email Drip Campaign</SelectItem>
                 <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

            {platform === 'linkedin' && (
                <>
                  <div className="grid gap-2">
                      <Label htmlFor="linkedinUsername">LinkedIn Username</Label>
                      <Textarea
                          id="linkedinUsername"
                          value={linkedinUsername}
                          onChange={(e) => setLinkedInUsername(e.target.value)}
                          placeholder="Enter LinkedIn username"
                      />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Textarea
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter Company Name"
                    />
                  </div>
                </>
            )}

            {platform === 'twitter' && (
                <div className="grid gap-2">
                    <Label htmlFor="twitterUsername">Twitter Username</Label>
                    <Textarea
                        id="twitterUsername"
                        value={twitterUsername}
                        onChange={(e) => setTwitterUsername(e.target.value)}
                        placeholder="Enter Twitter username"
                    />
                </div>
            )}

            {platform === 'email' && (
                <div className="grid gap-2">
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Textarea
                        id="emailAddress"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Enter Email Address"
                    />
                </div>
            )}
           {platform === 'whatsapp' && (
                <div className="grid gap-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Textarea
                        id="whatsappNumber" // Changed from emailAddress to whatsappNumber for clarity
                        value={emailAddress} // Consider a separate state for WhatsApp number if needed
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Enter WhatsApp Number"
                    />
                </div>
            )}

          <div className="grid gap-2">
            <Label htmlFor="additionalContext">Additional Context</Label>
            <Textarea
              id="additionalContext"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Enter additional context to personalize the outreach script"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeCallToAction"
              checked={includeCallToAction}
              onCheckedChange={(checked) => setIncludeCallToAction(checked as boolean)}
            />
            <Label htmlFor="includeCallToAction">Suggest a virtual call</Label>
          </div>

          <Button onClick={handleGenerateTemplate}>Generate Outreach Script</Button>

          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message will appear here"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sequencePrompt">Sequence Prompt</Label>
            <Textarea
              id="sequencePrompt"
              value={sequencePrompt}
              onChange={(e) => setSequencePrompt(e.target.value)}
              placeholder="Enter a prompt to guide the sequence generation"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="numSteps">Number of Steps</Label>
            <input
              type="number"
              id="numSteps"
              value={numSteps}
              onChange={(e) => setNumSteps(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button onClick={handleGenerateSequence}>Generate Outreach Sequence</Button>

          {generatedSequence && (
            <div className="mt-4">
              <Label>Generated Sequence:</Label>
              <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Step</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generatedSequence.sequence.map((step, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{step}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="templates">
              <AccordionTrigger>Generated Templates</AccordionTrigger>
              <AccordionContent>
                <ul>
                  {templates.map((template, index) => (
                    <li key={index} className="py-2">
                      <p>
                        <strong>{template.platform}:</strong> {template.template}
                      </p>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="google-calendar">
              <AccordionTrigger>Schedule Google Calendar Event</AccordionTrigger>
              <AccordionContent className="space-y-4">
                {!isGoogleCalendarAuthorized ? (
                  <Button onClick={handleGoogleCalendarAuthorize}>Authorize Google Calendar</Button>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="eventSummary">Event Summary</Label>
                      <Input id="eventSummary" value={calendarEventSummary} onChange={(e) => setCalendarEventSummary(e.target.value)} placeholder="Meeting with Prospect" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="eventDescription">Event Description (Optional)</Label>
                      <Textarea id="eventDescription" value={calendarEventDescription} onChange={(e) => setCalendarEventDescription(e.target.value)} placeholder="Discuss partnership opportunities..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                        <Label htmlFor="eventStart">Start Date & Time</Label>
                        <Input id="eventStart" type="datetime-local" value={calendarEventStart} onChange={(e) => setCalendarEventStart(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="eventEnd">End Date & Time</Label>
                        <Input id="eventEnd" type="datetime-local" value={calendarEventEnd} onChange={(e) => setCalendarEventEnd(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="eventAttendees">Attendees (comma-separated emails, optional)</Label>
                      <Input id="eventAttendees" value={calendarEventAttendees} onChange={(e) => setCalendarEventAttendees(e.target.value)} placeholder="prospect@example.com, colleague@example.com" />
                    </div>
                    <Button onClick={handleScheduleGoogleCalendarEvent}>Schedule Event</Button>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
       <div className="flex justify-between mt-4">
            <Link href="/" passHref>
                <Button variant="outline">Back to Dashboard</Button>
            </Link>
            {message && ( // Only show next button if a message has been generated
                <Button >
                    <Link href="/compliance/check" passHref>
                        Next: Check Compliance
                    </Link>
                </Button>
            )}
        </div>
    </div>
  );
}
