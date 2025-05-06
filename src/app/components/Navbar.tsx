
'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/pricing", label: "Pricing" },
    { href: "/affiliate", label: "Affiliate" },
    { href: "/linkedin-search", label: "LinkedIn Search" },
  ];

  return (
    <nav className="bg-background border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <div className="font-bold uppercase border-2 border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors duration-300 text-lg tracking-wider">
            CONVOSPAN
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              <Link href={link.href} passHref>
                <Button variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 text-sm font-medium">
                  {link.label}
                </Button>
              </Link>
              {index < navLinks.length -1 && <div className="h-5 w-[1px] bg-border"></div>}
            </React.Fragment>
          ))}
          
          <div className="h-5 w-[1px] bg-border"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 text-sm font-medium">
                Modules <Icons.chevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-[#a9cad4] rounded-md shadow-lg border border-border" sideOffset={5}>
              <DropdownMenuItem asChild>
                <Link href="/campaign/create" className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Campaign Creation Hub</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
               <DropdownMenuItem asChild>
                <Link href="/campaign/create/linkedin-auth" className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Import from LinkedIn</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/campaign/create/upload-csv" className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Upload CSV</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
               <DropdownMenuItem asChild>
                <Link href="/linkedin-search" className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">LinkedIn Prospect Search</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem asChild>
                  <Link href="/campaign" className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Campaign Automation</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                  <Link href="/compliance/check" className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Compliance Check</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                 <Link href="/call/approve" className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Call Script Approval</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/call/select-sarvam-model" className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Select Sarvam AI Model</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/risk-lead-visualization" className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Risk & Lead Visualization</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-b shadow-lg z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                Modules <Icons.chevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-1rem)] bg-[#a9cad4] rounded-md shadow-lg border border-border relative left-1/2 transform -translate-x-1/2" sideOffset={5}>
               <DropdownMenuItem asChild>
                <Link href="/campaign/create" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Campaign Creation Hub</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem asChild>
                <Link href="/campaign/create/linkedin-auth" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Import from LinkedIn</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/campaign/create/upload-csv" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Upload CSV</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild>
                <Link href="/linkedin-search" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">LinkedIn Prospect Search</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem asChild>
                  <Link href="/campaign" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Campaign Automation</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                  <Link href="/compliance/check" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Compliance Check</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                 <Link href="/call/approve" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Call Script Approval</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                 <Link href="/call/select-sarvam-model" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Select Sarvam AI Model</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/risk-lead-visualization" onClick={toggleMobileMenu} className="flex items-center px-3 py-2 text-sm hover:bg-accent/80 rounded-sm">Risk & Lead Visualization</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

