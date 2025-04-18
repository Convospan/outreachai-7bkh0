'use server';

import { MetadataRoute } from 'next/server';

export async function GET(): Promise<Response> {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
         <url>
           <loc>https://convospan.ai</loc>
         </url>
         <url>
           <loc>https://convospan.ai/about</loc>
         </url>
         <url>
           <loc>https://convospan.ai/pricing</loc>
         </url>
         <url>
           <loc>https://convospan.ai/campaign/create</loc>
         </url>
         <url>
           <loc>https://convospan.ai/campaign</loc>
         </url>
         <url>
           <loc>https://convospan.ai/compliance/check</loc>
         </url>
         <url>
           <loc>https://convospan.ai/call/approve</loc>
         </url>
         <url>
           <loc>https://convospan.ai/risk-lead-visualization</loc>
         </url>
       </urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}
