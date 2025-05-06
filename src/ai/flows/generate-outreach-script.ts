'use server';
/**
 * @fileOverview Generates personalized outreach scripts for LinkedIn, Twitter/X, email and Whatsapp.
 * Can generate an initial introductory message or a follow-up based on conversation history.
 *
 * - generateOutreachScript - A function that handles the outreach script generation process.
 * - GenerateOutreachScriptInput - The input type for the generateOutreachScript function.
 * - GenerateOutreachScriptOutput - The return type for the GenerateOutreachScript function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateOutreachScriptInputSchema = z.object({
  platform: z.enum(['linkedin', 'twitter', 'email', 'whatsapp']).describe('The platform for the outreach script.'),
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
  includeCallToAction: z.boolean().default(true).describe('Whether to include a call to action suggesting a virtual call or asking for email.'),
  conversationHistory: z.array(z.object({ sender: z.enum(['user', 'prospect']), message: z.string() })).optional().describe('The history of the conversation so far, if generating a follow-up.'),
  isIntroductoryMessage: z.boolean().optional().default(false).describe('Set to true if this is the first message after a connection request on LinkedIn.'),
  objective: z.enum(['build_rapport', 'gather_information', 'request_email', 'schedule_call', 'general_follow_up']).default('general_follow_up').describe('The immediate objective of this specific message in the sequence.')
});
export type GenerateOutreachScriptInput = z.infer<typeof GenerateOutreachScriptInputSchema>;

const GenerateOutreachScriptOutputSchema = z.object({
  script: z.string().describe('The generated outreach script.'),
  suggestedNextObjective: z.enum(['build_rapport', 'gather_information', 'request_email', 'schedule_call', 'continue_linkedin_chat', 'transition_to_email', 'end_conversation']).optional().describe('Suggested objective for the next interaction based on this generated script and conversation.')
});
export type GenerateOutreachScriptOutput = z.infer<typeof GenerateOutreachScriptOutputSchema>;

export async function generateOutreachScript(input: GenerateOutreachScriptInput): Promise<GenerateOutreachScriptOutput> {
  return generateOutreachScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutreachScriptPrompt',
  input: { // Schema is implicitly defined by the flow's input schema due to direct pass-through
    schema: GenerateOutreachScriptInputSchema,
  },
  output: {
    schema: GenerateOutreachScriptOutputSchema,
  },
  prompt: `You are an AI assistant specializing in crafting engaging and context-aware outreach messages.
Platform: {{{platform}}}
Objective for this message: {{{objective}}}

{{#if linkedinProfile}}
LinkedIn Profile: {{{linkedinProfile.headline}}} ({{{linkedinProfile.profileUrl}}})
{{/if}}
{{#if twitterProfile}}
Twitter Profile: @{{{twitterProfile.username}}} ({{{twitterProfile.name}}})
{{/if}}
{{#if emailProfile}}
Email: {{{emailProfile.email}}} (Provider: {{{emailProfile.provider}}})
{{/if}}

Additional Context for campaign: {{{additionalContext}}}

{{#if isIntroductoryMessage}}
This is an introductory LinkedIn InMail to be sent immediately after a connection request. Make it welcoming, concise, and state the reason for connecting.
{{else if conversationHistory.length}}
This is a follow-up message on {{platform}}. Analyze the conversation history below to generate a relevant and natural next message.
Conversation History:
{{#each conversationHistory}}
  {{sender}}: {{message}}
{{/each}}
Based on the history and the objective "{{{objective}}}", craft the next message.
{{else}}
This is a standard outreach message.
{{/if}}

{{#if includeCallToAction}}
Consider naturally weaving in a call to action. If the objective is 'request_email', try to get their email. If 'schedule_call', suggest a brief virtual meeting.
{{/if}}

Generated Script:
---
(Your script here)
---

Suggested Next Objective (e.g., continue_linkedin_chat, transition_to_email, schedule_call):
(Your suggested next objective here - one of: build_rapport, gather_information, request_email, schedule_call, continue_linkedin_chat, transition_to_email, end_conversation)
`,
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
    // Ensure output is not null and adheres to the schema.
    // The prompt is now designed to output both script and suggestedNextObjective.
    // We need to parse this structured output if the LLM doesn't directly return JSON.
    // For simplicity, assuming LLM output can be parsed or structured to fit the schema.
    // A more robust solution would parse the LLM's text output to extract script and objective.
    if (!output || typeof output.script !== 'string') {
        // Fallback or error handling if the output is not as expected
        console.error("Invalid output from LLM:", output);
        // Attempt to extract from raw text if possible as a fallback
        const rawText = (output as any)?.text || (output as any) || "";
        const scriptMatch = rawText.match(/Generated Script:\s*---([\s\S]*?)---/);
        const objectiveMatch = rawText.match(/Suggested Next Objective.*?:\s*(.*)/);

        return {
            script: scriptMatch ? scriptMatch[1].trim() : "Error: Could not generate script.",
            suggestedNextObjective: objectiveMatch ? objectiveMatch[1].trim() as any : undefined,
        };
    }
    return output;
  }
);
