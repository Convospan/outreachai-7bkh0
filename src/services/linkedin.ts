// src/services/linkedin.ts
/**
 * Represents a LinkedIn profile.
 * This interface defines the structure for profile data, which will now be
 * primarily collected via the Chrome extension.
 */
export interface LinkedInProfile {
  id: string;
  headline: string;
  profileUrl: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  profilePictureUrl?: string | null;
  company?: string | null;
  title?: string | null;
  // Additional fields that might be scraped by the extension
  summary?: string;
  experience?: Array<{ title?: string; companyName?: string; duration?: string; description?: string }>;
  education?: Array<{ schoolName?: string; degree?: string; fieldOfStudy?: string; duration?: string }>;
  skills?: string[];
}

// OAuth configuration is no longer needed as direct API auth from web app is removed.
// The Chrome extension will handle its own authentication or leverage backend custom tokens.

// Direct API call functions for profile fetching are removed.
// Profile data will be sent from the Chrome extension to backend API endpoints.
// (e.g., /api/linkedin/store-profile)

// Direct API call functions for messaging are removed.
// LinkedIn actions (sending messages, connection requests) will be handled by the Chrome extension's
// UI automation capabilities or by a backend automation service like the Puppeteer function
// triggered by user actions in ConvoSpan AI, not direct API calls from this service file.

console.log("LinkedIn service layer: Now primarily relies on data submitted by the Chrome extension.");
console.log("Direct LinkedIn API calls for profile fetching and messaging have been removed from this service.");

// Placeholder for any utility functions related to LinkedIn data processing if needed in the backend,
// but not for direct API interaction.
// For example, you might have functions here to validate or sanitize LinkedIn profile data
// received from the extension before storing it.
export async function processLinkedInData(data: any): Promise<any> {
  // Example: Basic validation or transformation
  console.log("Processing LinkedIn data received from extension:", data);
  // Add any necessary processing logic here
  return data;
}
