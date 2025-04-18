'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-background border-b shadow-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between py-2">
        <Link href="/" className="font-bold text-xl">ConvoSpan.ai</Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About Us</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Modules <Icons.chevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Outreach</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/campaign/create">Campaign Creation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                  <Link href="/campaign">Campaign Automation</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Compliance</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/compliance/check">Compliance Check</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Calling</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/call/approve">Call Script Approval</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Visualization</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/risk-lead-visualization">Risk & Lead Visualization</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
