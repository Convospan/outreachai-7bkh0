'use server';
/**
 * @fileOverview This tool sends an email using the SendPulse API.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import axios from 'axios';

const SendEmailInputSchema = z.object({
  to: z.string().email().describe('The recipient\'s email address.'),
  subject: z.string().describe('The subject of the email.'),
  htmlBody: z.string().describe('The HTML content of the email.'),
  textBody: z.string().optional().describe('The plain text content of the email (recommended).'),
  fromEmail: z.string().email().optional().describe('The sender\'s email address. Defaults to system config if not provided.'),
  fromName: z.string().optional().describe('The sender\'s name. Defaults to system config if not provided.'),
});

const SendEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  messageId: z.string().optional().describe('The message ID from SendPulse if successful.'),
  error: z.string().optional().describe('Error message if sending failed.'),
});

const SENDPULSE_API_URL = process.env.SENDPULSE_API_BASE_URL || 'https://api.sendpulse.com';
const SENDPULSE_CLIENT_ID = process.env.SENDPULSE_CLIENT_ID;
const SENDPULSE_CLIENT_SECRET = process.env.SENDPULSE_CLIENT_SECRET;
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || 'noreply@convospan.ai';
const DEFAULT_FROM_NAME = process.env.DEFAULT_FROM_NAME || 'ConvoSpan AI';

async function getSendPulseAccessToken(): Promise<string | null> {
  if (!SENDPULSE_CLIENT_ID || !SENDPULSE_CLIENT_SECRET) {
    console.error('SendPulse API credentials (SENDPULSE_CLIENT_ID, SENDPULSE_CLIENT_SECRET) are not configured.');
    return null;
  }
  try {
    const response = await axios.post(`${SENDPULSE_API_URL}/oauth/access_token`, {
      grant_type: 'client_credentials',
      client_id: SENDPULSE_CLIENT_ID,
      client_secret: SENDPULSE_CLIENT_SECRET,
    });
    return response.data.access_token;
  } catch (error: any) {
    console.error('Failed to get SendPulse access token:', error.response?.data || error.message);
    return null;
  }
}

export const sendEmail = ai.defineTool(
  {
    name: 'sendEmailWithSendPulse', // Renamed for clarity
    description: 'Sends an email using the SendPulse API.',
    inputSchema: SendEmailInputSchema,
    outputSchema: SendEmailOutputSchema,
  },
  async (input): Promise<z.infer<typeof SendEmailOutputSchema>> => {
    const accessToken = await getSendPulseAccessToken();
    if (!accessToken) {
      return { success: false, error: 'Failed to authenticate with SendPulse.' };
    }

    const fromEmail = input.fromEmail || DEFAULT_FROM_EMAIL;
    const fromName = input.fromName || DEFAULT_FROM_NAME;

    const emailData = {
      email: {
        html: input.htmlBody,
        text: input.textBody || input.htmlBody.replace(/<[^>]*>?/gm, ''), // Basic text version
        subject: input.subject,
        from: {
          name: fromName,
          email: fromEmail,
        },
        to: [
          {
            // SendPulse API expects recipient name, but we only have email
            // If recipient name is available elsewhere in the lead data, it should be passed
            name: input.to.split('@')[0], // Best guess for name
            email: input.to,
          },
        ],
      },
    };

    try {
      const response = await axios.post(`${SENDPULSE_API_URL}/smtp/emails`, emailData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.result) { // SendPulse specific success check
        console.log(`Email sent to ${input.to} via SendPulse. Message ID: ${response.data.id}`);
        return { success: true, messageId: response.data.id };
      } else {
        console.error('SendPulse email sending failed:', response.data);
        return { success: false, error: response.data.message || 'SendPulse reported an error.' };
      }
    } catch (error: any) {
      console.error('Error sending email via SendPulse:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message || 'An unknown error occurred.' };
    }
  }
);

export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;
export type SendEmailOutput = z.infer<typeof SendEmailOutputSchema>;
