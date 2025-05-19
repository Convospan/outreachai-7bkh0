// src/services/ai.ts
'use server';

// Placeholder for your actual GeminiClient implementation
// It's recommended to use your existing Genkit setup (e.g., ai.generate() with a defined prompt)
// instead of a custom client if possible, for better integration with your project.
import { GeminiClient } from "./geminiClient"; 

interface ProfileData {
  name?: string;
  headline?: string;
  company?: string;
  // Add any other relevant fields from profileData
}

export async function generatePersonalizedMessage(profileData: ProfileData): Promise<string> {
  const promptParts = [];
  if (profileData.name) promptParts.push(`Name: ${profileData.name}`);
  if (profileData.headline) promptParts.push(`Headline: ${profileData.headline}`);
  if (profileData.company) promptParts.push(`Company: ${profileData.company}`);

  const prompt = `
    Craft a personalized LinkedIn message for a prospect with the following details:
    ${promptParts.join('\n    ')}
    The message should be professional, concise, and tailored to their role. Aim for 2-3 sentences.
    Make it engaging and suggest a clear next step if appropriate (e.g., a brief chat, sharing a resource).
  `;

  try {
    // This assumes GeminiClient is correctly implemented and configured
    // with API keys and makes the actual call to the Gemini API.
    const gemini = new GeminiClient(); 
    const responseText = await gemini.generateText(prompt);
    
    if (!responseText) {
      console.error("Gemini client returned an empty response.");
      return "I'd be interested in learning more about your work."; // Fallback message
    }
    return responseText;
  } catch (error: any) {
    console.error('Error generating personalized message:', error.message);
    // Fallback message in case of error
    return `Hello ${profileData.name || 'there'}, I came across your profile and was impressed by your work at ${profileData.company || 'your company'}. I'd love to connect.`;
  }
}
