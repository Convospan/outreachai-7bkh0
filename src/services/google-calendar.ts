
'use server';

// This file is now largely a placeholder as Google Calendar integration has been removed.
// Keeping the file for structure but functionality is commented out or removed.

/**
 * Represents a Google Calendar event.
 */
export interface GoogleCalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: {email: string}[];
  reminders?: {
    useDefault: boolean;
    overrides?: {method: 'email' | 'popup'; minutes: number}[];
  };
  conferenceData?: any;
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
 * This is now a placeholder as the integration is removed.
 */
export async function getGoogleCalendarOAuthConfig(): Promise<GoogleOAuthConfiguration> {
  console.warn('Google Calendar OAuth configuration is requested, but the integration has been removed.');
  return {
    clientId: '', // Removed
    clientSecret: '', // Removed
    redirectUri: '', // Removed
  };
}

// OAuth2Client creation and other functions are removed or commented out.
// import type {Auth} from 'googleapis';
// import {google} from 'googleapis';
// import type {OAuth2Client} from 'google-auth-library';

// export async function createOAuth2Client(): Promise<OAuth2Client | null> {
//   console.warn('createOAuth2Client called, but Google Calendar integration is removed.');
//   return null;
// }

// export async function createGoogleCalendarEvent(
//   eventDetails: GoogleCalendarEvent,
//   authClient: Auth.OAuth2Client | null,
//   addGoogleMeet: boolean
// ): Promise<any | null> {
//   console.warn('createGoogleCalendarEvent called, but Google Calendar integration is removed.');
//   return null;
// }

// export async function generateGoogleCalendarAuthUrl(oauth2Client: Auth.OAuth2Client | null): Promise<string> {
//    console.warn('generateGoogleCalendarAuthUrl called, but Google Calendar integration is removed.');
//   return '#google-calendar-removed';
// }

// export async function getGoogleCalendarTokensFromCode(
//   code: string,
//   oauth2Client: Auth.OAuth2Client | null
// ): Promise<Auth.Credentials | null> {
//   console.warn('getGoogleCalendarTokensFromCode called, but Google Calendar integration is removed.');
//   return null;
// }

console.log("Google Calendar service is currently disabled/removed.");
