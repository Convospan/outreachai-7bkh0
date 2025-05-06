'use server';

import SarvamAI from 'sarvamai'; // Assuming this is how the SDK is imported

interface InitiateSarvamCallInput {
  phoneNumber: string;
  script: string;
  // any other relevant parameters for Sarvam e.g. callerId
}

interface InitiateSarvamCallOutput {
  callId: string;
  status: 'initiated' | 'failed';
  message?: string;
}

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;

if (!SARVAM_API_KEY) {
  console.error("SARVAM_API_KEY is not set in environment variables.");
}

export async function initiateSarvamCall(input: InitiateSarvamCallInput): Promise<InitiateSarvamCallOutput> {
  if (!SARVAM_API_KEY) {
    return {
      callId: '',
      status: 'failed',
      message: 'Sarvam API Key not configured.',
    };
  }

  // Initialize the client per call for serverless environments,
  // or you might initialize it once globally if appropriate for your setup.
  const sarvamClient = new SarvamAI({ apiKey: SARVAM_API_KEY });

  try {
    // This is a *hypothetical* SDK usage.
    // You MUST consult the `sarvamai` SDK documentation for the correct methods and parameters.
    const response = await sarvamClient.voice.calls.create({
      to: input.phoneNumber,
      // from: 'YOUR_SARVAM_CALLER_ID_OR_NUMBER', // This might be required by Sarvam
      script_text: input.script, // Assuming Sarvam takes script text directly
      // Alternatively, Sarvam might expect a URL to a script or a more structured script object.
      // language: 'en-US', // Specify language if needed
      // voice_id: 'sarvam-default-voice', // Specify voice if needed
    });

    // Adapt this based on the actual response structure from the Sarvam SDK
    if (response && response.id && response.status === 'initiated') { // Example success condition
      return {
        callId: response.id,
        status: 'initiated',
        message: 'Call initiated successfully via Sarvam AI.',
      };
    } else if (response && response.error) { // Example error condition
       console.error('Sarvam AI API Error:', response.error);
       return {
        callId: '',
        status: 'failed',
        message: `Sarvam API Error: ${response.error.message || 'Unknown error'}`,
      };
    }
    else {
      console.error('Unexpected response from Sarvam AI:', response);
      return {
        callId: '',
        status: 'failed',
        message: 'Failed to initiate call. Unexpected response from Sarvam AI.',
      };
    }
  } catch (error: any) {
    console.error('Error initiating Sarvam call:', error);
    return {
      callId: '',
      status: 'failed',
      message: error.message || 'An unknown error occurred while initiating the call.',
    };
  }
}
