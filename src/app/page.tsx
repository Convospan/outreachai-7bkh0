'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen bg-background text-foreground flex items-center justify-center py-24"
      style={{ backgroundImage: `url('/dashboard_background.png')`, backgroundSize: 'cover' }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="relative flex justify-center">
          <div className="absolute -inset-1 rounded-full blur-md opacity-75 bg-gradient-to-r from-[var(--gradient-color-1)] to-[var(--gradient-color-2)]"></div>
          <h1 className="text-4xl font-bold text-center mb-8 relative z-10">ConvoSpan.ai Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-opacity-10 bg-card backdrop-blur-md border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">Active Campaigns</h2>
            <p className="text-base mb-4">3 Running | 5 Scheduled</p>
            <Button onClick={() => router.push('/campaign/create')}>
              Start Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
