'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-background border-b shadow-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between py-2">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="ConvoSpan Logo"
            width={150}
            height={30}
            className="mr-2"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" >Home</Link>
          <div className="h-5 w-[1px] bg-border mx-1"></div>
          <Link href="/about" >About Us</Link>
          <div className="h-5 w-[1px] bg-border mx-1"></div>
          <Link href="/pricing">Pricing</Link>
          <div className="h-5 w-[1px] bg-border mx-1"></div>
           <Link href="/usecases">Use Cases</Link>
          <div className="h-5 w-[1px] bg-border mx-1"></div>
           <Link href="/affiliate">Affiliate</Link>
          <div className="h-5 w-[1px] bg-border mx-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Modules <Icons.chevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/campaign/create">Campaign Creation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                  <Link href="/campaign">Campaign Automation</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                  <Link href="/compliance/check">Compliance Check</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                 <Link href="/call/approve">Call Script Approval</Link>
              </DropdownMenuItem>
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

