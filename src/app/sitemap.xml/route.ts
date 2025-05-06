
'use server';

import { MetadataRoute } from 'next/server';

export async function GET(): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://convospan.ai';
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
         <url>
           <loc>${baseUrl}</loc>
         </url>
         <url>
           <loc>${baseUrl}/about</loc>
         </url>
         <url>
           <loc>${baseUrl}/pricing</loc>
         </url>
         <url>
           <loc>${baseUrl}/campaign/create</loc>
         </url>
         <url>
           <loc>${baseUrl}/campaign/create/linkedin-auth</loc>
         </url>
         <url>
           <loc>${baseUrl}/campaign/create/upload-csv</loc>
         </url>
         <url>
           <loc>${baseUrl}/linkedin-search</loc>
         </url>
         <url>
           <loc>${baseUrl}/campaign</loc>
         </url>
         <url>
           <loc>${baseUrl}/compliance/check</loc>
         </url>
         <url>
           <loc>${baseUrl}/call/approve</loc>
         </url>
         <url>
           <loc>${baseUrl}/risk-lead-visualization</loc>
         </url>
         <url>
           <loc>${baseUrl}/contact</loc>
         </url>
         <url>
           <loc>${baseUrl}/terms-of-service</loc>
         </url>
         <url>
           <loc>${baseUrl}/community-terms</loc>
         </url>
         <url>
           <loc>${baseUrl}/privacy-policy</loc>
         </url>
       </urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}
