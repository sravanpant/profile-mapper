import { NextResponse } from 'next/server';
import { Profile } from '@/types/profile';

export async function GET() {
  // Mock data - replace with actual database fetch
  const profiles: Profile[] = [
    // Add profile data here
  ];

  return NextResponse.json(profiles);
}