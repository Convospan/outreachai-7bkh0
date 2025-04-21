import type { Metadata } from 'next/metadata';
import {siteConfig} from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};
