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

interface MessageTemplate {
  platform: 'linkedin' | 'twitter' | 'email';
  template: string;
}

const defaultTemplates: MessageTemplate[] = [
  {platform: 'linkedin', template: 'Hello, I saw your profile and...'},
  {platform: 'twitter', template: 'Hey, I enjoyed your tweet about...'},
  {platform: 'email', template: 'Dear [Name], I hope this email finds you well...'},
];

export default function CampaignPage() {
  const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'email'>('linkedin');
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
  }, [platform, linkedinUsername, twitterUsername, emailAddress]);

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
            <Select onValueChange={setPlatform}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select a platform"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="email">Email Drip Campaign</SelectItem>
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
              onCheckedChange={(checked) => setIncludeCallToAction(checked || false)}
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

          <Accordion type="single" collapsible>
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
          </Accordion>
        </CardContent>
      </Card>
       <div className="flex justify-between mt-4">
            <Link href="/" passHref>
                <Button variant="outline">Back to Dashboard</Button>
            </Link>
            {message && (
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
