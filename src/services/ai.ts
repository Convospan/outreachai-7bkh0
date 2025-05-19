// src/services/ai.ts
'use server'; // Ensure this can run server-side

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("🔴 GEMINI_API_KEY is not set in environment variables. AI message generation will fail.");
  // Potentially throw an error here or handle it depending on desired behavior
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "fallback_key_if_not_set_but_will_fail");

interface ProfileData {
  name?: string;
  headline?: string;
  company?: string;
  // Add any other relevant fields from profileData that the prompt might use
}

export async function generatePersonalizedMessage(profileData: ProfileData): Promise<string> {
  const promptParts: string[] = [];
  if (profileData.name) promptParts.push(`Name: ${profileData.name}`);
  if (profileData.headline) promptParts.push(`Headline: ${profileData.headline}`);
  if (profileData.company) promptParts.push(`Company: ${profileData.company}`);

  const prompt = `
    Craft a personalized LinkedIn message for a prospect with the following details:
    ${promptParts.join('\n    ')}
    The message should be professional, concise, and tailored to their role. Aim for 2-3 sentences.
    Make it engaging and suggest a clear next step if appropriate (e.g., a brief chat, sharing a resource).
  `;

  if (!GEMINI_API_KEY) {
    console.error("generatePersonalizedMessage: GEMINI_API_KEY is not available.");
    return `Hello ${profileData.name || 'there'}, I came across your profile and was impressed by your work at ${profileData.company || 'your company'}. I'd love to connect. (Error: API Key Missing)`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error('Error generating personalized message with Gemini API:', error.message);
    // Fallback message in case of error
    return `Hello ${profileData.name || 'there'}, I came across your profile and was impressed by your work at ${profileData.company || 'your company'}. I'd love to connect. (Error: AI Generation Failed)`;
  }
}
