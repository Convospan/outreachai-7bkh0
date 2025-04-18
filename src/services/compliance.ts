'use server';

/**
 * Represents the compliance status.
 */
export interface ComplianceStatus {
  /**
   * The compliance status.
   */
  status: string;
  /**
   * The compliance message.
   */
  message: string;
}

/**
 * Asynchronously checks the compliance status.
 *
 * @param data The data to check.
 * @returns A promise that resolves to a ComplianceStatus object.
 */
export async function checkCompliance(data: any): Promise<ComplianceStatus> {
  // Simulate compliance check
  const { script, consent, tier } = data;

  if (!consent) {
    return {
      status: 'error',
      message: 'Consent is required for GDPR compliance.',
    };
  }

  if (!script) {
        return {
            status: 'error',
            message: 'Script cannot be empty',
        };
  }

  if (tier === 'basic') {
    return {
      status: 'error',
      message: 'Pro or Enterprise tier required for compliance checks.',
    };
  }

  // Basic check for potentially violating terms
  if (script.includes('buy now') || script.includes('limited time offer')) {
    return {
      status: 'warning',
      message: 'Script may violate LinkedIn ToS. Avoid overly promotional content.',
    };
  }

  return {
    status: 'ok',
    message: 'Compliant',
  };
}
