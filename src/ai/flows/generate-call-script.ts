'use server';

/**
 * @fileOverview Generates personalized call scripts using Gemini 2.0, incorporating user approval and subscription tiers, and manages call quotas.
 *
 * - generateCallScript - A function that handles the call script generation process.
 * - GenerateCallScriptInput - The input type for the generateCallScript function.
 * - GenerateCallScriptOutput - The return type for the generateCallScript function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import { create } from '@/lib/firebaseAdmin';

const GenerateCallScriptInputSchema = z.object({
  campaignName: z.string().describe('The name of the outreach campaign.'),
  productName: z.string().describe('The name of the product being promoted.'),
  targetAudience: z.string().describe('Description of the target audience.'),
  callObjective: z.string().describe('The objective of the phone call.'),
  additionalContext: z.string().optional().describe('Additional context for the call script, such as specific points to cover or questions to ask.'),
  preferredTone: z.enum(['formal', 'informal', 'professional']).default('professional').describe('The desired tone of the call script.'),
  industry: z.string().describe('The industry of the target professional.'),
  connections: z.number().describe('The number of connections the target professional has.'),
  subscriptionTier: z.enum(['basic', 'pro', 'enterprise']).default('basic').describe('The subscription tier of the user.'),
  usedCallCount: z.number().default(0).describe('The number of calls used by the user in the current period.'),
  leadId: z.string().describe('The id of the lead.'),
});
export type GenerateCallScriptInput = z.infer<typeof GenerateCallScriptInputSchema>;

const GenerateCallScriptOutputSchema = z.object({
  script: z.string().describe('The generated call script.'),
  quotaExceeded: z.boolean().describe('Indicates whether the user has exceeded their call quota.'),
  callId: z.string().describe('The id of the call.'),
});
export type GenerateCallScriptOutput = z.infer<typeof GenerateCallScriptOutputSchema>;

export async function generateCallScript(input: GenerateCallScriptInput): Promise<GenerateCallScriptOutput> {
  return generateCallScriptFlow(input);
}

// Define a tool to check the call quota based on the user's subscription tier
const checkCallQuota = ai.defineTool({
  name: 'checkCallQuota',
  description: 'Checks if the user has exceeded their call quota based on their subscription tier.',
  inputSchema: z.object({
    subscriptionTier: z.enum(['basic', 'pro', 'enterprise']).describe('The subscription tier of the user.'),
    usedCallCount: z.number().default(0).describe('The number of calls used by the user in the current period.'),
  }),
  outputSchema: z.boolean().describe('True if the quota is exceeded, false otherwise.'),
}, async (input) => {
  const {subscriptionTier, usedCallCount} = input;
  let callLimit;

  switch (subscriptionTier) {
    case 'basic':
      callLimit = 100;
      break;
    case 'pro':
      callLimit = 500;
      break;
    case 'enterprise':
      callLimit = Number.MAX_SAFE_INTEGER; // Unlimited calls
      break;
    default:
      callLimit = 0; // No calls allowed
  }

  return usedCallCount >= callLimit;
});

const prompt = ai.definePrompt({
  name: 'generateCallScriptPrompt',
  input: {
    schema: z.object({
      campaignName: z.string().describe('The name of the outreach campaign.'),
      productName: z.string().describe('The name of the product being promoted.'),
      targetAudience: z.string().describe('Description of the target audience.'),
      callObjective: z.string().describe('The objective of the phone call.'),
      additionalContext: z.string().optional().describe('Additional context for the call script, such as specific points to cover or questions to ask.'),
      preferredTone: z.string().describe('The desired tone of the call script (formal, informal, or professional).'),
      industry: z.string().describe('The industry of the target professional.'),
      connections: z.number().describe('The number of connections the target professional has.'),
      subscriptionTier: z.string().describe('The subscription tier of the user (basic, pro, or enterprise).'),
    }),
  },
  output: {
    schema: z.object({
      script: z.string().describe('The generated call script.'),
    }),
  },
  prompt: `You are an AI assistant specializing in generating personalized and effective call scripts for outbound sales calls. You should generate a script that is concise, engaging, and aligns with the campaign goals.
The tone should be {{{preferredTone}}}. Generate a follow-up call script for {{{industry}}} professional with {{{connections}}} connections. The user's subscription tier is {{{subscriptionTier}}}.

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
    // Check if the call quota has been exceeded
    const quotaExceeded = await checkCallQuota({
      subscriptionTier: input.subscriptionTier,
      usedCallCount: input.usedCallCount,
    });

    if (quotaExceeded) {
      return {
        script: '',
        quotaExceeded: true,
        callId: '',
      };
    }

    const {output} = await prompt(input);

    // Store the generated call script in Firestore
    const callData = {
      leadId: input.leadId,
      script: output!.script,
      status: 'pending', // Initial status
      timestamp: new Date().toISOString(),
    };

    const callId = await create('calls', callData);

    return {
      script: output!.script,
      quotaExceeded: false,
      callId: callId,
    };
  }
);
