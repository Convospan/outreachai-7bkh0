'use server';

import type {Auth} from 'googleapis';
import {google} from 'googleapis';
import type {OAuth2Client} from 'google-auth-library';

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
  // For Google Meet integration
  conferenceData?: {
    createRequest?: {
      requestId: string; // A unique ID for the request
      conferenceSolutionKey?: {type: 'hangoutsMeet'}; // Specify Google Meet
    };
    // Other conferenceData fields might be present in responses
    entryPoints?: {entryPointType?: string; uri?: string; label?: string}[];
    conferenceSolution?: {
      key?: {type?: string};
      name?: string;
      iconUri?: string;
    };
    // ... any other relevant fields from ConferenceData type
  };
  // This field will be populated by Google Calendar in the response
  hangoutLink?: string;
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
  return new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri);
}

/**
 * Asynchronously creates an event in Google Calendar.
 *
 * @param eventDetails The details of the event to create.
 * @param authClient An authorized OAuth2 client.
 * @param addGoogleMeet A boolean indicating whether to add a Google Meet link.
 * @returns A promise that resolves to the created event data or null if failed.
 */
export async function createGoogleCalendarEvent(
  eventDetails: GoogleCalendarEvent,
  authClient: Auth.OAuth2Client,
  addGoogleMeet: boolean
): Promise<google.calendar_v3.Schema$Event | null> {
  try {
    const calendar = google.calendar({version: 'v3', auth: authClient});

    const eventToCreate: google.calendar_v3.Schema$Event = {
      summary: eventDetails.summary,
      description: eventDetails.description,
      start: eventDetails.start,
      end: eventDetails.end,
      attendees: eventDetails.attendees,
      reminders: eventDetails.reminders,
    };

    if (addGoogleMeet) {
      eventToCreate.conferenceData = {
        createRequest: {
          requestId: `convospan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, // Unique request ID
          conferenceSolutionKey: {type: 'hangoutsMeet'},
        },
      };
    }

    const response = await calendar.events.insert({
      calendarId: 'primary', // Use 'primary' for the user's main calendar
      requestBody: eventToCreate,
      conferenceDataVersion: addGoogleMeet ? 1 : 0, // Set to 1 if creating new conference data
    });
    console.log('Google Calendar Event created: ', response.data.htmlLink);
    if (response.data.hangoutLink) {
      console.log('Google Meet link: ', response.data.hangoutLink);
    }
    return response.data;
  } catch (error) {
    console.error('Failed to create Google Calendar event:', error);
    // Log more details from the error if available
    if (error instanceof Error && 'response' in error && (error as any).response?.data?.error) {
        console.error('Google API Error:', (error as any).response.data.error);
    }
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
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    // Add 'https://www.googleapis.com/auth/meetings.space.created' if creating Meet spaces directly,
    // but for attaching to calendar events, 'calendar.events' is usually sufficient.
  ];
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
