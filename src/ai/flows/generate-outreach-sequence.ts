'use server';

/**
 * @fileOverview Generates personalized email outreach sequences using Gemini 2.0,
 * potentially incorporating context from prior LinkedIn conversations.
 *
 * - generateOutreachSequence - A function that handles the email outreach sequence generation process.
 * - GenerateOutreachSequenceInput - The input type for the generateOutreachSequence function.
 * - GenerateOutreachSequenceOutput - The return type for the generateOutreachSequence function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateOutreachSequenceInputSchema = z.object({
  platform: z.literal('email').describe('The platform for the outreach sequence, fixed to email for drip campaigns.'),
  prompt: z.string().describe('The core prompt or goal for the email sequence (e.g., "Follow up on LinkedIn chat to schedule a demo for Product X").'),
  numSteps: z.number().int().min(1).max(7).default(3).describe('The number of emails in the drip sequence.'),
  previousConversationSummary: z.string().optional().describe('A brief summary of any prior LinkedIn conversation to provide context for the email sequence.'),
  targetProspectInfo: z.object({
    name: z.string().optional().describe("Prospect's name, if known."),
    company: z.string().optional().describe("Prospect's company, if known."),
    role: z.string().optional().describe("Prospect's role, if known."),
  }).optional().describe("Information about the target prospect for personalization.")
});

export type GenerateOutreachSequenceInput = z.infer<typeof GenerateOutreachSequenceInputSchema>;

const GenerateOutreachSequenceOutputSchema = z.object({
  sequence: z.array(z.string()).describe('The generated email outreach sequence, with each element being the content of an email.'),
});

export type GenerateOutreachSequenceOutput = z.infer<typeof GenerateOutreachSequenceOutputSchema>;

export async function generateOutreachSequence(input: GenerateOutreachSequenceInput): Promise<GenerateOutreachSequenceOutput> {
  return generateOutreachSequenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailDripSequencePrompt', // Renamed for clarity
  input: {
    schema: GenerateOutreachSequenceInputSchema,
  },
  output: {
    schema: GenerateOutreachSequenceOutputSchema,
  },
  prompt: `You are an AI assistant specializing in crafting effective email drip sequences for sales and marketing outreach.
The goal is to create a sequence of {{{numSteps}}} emails based on the provided prompt and prospect information.

Core Prompt/Goal for this email sequence: {{{prompt}}}

{{#if targetProspectInfo}}
Target Prospect Information:
  {{#if targetProspectInfo.name}}Name: {{{targetProspectInfo.name}}}{{/if}}
  {{#if targetProspectInfo.company}}Company: {{{targetProspectInfo.company}}}{{/if}}
  {{#if targetProspectInfo.role}}Role: {{{targetProspectInfo.role}}}{{/if}}
{{/if}}

{{#if previousConversationSummary}}
Context from previous LinkedIn conversation: {{{previousConversationSummary}}}
Reference this context naturally in the email sequence if relevant.
{{/if}}

Generate a sequence of {{{numSteps}}} distinct emails. Each email should be a complete message body.
Focus on being concise, valuable, and progressively building towards the core goal.
Avoid overly aggressive sales language. Aim for a helpful and professional tone.
Each email should be clearly distinct.

Email Sequence (one email per step):
---
Email 1:
(Content for first email)
---
Email 2:
(Content for second email)
---
{{#if numSteps > 2}}
Email 3:
(Content for third email)
---
{{/if}}
{{#if numSteps > 3}}
Email 4:
(Content for fourth email)
---
{{/if}}
{{#if numSteps > 4}}
Email 5:
(Content for fifth email)
---
{{/if}}
{{#if numSteps > 5}}
Email 6:
(Content for sixth email)
---
{{/if}}
{{#if numSteps > 6}}
Email 7:
(Content for seventh email)
---
{{/if}}
`,
});

const generateOutreachSequenceFlow = ai.defineFlow<
  typeof GenerateOutreachSequenceInputSchema,
  typeof GenerateOutreachSequenceOutputSchema
>(
  {
    name: 'generateEmailDripSequenceFlow',
    inputSchema: GenerateOutreachSequenceInputSchema,
    outputSchema: GenerateOutreachSequenceOutputSchema,
  },
  async input => {
    // Ensure platform is always 'email' for this specific flow if it wasn't already enforced by type
    const flowInput = { ...input, platform: 'email' as const };
    const {output} = await prompt(flowInput);

    if (!output || !Array.isArray(output.sequence)) {
        // Fallback or error handling if the LLM output isn't structured as expected.
        // This might involve parsing the raw text based on "--- Email X ---" delimiters
        console.error("Invalid or unstructured output from LLM:", output);
        const rawText = (output as any)?.text || (output as any)?.toString() || "";
        // Attempt to parse emails from the raw text based on "--- Email X ---" delimiters
        const emails = rawText.split(/---Email \d+:?---/i)
                              .map((email: string | undefined) => email.trim())
                              .filter((email: string | undefined) => email?.length > 10); // Basic filter for empty/delimiter parts
        if (emails.length > 0) {
            return { sequence: emails.slice(0, input.numSteps) }; // Take the first non-empty parts
        }
        return { sequence: ["Error: Could not parse email sequence from LLM output."] };
    }
    return output;
  }
);
