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
  const [linkedinProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const [emailProfile, setEmailProfile] = useState<EmailProfile | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
    const {toast} = useToast()

  useEffect(() => {
    const fetchLinkedInProfile = async () => {
      if (platform === 'linkedin') {
        try {
          const profile = await getLinkedInProfile('johndoe'); // Replace with actual username
          setLinkedInProfile(profile);
        } catch (error) {
          console.error('Failed to fetch LinkedIn profile:', error);
              toast({
                  title: "Error",
                  description: "Failed to fetch LinkedIn profile.",
                  variant: "destructive",
              })
        }
      }
    };

    const fetchTwitterProfile = async () => {
      if (platform === 'twitter') {
        try {
          const profile = await getTwitterProfile('johndoe'); // Replace with actual username
          setTwitterProfile(profile);
        } catch (error) {
          console.error('Failed to fetch Twitter profile:', error);
              toast({
                  title: "Error",
                  description: "Failed to fetch Twitter profile.",
                  variant: "destructive",
              })
        }
      }
    };

    const fetchEmailProfile = async () => {
      if (platform === 'email') {
        try {
          const profile = await getEmailProfile('john.doe@example.com'); // Replace with actual email
          setEmailProfile(profile);
        } catch (error) {
          console.error('Failed to fetch Email profile:', error);
              toast({
                  title: "Error",
                  description: "Failed to fetch Email profile.",
                  variant: "destructive",
              })
        }
      }
    };

    fetchLinkedInProfile();
    fetchTwitterProfile();
    fetchEmailProfile();
  }, [platform]);

  const handleGenerateTemplate = async () => {
    const input: GenerateOutreachScriptInput = {
      platform: platform,
      linkedinProfile: linkedinProfile ? {
        id: linkedinProfile.id,
        headline: linkedinProfile.headline,
        profileUrl: linkedinProfile.profileUrl,
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
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="additionalContext">Additional Context</Label>
            <Textarea
              id="additionalContext"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Enter additional context to personalize the outreach script"
            />
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
    </div>
  );
}
