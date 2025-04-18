'use server';
/**
 * @fileOverview Summarizes outreach campaign performance metrics.
 *
 * - summarizeOutreachPerformance - A function that summarizes outreach performance metrics.
 * - SummarizeOutreachPerformanceInput - The input type for the summarizeOutreachPerformance function.
 * - SummarizeOutreachPerformanceOutput - The return type for the summarizeOutreachPerformance function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeOutreachPerformanceInputSchema = z.object({
  responseRates: z.number().describe('The response rates of the outreach campaign.'),
  sentimentScores: z.number().describe('The sentiment scores of the outreach campaign.'),
  complianceFlags: z.number().describe('The number of compliance flags raised during the outreach campaign.'),
  campaignName: z.string().describe('The name of the outreach campaign.'),
});
export type SummarizeOutreachPerformanceInput = z.infer<
  typeof SummarizeOutreachPerformanceInputSchema
>;

const SummarizeOutreachPerformanceOutputSchema = z.object({
  summary: z.string().describe('The summary of the outreach campaign performance.'),
});
export type SummarizeOutreachPerformanceOutput = z.infer<
  typeof SummarizeOutreachPerformanceOutputSchema
>;

export async function summarizeOutreachPerformance(
  input: SummarizeOutreachPerformanceInput
): Promise<SummarizeOutreachPerformanceOutput> {
  return summarizeOutreachPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeOutreachPerformancePrompt',
  input: {
    schema: z.object({
      responseRates: z.number().describe('The response rates of the outreach campaign.'),
      sentimentScores: z.number().describe('The sentiment scores of the outreach campaign.'),
      complianceFlags: z.number().describe('The number of compliance flags raised during the outreach campaign.'),
      campaignName: z.string().describe('The name of the outreach campaign.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('The summary of the outreach campaign performance.'),
    }),
  },
  prompt: `You are an expert marketing analyst.

You will analyze the outreach campaign performance metrics and generate a summary in markdown format.

Campaign Name: {{{campaignName}}}
Response Rates: {{{responseRates}}}
Sentiment Scores: {{{sentimentScores}}}
Compliance Flags: {{{complianceFlags}}}

Summary: `,
});

const summarizeOutreachPerformanceFlow = ai.defineFlow<
  typeof SummarizeOutreachPerformanceInputSchema,
  typeof SummarizeOutreachPerformanceOutputSchema
>(
  {
    name: 'summarizeOutreachPerformanceFlow',
    inputSchema: SummarizeOutreachPerformanceInputSchema,
    outputSchema: SummarizeOutreachPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
