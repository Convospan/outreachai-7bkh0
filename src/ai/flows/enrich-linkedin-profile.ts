'use server';
/**
 * @fileOverview A LinkedIn profile enricher with Google Search.
 *
 * - enrichLinkedInProfile - A function that handles the profile enrichment process.
 * - EnrichLinkedInProfileInput - The input type for the enrichLinkedInProfile function.
 * - EnrichLinkedInProfileOutput - The return type for the enrichLinkedInProfile function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import { searchGoogle } from '@/ai/tools/search-google';

const EnrichLinkedInProfileInputSchema = z.object({
  name: z.string().describe('The name of the person.'),
  company: z.string().describe('The company the person works for.'),
  linkedinProfile: z.object({
    id: z.string().describe('The LinkedIn profile ID.'),
    headline: z.string().describe('The profile headline.'),
    profileUrl: z.string().describe('The profile URL.'),
  }).optional().describe('The LinkedIn profile data if available.'),
  additionalContext: z.string().optional().describe('Additional context to personalize the outreach script.'),
});
export type EnrichLinkedInProfileInput = z.infer<typeof EnrichLinkedInProfileInputSchema>;

const EnrichLinkedInProfileOutputSchema = z.object({
  enrichedProfile: z.string().describe('The enriched profile information.'),
});
export type EnrichLinkedInProfileOutput = z.infer<typeof EnrichLinkedInProfileOutputSchema>;

export async function enrichLinkedInProfile(input: EnrichLinkedInProfileInput): Promise<EnrichLinkedInProfileOutput> {
  return enrichLinkedInProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enrichLinkedInProfilePrompt',
  input: {
    schema: z.object({
      name: z.string().describe('The name of the person.'),
      company: z.string().describe('The company the person works for.'),
      linkedinProfile: z.string().optional().describe('The LinkedIn profile data if available.'),
      additionalContext: z.string().optional().describe('Additional context to personalize the outreach script.'),
      searchResults: z.string().describe('The search results from Google.'),
    }),
  },
  output: {
    schema: z.object({
      enrichedProfile: z.string().describe('The enriched profile information.'),
    }),
  },
  prompt: `You are an AI assistant specializing in enriching LinkedIn profiles with additional information from Google search results.
  You are given the name of the person, the company they work for, their LinkedIn profile data (if available), additional context, and Google search results.
  Your task is to summarize the search results and combine it with the LinkedIn profile data (if available) and additional context to create an enriched profile.

  Name: {{{name}}}
  Company: {{{company}}}
  LinkedIn Profile: {{{linkedinProfile}}}
  Additional Context: {{{additionalContext}}}
  Search Results: {{{searchResults}}}

  Enriched Profile:`,
});

const enrichLinkedInProfileFlow = ai.defineFlow<
  typeof EnrichLinkedInProfileInputSchema,
  typeof EnrichLinkedInProfileOutputSchema
>(
  {
    name: 'enrichLinkedInProfileFlow',
    inputSchema: EnrichLinkedInProfileInputSchema,
    outputSchema: EnrichLinkedInProfileOutputSchema,
  },
  async input => {
    let searchResults = '';
    try {
      const googleSearchInput = {
        query: `site:linkedin.com inurl:in ${input.name} ${input.company}`,
      };
      const searchResultsTool = await searchGoogle(googleSearchInput);
      searchResults = searchResultsTool;
    } catch (error) {
      console.error('Failed to get google search results:', error);
    }

    const {output} = await prompt({
      ...input,
      searchResults: searchResults,
    });
    return output!;
  }
);
