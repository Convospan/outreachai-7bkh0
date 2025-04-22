'use server';
/**
 * @fileOverview Generates personalized outreach scripts for LinkedIn, Twitter/X, and email.
 *
 * - generateOutreachScript - A function that handles the outreach script generation process.
 * - GenerateOutreachScriptInput - The input type for the generateOutreachScript function.
 * - GenerateOutreachScriptOutput - The return type for the GenerateOutreachScript function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {LinkedInProfile} from '@/services/linkedin';
import {TwitterProfile} from '@/services/twitter';
import {EmailProfile} from '@/services/email';

const GenerateOutreachScriptInputSchema = z.object({
  platform: z.enum(['linkedin', 'twitter', 'email']).describe('The platform for the outreach script.'),
  linkedinProfile: z.optional(z.object({
    id: z.string().describe('The LinkedIn profile ID.'),
    headline: z.string().describe('The profile headline.'),
    profileUrl: z.string().describe('The profile URL.'),
  })),
  twitterProfile: z.optional(z.object({
    id: z.string().describe('The Twitter profile ID.'),
    username: z.string().describe('The Twitter username.'),
    name: z.string().describe('The user\'s full name.'),
  })),
  emailProfile: z.optional(z.object({
    email: z.string().describe('The email address.'),
    provider: z.string().describe('The email provider.'),
  })),
  additionalContext: z.string().describe('Additional context to personalize the outreach script.'),
  includeCallToAction: z.boolean().default(true).describe('Whether to include a call to action suggesting a virtual call.'),
});
export type GenerateOutreachScriptInput = z.infer<typeof GenerateOutreachScriptInputSchema>;

const GenerateOutreachScriptOutputSchema = z.object({
  script: z.string().describe('The generated outreach script.'),
});
export type GenerateOutreachScriptOutput = z.infer<typeof GenerateOutreachScriptOutputSchema>;

export async function generateOutreachScript(input: GenerateOutreachScriptInput): Promise<GenerateOutreachScriptOutput> {
  return generateOutreachScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutreachScriptPrompt',
  input: {
    schema: z.object({
      platform: z.string().describe('The platform for the outreach script.'),
      linkedinProfile: z.optional(z.object({
        id: z.string().describe('The LinkedIn profile ID.'),
        headline: z.string().describe('The profile headline.'),
        profileUrl: z.string().describe('The profile URL.'),
      })),
      twitterProfile: z.optional(z.object({
        id: z.string().describe('The Twitter profile ID.'),
        username: z.string().describe('The Twitter username.'),
        name: z.string().describe('The user\'s full name.'),
      })),
      emailProfile: z.optional(z.object({
        email: z.string().describe('The email address.'),
        provider: z.string().describe('The email provider.'),
      })),
      additionalContext: z.string().describe('Additional context to personalize the outreach script.'),
      includeCallToAction: z.boolean().default(true).describe('Whether to include a call to action suggesting a virtual call.'),
    }),
  },
  output: {
    schema: z.object({
      script: z.string().describe('The generated outreach script.'),
    }),
  },
  prompt: `You are an AI assistant specializing in generating personalized outreach scripts for various platforms.  Based on the platform and profile information provided, generate a concise and engaging outreach script.  If appropriate, suggest moving the conversation to a virtual call, but only if includeCallToAction is true.

Platform: {{{platform}}}

{{#if linkedinProfile}}
LinkedIn Profile Headline: {{{linkedinProfile.headline}}}
LinkedIn Profile URL: {{{linkedinProfile.profileUrl}}}
{{/if}}

{{#if twitterProfile}}
Twitter Username: {{{twitterProfile.username}}}
Twitter Name: {{{twitterProfile.name}}}
{{/if}}

{{#if emailProfile}}
Email Address: {{{emailProfile.email}}}
Email Provider: {{{emailProfile.provider}}}
{{/if}}

Additional Context: {{{additionalContext}}}

{{#if includeCallToAction}}
Consider suggesting a virtual call to further discuss opportunities.
{{/if}}

Script:`, // Make sure the output is labeled clearly
});

const generateOutreachScriptFlow = ai.defineFlow<
  typeof GenerateOutreachScriptInputSchema,
  typeof GenerateOutreachScriptOutputSchema
>(
  {
    name: 'generateOutreachScriptFlow',
    inputSchema: GenerateOutreachScriptInputSchema,
    outputSchema: GenerateOutreachScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
