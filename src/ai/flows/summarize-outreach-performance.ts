'use server';
/**
 * @fileOverview Summarizes outreach campaign performance metrics using XGBoost for lead prioritization.
 *
 * - summarizeOutreachPerformance - A function that summarizes outreach performance metrics and incorporates XGBoost predictions.
 * - SummarizeOutreachPerformanceInput - The input type for the SummarizeOutreachPerformance function.
 * - SummarizeOutreachPerformanceOutput - The return type for the SummarizeOutreachPerformance function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import { generateReport } from '@/ai/tools/generate-report';
import { analyzeSentiment } from '@/ai/tools/analyze-sentiment';
import { forecastTrends } from '@/ai/tools/forecast-trends';
import {read} from '@/lib/firebaseServer';

const SummarizeOutreachPerformanceInputSchema = z.object({
  responseRates: z.number().describe('The response rates of the outreach campaign.'),
  complianceFlags: z.number().describe('The number of compliance flags raised during the outreach campaign.'),
  campaignName: z.string().describe('The name of the outreach campaign.'),
  connections: z.number().describe('Number of connections'),
  script: z.string().describe('Call Script'),
  tier: z.enum(['basic', 'pro', 'enterprise']).default('basic').describe('Tier access level'),
  messageResponses: z.string().describe('Message Responses'),
  campaignHistory: z.string().describe('Campaign History'),
  callId: z.string().describe('The id of the call.'),
  platform: z.enum(['linkedin', 'twitter', 'email']).describe('The platform for the outreach script.'),
});
export type SummarizeOutreachPerformanceInput = z.infer<
  typeof SummarizeOutreachPerformanceInputSchema
>;

const SummarizeOutreachPerformanceOutputSchema = z.object({
  summary: z.string().describe('The summary of the outreach campaign performance, including XGBoost model score.'),
  modelScore: z.number().describe('The XGBoost model score for lead prioritization.'),
  reportContent: z.string().describe('The content of the generated PDF report.'),
  sentimentScore: z.optional(z.number().describe('Sentiment score of the message responses.')),
  trendForecast: z.optional(z.string().describe('3-5 year trend forecast of campaign performance.')),
  suggestCall: z.boolean().describe('Suggest user to make a virtual call')
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
    complianceFlags: z.number().describe('The number of compliance flags raised during the outreach campaign.'),
    connections: z.number().describe('Number of connections'),
  }),
  outputSchema: z.number().describe('The XGBoost model score for lead prioritization.'),
}, async (input) => {
  // Simulate XGBoost model training and scoring
  // Replace this with actual XGBoost implementation
  const {responseRates, complianceFlags, connections} = input;
  const modelScore = (responseRates * 0.4 + (1 - complianceFlags) * 0.3 + connections * 0.3); // weighted score
  return modelScore;
});

const prompt = ai.definePrompt({
  name: 'summarizeOutreachPerformancePrompt',
  input: {
    schema: z.object({
      responseRates: z.number().describe('The response rates of the outreach campaign.'),
      complianceFlags: z.number().describe('The number of compliance flags raised during the outreach campaign.'),
      campaignName: z.string().describe('The name of the outreach campaign.'),
      modelScore: z.number().describe('The XGBoost model score for lead prioritization.'),
      sentimentScore: z.optional(z.number().describe('Sentiment score of the message responses.')),
      trendForecast: z.optional(z.string().describe('3-5 year trend forecast of campaign performance.')),
      tier: z.string().describe('Tier'),
      suggestCall: z.boolean().describe('Suggest user to make a virtual call')
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('The summary of the outreach campaign performance.'),
    }),
  },
  prompt: `You are an expert marketing analyst.

You will analyze the outreach campaign performance metrics and generate a summary in markdown format. Include the XGBoost model score to highlight lead prioritization.  Also consider suggesting call if sentiment is high

Campaign Name: {{{campaignName}}}
Response Rates: {{{responseRates}}}
Compliance Flags: {{{complianceFlags}}}
XGBoost Model Score: {{{modelScore}}}
{{#if sentimentScore}}
Sentiment Score: {{{sentimentScore}}}
{{/if}}
{{#if trendForecast}}
Trend Forecast: {{{trendForecast}}}
{{/if}}
Tier Access Level: {{{tier}}}
{{#if suggestCall}} Suggest to user to make call to follow up the process{{/if}}
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

    let sentimentScore: number | undefined = undefined;
    let trendForecast: string | undefined = undefined;
    let suggestCall: boolean = false;

    if (input.tier === 'pro' || input.tier === 'enterprise') {
      sentimentScore = await analyzeSentiment({messageResponses: input.messageResponses});
      trendForecast = await forecastTrends({campaignHistory: input.campaignHistory});
      suggestCall = sentimentScore > 0.5; // Suggest a call if sentiment is positive
    }

    const {output} = await prompt({
      ...input,
      modelScore: modelScore,
      sentimentScore: sentimentScore,
      trendForecast: trendForecast,
      tier: input.tier,
      suggestCall: suggestCall
    });

    const reportContent = await generateReport({
      campaignScore: modelScore,
      script: input.script,
      tier: input.tier,
    });

    // Read call data from Firestore
     const callData = await read('calls', input.callId);

    return {
      summary: output!.summary,
      modelScore: modelScore,
      reportContent: reportContent,
      sentimentScore: sentimentScore,
      trendForecast: trendForecast,
      suggestCall: suggestCall,
    };
  }
);
