import '@/ai/flows/summarize-outreach-performance.ts';
import '@/ai/flows/generate-outreach-script.ts';
import '@/ai/flows/generate-call-script.ts';
import '@/ai/flows/generate-outreach-sequence.ts';
import '@/ai/flows/enrich-linkedin-profile.ts';
import '@/ai/flows/generate-smart-reply.ts'; // Added import for the new smart reply flow
import '@/ai/tools/search-google.ts';
import '@/ai/tools/analyze-sentiment.ts';
import '@/ai/tools/forecast-trends.ts';
import '@/ai/tools/generate-report.ts';
import '@/ai/tools/sendEmail.ts'; // Ensure this is imported

import { fetchGeminiResponse } from '../lib/ai-utils'; // Import the function
import { defineAction } from 'genkit';
import { z } from 'zod';

defineAction(
  {
    name: 'simulateGeminiRetry',
    inputSchema: z.object({ prompt: z.string() }),
    outputSchema: z.any(),
  },
  async (input) => {
    console.log('Starting simulation for prompt:', input.prompt);
    try {
      const result = await fetchGeminiResponse({ prompt: input.prompt });
      console.log('[SUCCESS] Simulation completed successfully:', result);
      return result;
    } catch (error: any) {
      console.error('[ERROR] Simulation failed after retries:', error.message);
      // You might want to return a specific error structure or re-throw
      return { error: error.message, status: error.status || 'unknown' };
    }
  }
);
