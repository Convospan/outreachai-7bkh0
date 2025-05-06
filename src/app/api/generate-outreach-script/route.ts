'use server';
import {NextRequest, NextResponse} from 'next/server';
import {generateOutreachScript, GenerateOutreachScriptInput} from '@/ai/flows/generate-outreach-script';
import {z} from 'zod';

// Input schema should match GenerateOutreachScriptInput from the flow
const ApiGenerateOutreachScriptInputSchema = z.object({
  platform: z.enum(['linkedin', 'twitter', 'email', 'whatsapp']),
  linkedinProfile: z.optional(z.object({
    id: z.string(),
    headline: z.string(),
    profileUrl: z.string(),
  })),
  twitterProfile: z.optional(z.object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
  })),
  emailProfile: z.optional(z.object({
    email: z.string(),
    provider: z.string(),
  })),
  additionalContext: z.string(),
  includeCallToAction: z.boolean().default(true),
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = ApiGenerateOutreachScriptInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({error: 'Validation failed', details: validationResult.error.errors}, {status: 400});
    }
    
    const input = validationResult.data as GenerateOutreachScriptInput;

    // In a real app, authenticate and authorize the user first.
    const result = await generateOutreachScript(input);

    return NextResponse.json(result, {status: 200});
  } catch (error: any) {
    console.error('Error generating outreach script via API:', error);
    return NextResponse.json({error: 'Failed to generate outreach script', details: error.message}, {status: 500});
  }
}
