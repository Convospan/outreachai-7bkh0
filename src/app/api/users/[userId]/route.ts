import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId; // Access the dynamic userId from params
  // Add your logic here (e.g., fetch user data from a database)
  // For now, just returning the userId
  return NextResponse.json({ userId });
}
