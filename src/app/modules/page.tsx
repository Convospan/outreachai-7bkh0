'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ModulesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/campaign/create" passHref>
          <Button>Campaign Creation</Button>
        </Link>
        <Link href="/campaign" passHref>
          <Button>Campaign Automation</Button>
        </Link>
        <Link href="/compliance/check" passHref>
          <Button>Compliance Check</Button>
        </Link>
        <Link href="/call/approve" passHref>
          <Button>Call Script Approval</Button>
        </Link>
        <Link href="/risk-lead-visualization" passHref>
          <Button>Risk & Lead Visualization</Button>
        </Link>
      </div>
       <footer className="bg-gray-950 text-white py-6 text-center">
          <p className="text-lg">
            © 2025 ConvoSpan.ai |{' '}
            <a href="/contact" className="underline text-primary-orange hover:text-opacity-80 transition duration-300">
              Contact
            </a>
          </p>
        </footer>
    </div>
  );
}
