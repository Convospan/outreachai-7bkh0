
import type { Metadata } from 'next';
import LinkedInProspectSearchClient from '@/components/linkedin/LinkedInProspectSearchClient';

export const metadata: Metadata = {
  title: 'LinkedIn Prospect Search | ConvoSpan.ai',
  description: 'Search and filter LinkedIn prospects to target for your outreach campaigns.',
};

export default function LinkedInProspectSearchPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">
        LinkedIn Prospect Search
      </h1>
      <LinkedInProspectSearchClient />
    </div>
  );
}
