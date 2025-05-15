
'use server';
/**
 * @fileOverview This tool sends an email using the SendPulse API.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import axios, { AxiosError } from 'axios';

const SendEmailInputSchema = z.object({
  to: z.string().email().describe("The recipient's email address."),
  subject: z.string().describe('The subject of the email.'),
  htmlBody: z.string().describe('The HTML content of the email.'),
  textBody: z.string().optional().describe('The plain text content of the email (recommended).'),
  fromEmail: z.string().email().optional().describe("The sender's email address. Defaults to system config if not provided."),
  fromName: z.string().optional().describe("The sender's name. Defaults to system config if not provided."),
});

const SendEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  messageId: z.string().optional().describe('The message ID from SendPulse if successful.'),
  error: z.string().optional().describe('Error message if sending failed.'),
});

const SENDPULSE_API_URL = process.env.SENDPULSE_API_BASE_URL; // Ensure this is set
const SENDPULSE_CLIENT_ID = process.env.SENDPULSE_CLIENT_ID;
const SENDPULSE_CLIENT_SECRET = process.env.SENDPULSE_CLIENT_SECRET;
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL;
const DEFAULT_FROM_NAME = process.env.DEFAULT_FROM_NAME;

let sendPulseAccessToken: string | null = null;
let tokenExpiryTime: number | null = null;

async function getSendPulseAccessToken(): Promise<string | null> {
  if (sendPulseAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return sendPulseAccessToken;
  }

  if (!SENDPULSE_CLIENT_ID || !SENDPULSE_CLIENT_SECRET || !SENDPULSE_API_URL) {
    console.error('SendPulse API credentials (SENDPULSE_CLIENT_ID, SENDPULSE_CLIENT_SECRET, SENDPULSE_API_BASE_URL) are not configured.');
    return null;
  }
  try {
    const response = await axios.post(`${SENDPULSE_API_URL}/oauth/access_token`, {
      grant_type: 'client_credentials',
      client_id: SENDPULSE_CLIENT_ID,
      client_secret: SENDPULSE_CLIENT_SECRET,
    });
    sendPulseAccessToken = response.data.access_token;
    // SendPulse tokens typically expire in 1 hour (3600 seconds)
    tokenExpiryTime = Date.now() + (response.data.expires_in - 300) * 1000; // Refresh 5 mins before expiry
    return sendPulseAccessToken;
  } catch (error: any) {
    const err = error as AxiosError<any>;
    console.error('Failed to get SendPulse access token:', err.response?.data || err.message);
    sendPulseAccessToken = null;
    tokenExpiryTime = null;
    return null;
  }
}

export const sendEmail = ai.defineTool(
  {
    name: 'sendEmailWithSendPulse',
    description: 'Sends an email using the SendPulse API.',
    inputSchema: SendEmailInputSchema,
    outputSchema: SendEmailOutputSchema,
  },
  async (input): Promise<z.infer<typeof SendEmailOutputSchema>> => {
    if (!SENDPULSE_API_URL || !DEFAULT_FROM_EMAIL || !DEFAULT_FROM_NAME) {
        return { success: false, error: 'SendPulse base URL or default sender info is not configured.' };
    }

    const accessToken = await getSendPulseAccessToken();
    if (!accessToken) {
      return { success: false, error: 'Failed to authenticate with SendPulse. Check API credentials.' };
    }

    const fromEmail = input.fromEmail || DEFAULT_FROM_EMAIL;
    const fromName = input.fromName || DEFAULT_FROM_NAME;

    // Ensure textBody is provided if htmlBody might be simple
    const textContent = input.textBody || input.htmlBody.replace(/<[^>]*>?/gm, '');
    if (!textContent && !input.htmlBody) {
        return { success: false, error: "Email body (HTML or text) is required."};
    }

    const emailData = {
      email: {
        html: input.htmlBody,
        text: textContent,
        subject: input.subject,
        from: {
          name: fromName,
          email: fromEmail,
        },
        to: [
          {
            name: input.to.split('@')[0], // Best guess for name, ideally pass full name if available
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

      // SendPulse success check: result should be true and an id should be present
      if (response.data && response.data.result === true && response.data.id) {
        console.log(`Email sent to ${input.to} via SendPulse. Message ID: ${response.data.id}`);
        return { success: true, messageId: response.data.id.toString() };
      } else {
        console.error('SendPulse email sending reported failure or missing ID:', response.data);
        return { success: false, error: response.data?.message || 'SendPulse reported an error or did not return a message ID.' };
      }
    } catch (error: any) {
      const err = error as AxiosError<any>;
      console.error('Error sending email via SendPulse:', err.response?.data || err.message);
      let errorMessage = err.message || 'An unknown error occurred while sending email via SendPulse.';
      if (err.response?.data?.message) {
        errorMessage = `SendPulse API Error (${err.response.status}): ${err.response.data.message}`;
      } else if (err.response?.data?.error_description) {
         errorMessage = `SendPulse API Error (${err.response.status}): ${err.response.data.error_description}`;
      }
      return { success: false, error: errorMessage };
    }
  }
);

export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;
export type SendEmailOutput = z.infer<typeof SendEmailOutputSchema>;

    