'use server';

import { NextResponse } from 'next/server';
import { generateOutreachSequence, GenerateOutreachSequenceInput, GenerateOutreachSequenceOutput } from '@/ai/flows/generate-outreach-sequence';

export async function POST(request: Request): Promise<NextResponse<GenerateOutreachSequenceOutput>> {
  const body: GenerateOutreachSequenceInput = await request.json();
  const sequence = await generateOutreachSequence(body);
  return NextResponse.json(sequence);
}
