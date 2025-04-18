'use server';
/**
 * @fileOverview This tool generates a PDF report using reportlab.
 *
 * - generateReport - A tool that handles the report generation process.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const GenerateReportInputSchema = z.object({
  campaignScore: z.number().describe('The campaign score.'),
  script: z.string().describe('The call script.'),
  tier: z.string().describe('The tier of the campaign.'),
});

const GenerateReportOutputSchema = z.string().describe('The path to the generated PDF report.');

export const generateReport = ai.defineTool(
  {
    name: 'generateReport',
    description: 'Generates a PDF report containing the campaign score, script, and tier.',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const { campaignScore, script, tier } = input;
    //Instead of generating PDF, return data. The FE will render this data.
    return `Campaign Score: ${campaignScore}, Script: ${script}, Tier: ${tier}`;
  }
);

export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;
