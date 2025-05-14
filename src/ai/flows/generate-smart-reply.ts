'use server';
/**
 * @fileOverview Generates a smart reply to a received message, including emotion detection.
 *
 * - generateSmartReply - A function that handles the smart reply generation process.
 * - GenerateSmartReplyInputSchema - The Zod schema for the input of the generateSmartReply function.
 * - GenerateSmartReplyOutputSchema - The Zod schema for the output of the generateSmartReply function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

// Define Zod Schemas
export const GenerateSmartReplyInputSchema = z.object({
  receivedMessage: z.string().describe('The message received from the prospect.'),
  context: z.string().describe('The context of the conversation (e.g., "Product outreach to CTO for SaaS solution for ConvoSpan AI").'),
  // Optional: add platform, previous conversation history if needed for richer context
});
export type GenerateSmartReplyInput = z.infer<typeof GenerateSmartReplyInputSchema>;

export const GenerateSmartReplyOutputSchema = z.object({
  detectedEmotion: z.string().describe('The detected emotional tone of the received message. Options: [Positive, Neutral, Negative, Confused, Curious, Interested, Uninterested, Other]'),
  aiReply: z.string().describe('The AI-generated smart reply.'),
});
export type GenerateSmartReplyOutput = z.infer<typeof GenerateSmartReplyOutputSchema>;

// Define the main exported function
export async function generateSmartReply(input: GenerateSmartReplyInput): Promise<GenerateSmartReplyOutput> {
  return generateSmartReplyFlow(input);
}

// Define Genkit Prompts
const detectEmotionPrompt = ai.definePrompt({
    name: 'detectEmotionPrompt',
    input: { schema: z.object({ message: z.string() }) },
    output: { schema: z.object({ emotion: z.string().describe('One of: Positive, Neutral, Negative, Confused, Curious, Interested, Uninterested, Other') }) },
    prompt: `Classify the emotional tone of the following message. Your response should be ONLY ONE of the following options: Positive, Neutral, Negative, Confused, Curious, Interested, Uninterested, Other.

Message:
"{{{message}}}"

Detected Emotion:`,
});

const generateReplyPrompt = ai.definePrompt({
    name: 'generateSmartReplyPrompt',
    input: { schema: z.object({
        message: z.string(),
        emotion: z.string(),
        conversationContext: z.string(),
    })},
    output: { schema: z.object({ reply: z.string() }) },
    prompt: `You are an AI assistant for ConvoSpan AI, specializing in LinkedIn outreach.
The prospect sent the following message:
"{{{message}}}"

The detected emotional tone of their message is: {{{emotion}}}.
The overall conversation context is: {{{conversationContext}}}.

Please generate a professional, concise, and personalized LinkedIn reply.
- If the emotion is Negative, be empathetic, acknowledge their concern (if any), and offer a resolution or a way to disengage politely.
- If the emotion is Positive or Interested, build on the positivity and try to move the conversation towards the campaign goal (e.g., suggest a brief call, ask a relevant follow-up question, provide a valuable resource).
- If the emotion is Neutral, Confused, or Curious, aim to clarify, provide more information, or re-engage them with a gentle nudge or question.
- If the emotion is Uninterested, politely acknowledge and thank them for their time. Avoid being pushy.
- If the emotion is Other, use your best judgment based on the message content and context.

Keep the reply suitable for LinkedIn messaging. Ensure the reply is natural and not overly robotic.

AI Reply:`,
});


// Define the Genkit flow
const generateSmartReplyFlow = ai.defineFlow(
  {
    name: 'generateSmartReplyFlow',
    inputSchema: GenerateSmartReplyInputSchema,
    outputSchema: GenerateSmartReplyOutputSchema,
  },
  async (input) => {
    const { receivedMessage, context } = input;

    // Step 1: Detect Emotion
    const emotionResult = await detectEmotionPrompt({ message: receivedMessage });
    // Default to 'Neutral' if emotion isn't specifically detected or if output is null/undefined
    const detectedEmotion = emotionResult.output?.emotion || 'Neutral';

    // Step 2: Generate Reply
    const replyResult = await generateReplyPrompt({
        message: receivedMessage,
        emotion: detectedEmotion,
        conversationContext: context,
    });
    // Provide a fallback reply if generation fails
    const aiReply = replyResult.output?.reply || "Thank you for your message. I'll get back to you shortly.";

    return {
      detectedEmotion,
      aiReply,
    };
  }
);
