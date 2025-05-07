/**
 * Represents an email profile.
 * This interface might still be useful for storing email related data of prospects.
 */
export interface EmailProfile {
  /**
   * The email address.
   */
  email: string;
  /**
   * The email provider (e.g., gmail, outlook).
   * This might be less relevant if all sending is through SendPulse.
   */
  provider?: string;
}

/**
 * Asynchronously retrieves an email profile by email address.
 * This function is a placeholder and might not be needed if SendPulse handles all profile data.
 *
 * @param email The email address.
 * @returns A promise that resolves to an EmailProfile object.
 */
export async function getEmailProfile(email: string): Promise<EmailProfile> {
  // Placeholder, actual implementation would depend on data sources.
  console.warn("getEmailProfile is a placeholder function.");
  return {
    email: email,
    provider: email.split('@')[1]?.split('.')[0] || 'unknown', // Basic provider extraction
  };
}

/**
 * Interface for OAuth configuration.
 * This is generally for services like Gmail/Outlook direct integration.
 * For SendPulse, API Key/Secret is used.
 */
export interface OAuthConfiguration {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

/**
 * Returns OAuth configuration for direct email provider integration (e.g., Gmail).
 * Note: ConvoSpan now primarily uses SendPulse for sending emails via API.
 */
export async function getEmailOAuthConfig(): Promise<OAuthConfiguration> {
  console.warn("getEmailOAuthConfig is for direct provider OAuth, not SendPulse API key/secret method.");
  // Placeholder values, not used for SendPulse API key/secret method.
  return {
    clientId: process.env.GENERIC_EMAIL_CLIENT_ID || 'your_client_id',
    clientSecret: process.env.GENERIC_EMAIL_CLIENT_SECRET || 'your_client_secret',
    redirectUri: process.env.GENERIC_EMAIL_REDIRECT_URI || 'your_redirect_uri',
  };
}

// The IMAP/SMTP integration logic previously here is now superseded
// by the SendPulse API integration handled via the Genkit tool `sendEmailWithSendPulse`.
// Direct IMAP/SMTP connections are complex to manage securely and reliably
// for deliverability, so using a dedicated email service provider like SendPulse is preferred.

console.log("Email service configured to use SendPulse via Genkit tool for sending.");
