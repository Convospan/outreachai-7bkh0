'use server';
import {NextRequest, NextResponse} from 'next/server';
import {generateCallScript, GenerateCallScriptInput} from '@/server/generate-call-script'; // Corrected path
import {z} from 'zod';

// Input schema should match GenerateCallScriptInput from the flow
const ApiGenerateCallScriptInputSchema = z.object({
  campaignName: z.string(),
  productName: z.string(),
  targetAudience: z.string(),
  callObjective: z.string(),
  additionalContext: z.string().optional(),
  preferredTone: z.enum(['formal', 'informal', 'professional']).default('professional'),
  industry: z.string(),
  connections: z.number(),
  subscriptionTier: z.enum(['basic', 'pro', 'enterprise']).default('basic'),
  usedCallCount: z.number().default(0),
  leadId: z.string(),
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = ApiGenerateCallScriptInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({error: 'Validation failed', details: validationResult.error.errors}, {status: 400});
    }
    
    // Type assertion for safety after successful validation
    const input = validationResult.data as GenerateCallScriptInput;

    // In a real app, authenticate and authorize the user first.
    const result = await generateCallScript(input);

    if (result.quotaExceeded) {
      return NextResponse.json({error: 'Call quota exceeded'}, {status: 429}); // 429 Too Many Requests
    }

    return NextResponse.json(result, {status: 200});
  } catch (error: any) {
    console.error('Error generating call script via API:', error);
    return NextResponse.json({error: 'Failed to generate call script', details: error.message}, {status: 500});
  }
}
