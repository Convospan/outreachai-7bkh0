'use server';

// Import your Genkit AI instance.
// Ensure this path is correct for your project setup.
// Example: import { ai } from '@/genkit/genkit-instance'; // Assuming Genkit setup
import { configureGenkit, generate } from '@genkit-ai/ai'; // Adjust import based on your Genkit setup
import { geminiPro } from '@genkit-ai/google-cloud'; // For Google Cloud Gemini models

// --- Genkit Configuration Placeholder (if not configured elsewhere) ---
// If your Genkit AI instance is not globally configured or imported from a specific file,
// you might need a minimal configuration here for Genkit to work.
// Typically, you'd configure Genkit once at application startup.
// This example assumes you have an 'ai' instance available or are importing 'generate' directly.

// Example: Configure Genkit if not done globally.
// Remove if you have a centralized Genkit config/instance.
if (!process.env.GOOGLE_GENAI_API_KEY) {
  console.warn("GOOGLE_GENAI_API_KEY is not set. Gemini API calls will fail.");
}

// Minimal Genkit configuration (adjust models as needed)
// This might be redundant if your Genkit instance is imported from a configured file.
try {
  configureGenkit({
    plugins: [
      geminiPro({ apiKey: process.env.GOOGLE_GENAI_API_KEY || '' }),
    ],
    // Other Genkit options like flow, etc.
  });
} catch (error) {
  // Catch error if already configured (e.g., in development with hot reload)
  if (error instanceof Error && !error.message.includes('already configured')) {
    console.error('Failed to configure Genkit:', error);
  }
}
// --- End Genkit Configuration Placeholder ---


/**
 * Makes an actual call to the Gemini API using Genkit.
 * @param requestData Object containing the prompt and other model parameters.
 * @returns The response from the Gemini API.
 */
async function callGeminiAPI(requestData: { prompt: string; model?: string; temperature?: number; [key: string]: any }): Promise<any> {
  console.log("Calling Gemini API with data:", requestData);

  try {
    const { response } = await generate({
      prompt: requestData.prompt,
      model: requestData.model || 'gemini-pro', // Use 'gemini-pro' or 'gemini-1.5-flash' etc.
      temperature: requestData.temperature || 0.7, // Adjust temperature for creativity
      // Add other Genkit options based on your requestData, e.g., outputFormat
      // outputFormat: 'json', // If you expect JSON output
      // config: {
      //   maxOutputTokens: 500,
      // }
    });
    // Genkit's `generate` returns a response object; extract the output.
    if (!response || !response.text()) {
      throw new Error("Gemini API returned an empty or unreadable response.");
    }
    return { output: response.text() }; // Return the text output from Gemini
  } catch (error: any) {
    console.error("Error during Gemini API call:", error);
    // You might want to parse specific error types from Genkit/Google Generative AI
    // For "resource exhausted" type errors, you might need to inspect `error.details` or `error.code`
    // The retry logic in `WorkspaceGeminiResponse` looks for `error.status === 'GEMINI_RESOURCE_EXHAUSTED'`.
    // You'll need to map actual API errors to this custom status if you want to reuse that specific retry trigger.
    // For example, if Genkit throws a specific error for rate limits, you'd check `error.code` or `error.name`.
    
    // For demonstration, let's re-throw with a generic error, or map specific ones.
    if (error.code === 8 || error.message.includes('RESOURCE_EXHAUSTED')) { // Common gRPC code for resource exhaustion is 8
        const resourceExhaustedError: any = new Error("Resource exhausted during Gemini API call.");
        resourceExhaustedError.status = 'GEMINI_RESOURCE_EXHAUSTED';
        throw resourceExhaustedError;
    }
    throw new Error(`Gemini API call failed: ${error.message}`);
  }
}

/**
 * Fetches a response from the Gemini API with retry logic for resource exhaustion errors.
 * @param requestData The data to send to the Gemini API (e.g., prompt, model, temperature).
 * @param retries The maximum number of retries.
 * @param delay The initial delay between retries in milliseconds.
 * @returns A promise that resolves with the API response.
 * @throws Throws an error if the API call fails after all retries or for non-retryable errors.
 */
export const fetchGeminiResponse = async (requestData: any, retries = 3, delay = 1000): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await callGeminiAPI(requestData);
      return response;
    } catch (error: any) {
      // Check for a specific status or error code that indicates resource exhaustion
      if (error.status === 'GEMINI_RESOURCE_EXHAUSTED' && i < retries - 1) {
        const waitTime = delay * Math.pow(2, i); // Exponential backoff: 1s, 2s, 4s...
        console.warn(`Gemini resource exhausted, retrying attempt ${i + 2} in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error(`Failed to fetch Gemini response. Attempt ${i + 1} of ${retries}. Error:`, error.message);
        if (i === retries - 1) { // If this was the last attempt
          throw error; // Rethrow the error if all retries are exhausted or it's a different error
        }
      }
    }
  }
  // This line should ideally not be reached if an error is always thrown on the last retry.
  throw new Error("Failed to fetch Gemini response after all retries. This point should not be reached.");
};