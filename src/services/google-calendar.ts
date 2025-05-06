'use server';

import {google, Auth} from 'googleapis';
import {OAuth2Client} from 'google-auth-library';

/**
 * Represents a Google Calendar event.
 */
export interface GoogleCalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string; // ISO 8601 format, e.g., '2024-05-15T09:00:00-07:00'
    timeZone?: string; // E.g., 'America/Los_Angeles'
  };
  end: {
    dateTime: string; // ISO 8601 format
    timeZone?: string;
  };
  attendees?: {email: string}[];
  reminders?: {
    useDefault: boolean;
    overrides?: {method: 'email' | 'popup'; minutes: number}[];
  };
}

/**
 * Interface for Google OAuth configuration.
 */
export interface GoogleOAuthConfiguration {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

/**
 * Returns Google OAuth configuration.
 * Retrieves credentials from environment variables.
 */
export async function getGoogleCalendarOAuthConfig(): Promise<GoogleOAuthConfiguration> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Missing Google OAuth credentials. Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALENDAR_REDIRECT_URI are set in environment variables.'
    );
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

/**
 * Creates an OAuth2 client for Google Calendar API.
 */
export async function createOAuth2Client(): Promise<OAuth2Client> {
  const config = await getGoogleCalendarOAuthConfig();
  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );
}

/**
 * Asynchronously creates an event in Google Calendar.
 *
 * @param eventDetails The details of the event to create.
 * @param authClient An authorized OAuth2 client.
 * @returns A promise that resolves to the created event data or null if failed.
 */
export async function createGoogleCalendarEvent(
  eventDetails: GoogleCalendarEvent,
  authClient: Auth.OAuth2Client
): Promise<any | null> {
  try {
    const calendar = google.calendar({version: 'v3', auth: authClient});
    const response = await calendar.events.insert({
      calendarId: 'primary', // Use 'primary' for the user's main calendar
      requestBody: eventDetails,
    });
    console.log('Google Calendar Event created: ', response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error('Failed to create Google Calendar event:', error);
    return null;
  }
}

/**
 * Generates a Google Calendar authorization URL.
 *
 * @param oauth2Client The OAuth2 client.
 * @returns The authorization URL.
 */
export function generateGoogleCalendarAuthUrl(oauth2Client: Auth.OAuth2Client): string {
  const scopes = ['https://www.googleapis.com/auth/calendar.events'];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'offline' to get a refresh token
    scope: scopes,
  });
}

/**
 * Exchanges an authorization code for tokens.
 *
 * @param code The authorization code.
 * @param oauth2Client The OAuth2 client.
 * @returns A promise that resolves to the tokens or null if failed.
 */
export async function getGoogleCalendarTokensFromCode(
  code: string,
  oauth2Client: Auth.OAuth2Client
): Promise<Auth.Credentials | null> {
  try {
    const {tokens} = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log('Google Calendar tokens obtained:', tokens);
    return tokens;
  } catch (error) {
    console.error('Error retrieving Google Calendar access token:', error);
    return null;
  }
}
