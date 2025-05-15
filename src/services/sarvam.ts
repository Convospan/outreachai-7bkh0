
'use server';

import SarvamAI from 'sarvamai'; // Assuming this is how the SDK is imported

interface InitiateSarvamCallInput {
  phoneNumber: string; // Target phone number
  script: string;      // The call script
  modelId?: string;     // Optional: Specific Sarvam voice model ID
  callerId?: string;    // Optional: The phone number to display as caller ID
  // any other relevant parameters for Sarvam e.g. custom metadata
  customData?: Record<string, any>;
}

interface InitiateSarvamCallOutput {
  callId?: string;
  status: 'initiated' | 'failed' | 'queued'; // Added 'queued' as a possible status
  message?: string;
  details?: any; // For any additional details from Sarvam API
}

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;

export async function initiateSarvamCall(input: InitiateSarvamCallInput): Promise<InitiateSarvamCallOutput> {
  if (!SARVAM_API_KEY) {
    console.error("SARVAM_API_KEY is not set in environment variables.");
    return {
      status: 'failed',
      message: 'Sarvam API Key not configured in the server environment.',
    };
  }
  if (!input.phoneNumber || !input.script) {
    return {
        status: 'failed',
        message: 'Missing required fields: phoneNumber and script are required for Sarvam call.',
    };
  }

  const sarvamClient = new SarvamAI({ apiKey: SARVAM_API_KEY });

  try {
    // Consult the `sarvamai` SDK documentation for the correct methods and parameters.
    // This is a hypothetical SDK usage structure.
    const callParams: any = {
      to: input.phoneNumber,
      script_text: input.script,
      // model_id: input.modelId || 'sarvam-default-voice', // Example default, if Sarvam has one
      // from: input.callerId || process.env.DEFAULT_SARVAM_CALLER_ID, // Your configured Sarvam caller ID
      // custom_data: input.customData, // For passing along campaign_id, lead_id etc.
    };
    if (input.modelId) {
        callParams.model_id = input.modelId;
    }
    if (input.callerId) {
        callParams.from = input.callerId;
    }
     if (input.customData) {
        callParams.custom_data = input.customData;
    }


    // Assuming the SDK method is something like this:
    const response = await sarvamClient.voice.calls.create(callParams);

    // Adapt this based on the actual response structure from the Sarvam SDK
    if (response && response.call_id && (response.status === 'initiated' || response.status === 'queued' || response.status === 'success')) {
      return {
        callId: response.call_id,
        status: response.status as 'initiated' | 'queued', // Cast to known success statuses
        message: `Call ${response.status} successfully via Sarvam AI. Call ID: ${response.call_id}`,
        details: response,
      };
    } else if (response && response.error) {
       console.error('Sarvam AI API Error:', response.error);
       return {
        status: 'failed',
        message: `Sarvam API Error: ${response.error.message || 'Unknown Sarvam API error'}`,
        details: response.error,
      };
    } else {
      console.error('Unexpected or failed response from Sarvam AI:', response);
      return {
        status: 'failed',
        message: 'Failed to initiate call. Unexpected response from Sarvam AI.',
        details: response,
      };
    }
  } catch (error: any) {
    console.error('Error initiating Sarvam call with SDK:', error);
    let errorMessage = 'An unknown error occurred while initiating the call via Sarvam SDK.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = `Sarvam SDK Error: ${error.response.data.message}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      status: 'failed',
      message: errorMessage,
      details: error,
    };
  }
}

    