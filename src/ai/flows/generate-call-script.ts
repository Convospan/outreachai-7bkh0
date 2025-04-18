'use server';

/**
 * @fileOverview Generates personalized call scripts using Gemini 2.0, incorporating user approval.
 *
 * - generateCallScript - A function that handles the call script generation process.
 * - GenerateCallScriptInput - The input type for the generateCallScript function.
 * - GenerateCallScriptOutput - The return type for the generateCallScript function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const GenerateCallScriptInputSchema = z.object({
    campaignName: z.string().describe('The name of the outreach campaign.'),
    productName: z.string().describe('The name of the product being promoted.'),
    targetAudience: z.string().describe('Description of the target audience.'),
    callObjective: z.string().describe('The objective of the phone call.'),
    additionalContext: z.string().optional().describe('Additional context for the call script.'),
});
export type GenerateCallScriptInput = z.infer<typeof GenerateCallScriptInputSchema>;

const GenerateCallScriptOutputSchema = z.object({
    script: z.string().describe('The generated call script.'),
});
export type GenerateCallScriptOutput = z.infer<typeof GenerateCallScriptOutputSchema>;

export async function generateCallScript(input: GenerateCallScriptInput): Promise<GenerateCallScriptOutput> {
    return generateCallScriptFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateCallScriptPrompt',
    input: {
        schema: z.object({
            campaignName: z.string().describe('The name of the outreach campaign.'),
            productName: z.string().describe('The name of the product being promoted.'),
            targetAudience: z.string().describe('Description of the target audience.'),
            callObjective: z.string().describe('The objective of the phone call.'),
            additionalContext: z.string().optional().describe('Additional context for the call script.'),
        }),
    },
    output: {
        schema: z.object({
            script: z.string().describe('The generated call script.'),
        }),
    },
    prompt: `You are an AI assistant specializing in generating personalized and effective call scripts for outbound sales calls.

Based on the information provided, create a concise and engaging call script that aligns with the campaign goals.

Campaign Name: {{{campaignName}}}
Product Name: {{{productName}}}
Target Audience: {{{targetAudience}}}
Call Objective: {{{callObjective}}}
Additional Context: {{{additionalContext}}}

Here is the call script:`,
});

const generateCallScriptFlow = ai.defineFlow<
    typeof GenerateCallScriptInputSchema,
    typeof GenerateCallScriptOutputSchema
>(
    {
        name: 'generateCallScriptFlow',
        inputSchema: GenerateCallScriptInputSchema,
        outputSchema: GenerateCallScriptOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);

    