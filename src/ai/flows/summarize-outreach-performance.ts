'use server';
/**
 * @fileOverview Summarizes outreach campaign performance metrics using XGBoost for lead prioritization.
 *
 * - summarizeOutreachPerformance - A function that summarizes outreach performance metrics and incorporates XGBoost predictions.
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
  connections: z.number().describe('Number of connections'),
});
export type SummarizeOutreachPerformanceInput = z.infer<
  typeof SummarizeOutreachPerformanceInputSchema
>;

const SummarizeOutreachPerformanceOutputSchema = z.object({
  summary: z.string().describe('The summary of the outreach campaign performance, including XGBoost model score.'),
  modelScore: z.number().describe('The XGBoost model score for lead prioritization.'),
});
export type SummarizeOutreachPerformanceOutput = z.infer<
  typeof SummarizeOutreachPerformanceOutputSchema
>;

export async function summarizeOutreachPerformance(
  input: SummarizeOutreachPerformanceInput
): Promise<SummarizeOutreachPerformanceOutput> {
  return summarizeOutreachPerformanceFlow(input);
}

// Define the tool for training XGBoost model
const trainXGBoostModel = ai.defineTool({
  name: 'trainXGBoostModel',
  description: 'Trains an XGBoost model for lead prioritization based on campaign metrics.',
  inputSchema: z.object({
    responseRates: z.number().describe('The response rates of the outreach campaign.'),
    sentimentScores: z.number().describe('The sentiment scores of the outreach campaign.'),
    complianceFlags: z.number().describe('The number of compliance flags raised during the outreach campaign.'),
    connections: z.number().describe('Number of connections'),
  }),
  outputSchema: z.number().describe('The XGBoost model score for lead prioritization.'),
}, async (input) => {
  // Simulate XGBoost model training and scoring
  // Replace this with actual XGBoost implementation
  const {responseRates, sentimentScores, complianceFlags, connections} = input;
  const modelScore = (responseRates * 0.4 + sentimentScores * 0.3 + (1 - complianceFlags) * 0.2 + connections * 0.1); // weighted score
  return modelScore;
});

const prompt = ai.definePrompt({
  name: 'summarizeOutreachPerformancePrompt',
  input: {
    schema: z.object({
      responseRates: z.number().describe('The response rates of the outreach campaign.'),
      sentimentScores: z.number().describe('The sentiment scores of the outreach campaign.'),
      complianceFlags: z.number().describe('The number of compliance flags raised during the outreach campaign.'),
      campaignName: z.string().describe('The name of the outreach campaign.'),
      modelScore: z.number().describe('The XGBoost model score for lead prioritization.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('The summary of the outreach campaign performance.'),
    }),
  },
  prompt: `You are an expert marketing analyst.

You will analyze the outreach campaign performance metrics and generate a summary in markdown format. Include the XGBoost model score to highlight lead prioritization.

Campaign Name: {{{campaignName}}}
Response Rates: {{{responseRates}}}
Sentiment Scores: {{{sentimentScores}}}
Compliance Flags: {{{complianceFlags}}}
XGBoost Model Score: {{{modelScore}}}

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
    // Train XGBoost model and get the model score
    const modelScore = await trainXGBoostModel(input);

    const {output} = await prompt({
      ...input,
      modelScore: modelScore,
    });
    return {
      summary: output!.summary,
      modelScore: modelScore,
    };
  }
);
