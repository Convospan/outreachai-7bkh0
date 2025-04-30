import type { Metadata } from 'next/metadata';
import {siteConfig} from "@/config/site";

// Moved metadata definition here
export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};