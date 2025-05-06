'use server';
import {NextRequest, NextResponse} from 'next/server';
import {checkCompliance as performComplianceCheck} from '@/services/compliance'; // Renamed to avoid conflict
import {z} from 'zod';

const ComplianceCheckSchema = z.object({
  script: z.string(),
  consent: z.boolean(),
  tier: z.enum(['basic', 'pro', 'enterprise']), // Assuming these are the tiers
  // Add other relevant data for compliance check if needed
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = ComplianceCheckSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({error: 'Validation failed', details: validationResult.error.errors}, {status: 400});
    }

    // In a real app, authenticate and authorize the user first.
    const complianceStatus = await performComplianceCheck(validationResult.data);

    return NextResponse.json(complianceStatus, {status: 200});
  } catch (error: any) {
    console.error('Error performing compliance check:', error);
    return NextResponse.json({error: 'Compliance check failed', details: error.message}, {status: 500});
  }
}
