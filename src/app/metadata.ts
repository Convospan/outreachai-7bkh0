// import type { Metadata } from 'next/metadata'; // Temporarily removed
import {siteConfig} from "@/config/site";

// Moved metadata definition here
export const metadata: any = { // Temporarily typed as any
  title: siteConfig.name,
  description: siteConfig.description,
};
