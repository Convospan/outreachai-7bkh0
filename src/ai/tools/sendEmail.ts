
'use server';
/**
 * @fileOverview This tool sends an email using the SendPulse API.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import axios, { AxiosError } from 'axios';

const SENDPULSE_API_BASE_URL = process.env.SENDPULSE_API_BASE_URL;
const SENDPULSE_CLIENT_ID = process.env.SENDPULSE_CLIENT_ID;
const SENDPULSE_CLIENT_SECRET = process.env.SENDPULSE_CLIENT_SECRET;
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL;
const DEFAULT_FROM_NAME = process.env.DEFAULT_FROM_NAME;

const SendEmailInputSchema = z.object({
  to: z.string().email().describe("The recipient's email address."),
  subject: z.string().describe('The subject of the email.'),
  htmlBody: z.string().describe('The HTML content of the email.'),
  textBody: z.string().optional().describe('The plain text content of the email. If not provided, it will be derived from htmlBody.'),
  fromEmail: z.string().email().optional().describe("The sender's email address. Defaults to system config if not provided."),
  fromName: z.string().optional().describe("The sender's name. Defaults to system config if not provided."),
});

const SendEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  messageId: z.string().optional().describe('The message ID from SendPulse if successful.'),
  error: z.string().optional().describe('Error message if sending failed.'),
});

// Simple in-memory cache for SendPulse access token
let sendPulseAccessToken: string | null = null;
let tokenExpiryTime: number | null = null; // Timestamp (in milliseconds) when the token expires

async function getSendPulseAccessToken(): Promise<string | null> {
  if (sendPulseAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime - (5 * 60 * 1000) /* 5 min buffer */) {
    return sendPulseAccessToken;
  }

  if (!SENDPULSE_API_BASE_URL || !SENDPULSE_CLIENT_ID || !SENDPULSE_CLIENT_SECRET) {
    console.error('SendPulse API credentials or base URL are not configured in environment variables.');
    return null;
  }

  try {
    console.log('Fetching new SendPulse access token...');
    const authResponse = await axios.post(`${SENDPULSE_API_BASE_URL}/oauth/access_token`, {
      grant_type: "client_credentials",
      client_id: SENDPULSE_CLIENT_ID,
      client_secret: SENDPULSE_CLIENT_SECRET
    });

    if (authResponse.data && authResponse.data.access_token && authResponse.data.expires_in) {
      sendPulseAccessToken = authResponse.data.access_token;
      // expires_in is in seconds, convert to milliseconds for Date.now()
      tokenExpiryTime = Date.now() + (authResponse.data.expires_in * 1000);
      console.log('Successfully fetched new SendPulse access token.');
      return sendPulseAccessToken;
    } else {
      console.error('Failed to retrieve access_token from SendPulse auth response:', authResponse.data);
      sendPulseAccessToken = null;
      tokenExpiryTime = null;
      return null;
    }
  } catch (error) {
    console.error('Error fetching SendPulse access token:', error instanceof AxiosError ? error.response?.data || error.message : error);
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
    if (!SENDPULSE_API_BASE_URL || !DEFAULT_FROM_EMAIL || !DEFAULT_FROM_NAME || !SENDPULSE_CLIENT_ID || !SENDPULSE_CLIENT_SECRET) {
      console.error('SendPulse configuration is incomplete. Check environment variables.');
      return { success: false, error: 'SendPulse service is not configured completely on the server.' };
    }

    const accessToken = await getSendPulseAccessToken();
    if (!accessToken) {
      return { success: false, error: 'Failed to authenticate with SendPulse. Check API credentials and server logs.' };
    }

    const fromEmail = input.fromEmail || DEFAULT_FROM_EMAIL;
    const fromName = input.fromName || DEFAULT_FROM_NAME;
    
    // SendPulse expects 'text' for plain text body. If not provided, derive from HTML.
    const textContent = input.textBody || input.htmlBody.replace(/<[^>]*>?/gm, ''); // Basic HTML to text stripping
    if (!input.htmlBody && !textContent) {
        return { success: false, error: "Email body (htmlBody or textBody) is required."};
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
            email: input.to,
            // name: input.toName // SendPulse might support recipient name, add if needed
          },
        ],
      },
    };

    try {
      const response = await axios.post(
        `${SENDPULSE_API_BASE_URL}/smtp/emails`,
        emailData,
        { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
      );

      // SendPulse success is usually indicated by response.data.result === true and an id
      if (response.data && response.data.result === true && response.data.id) {
        console.log(`Email sent to ${input.to} via SendPulse. Message ID: ${response.data.id}`);
        return { success: true, messageId: response.data.id.toString() };
      } else {
        console.error('SendPulse email sending reported failure or missing ID:', response.data);
        return { success: false, error: response.data?.message || 'SendPulse reported an error or did not return a message ID.' };
      }
    } catch (error) {
      let errorMessage = 'An unknown error occurred while sending email via SendPulse.';
      if (error instanceof AxiosError && error.response) {
        console.error('SendPulse API Error:', error.response.status, error.response.data);
        errorMessage = `SendPulse API Error (${error.response.status}): ${JSON.stringify(error.response.data?.message || error.response.data?.error_description || error.response.data || error.message)}`;
      } else {
        console.error('Error sending email via SendPulse:', error);
        if (error instanceof Error) {
          errorMessage = error.message;
        }
      }
      return { success: false, error: errorMessage };
    }
  }
);

export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;
export type SendEmailOutput = z.infer<typeof SendEmailOutputSchema>;
