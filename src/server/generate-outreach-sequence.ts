'use server';

/**
 * @fileOverview Generates personalized outreach sequences for LinkedIn, Twitter/X, and email using Gemini 2.0.
 *
 * - generateOutreachSequence - A function that handles the outreach sequence generation process.
 * - GenerateOutreachSequenceInput - The input type for the generateOutreachSequence function.
 * - GenerateOutreachSequenceOutput - The return type for the generateOutreachSequence function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateOutreachSequenceInputSchema = z.object({
  platform: z.enum(['linkedin', 'twitter', 'email']).describe('The platform for the outreach sequence.'),
  prompt: z.string().describe('The prompt to guide the sequence generation (e.g., personalized connection request, follow-up email).'),
  numSteps: z.number().int().min(1).max(5).default(3).describe('The number of steps in the outreach sequence.'),
});

export type GenerateOutreachSequenceInput = z.infer<typeof GenerateOutreachSequenceInputSchema>;

const GenerateOutreachSequenceOutputSchema = z.object({
  sequence: z.array(z.string()).describe('The generated outreach sequence, with each element being a step in the sequence.'),
});

export type GenerateOutreachSequenceOutput = z.infer<typeof GenerateOutreachSequenceOutputSchema>;

export async function generateOutreachSequence(input: GenerateOutreachSequenceInput): Promise<GenerateOutreachSequenceOutput> {
  return generateOutreachSequenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutreachSequencePrompt',
  input: {
    schema: z.object({
      platform: z.string().describe('The platform for the outreach sequence.'),
      prompt: z.string().describe('The prompt to guide the sequence generation (e.g., personalized connection request, follow-up email).'),
      numSteps: z.number().int().min(1).max(5).default(3).describe('The number of steps in the outreach sequence.'),
    }),
  },
  output: {
    schema: z.object({
      sequence: z.array(z.string()).describe('The generated outreach sequence.'),
    }),
  },
  prompt: `You are an AI assistant specializing in generating effective outreach sequences for various platforms.
      Based on the platform and the provided prompt, create a sequence of engaging outreach steps.
      The sequence should have {{{numSteps}}} steps.

      Platform: {{{platform}}}
      Prompt: {{{prompt}}}

      Sequence:`,
});

const generateOutreachSequenceFlow = ai.defineFlow<
  typeof GenerateOutreachSequenceInputSchema,
  typeof GenerateOutreachSequenceOutputSchema
>(
  {
    name: 'generateOutreachSequenceFlow',
    inputSchema: GenerateOutreachSequenceInputSchema,
    outputSchema: GenerateOutreachSequenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
