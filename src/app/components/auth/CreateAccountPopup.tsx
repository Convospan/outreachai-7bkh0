
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useRouter } from 'next/navigation';

// Simple SVG icon for Google
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.79 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

// Simple SVG icon for Microsoft
const MicrosoftIcon = () => (
 <svg className="mr-2 h-5 w-5" viewBox="0 0 23 23" fill="currentColor">
    <path d="M10.56.5H.5v10.06h10.06V.5Z" fill="#f25022"/>
    <path d="M22.5.5h-10.06v10.06H22.5V.5Z" fill="#7fba00"/>
    <path d="M10.56 12H.5v10.06h10.06V12Z" fill="#00a4ef"/>
    <path d="M22.5 12h-10.06v10.06H22.5V12Z" fill="#ffb900"/>
  </svg>
);

// Simple SVG icon for Facebook
const FacebookIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.494v-9.294H9.692v-3.622h3.126V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.324C24 .593 23.407 0 22.676 0Z"/>
  </svg>
);


export function CreateAccountPopup({
  open,
  onOpenChange,
  trigger,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();

  const handleFirebaseAuth = (provider: string) => {
    // Placeholder for Firebase authentication logic
    // e.g., signInWithPopup(auth, new GoogleAuthProvider());
    alert(`Simulating sign-up with ${provider}`);
    if (onOpenChange) {
      onOpenChange(false); // Close the popup
    }
    // Redirect to pricing or dashboard after simulated successful Firebase auth
    router.push('/pricing'); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px] bg-card text-card-foreground p-8 rounded-xl shadow-2xl drop-shadow-xl">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-3xl font-bold text-primary">
            Create your Free Account Today!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            No Credit Card Required!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-center text-lg py-3 border-border hover:bg-accent/50"
            onClick={() => handleFirebaseAuth('Google')}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-center text-lg py-3 border-border hover:bg-accent/50"
            onClick={() => handleFirebaseAuth('Microsoft')}
          >
            <MicrosoftIcon />
            Continue with Microsoft
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-center text-lg py-3 border-border hover:bg-accent/50"
            onClick={() => handleFirebaseAuth('Facebook')}
          >
             <FacebookIcon />
            Continue with Facebook
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-center text-lg py-3 border-border hover:bg-accent/50"
            onClick={() => handleFirebaseAuth('Email')}
          >
            <Mail className="mr-2 h-5 w-5" />
            Continue with Email
          </Button>
        </div>
        <DialogFooter className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            If you continue, you agree to our{' '}
            <Link href="/terms-of-service" className="underline hover:text-primary">
              Terms of Service
            </Link>
            . If you sign up, you will join our Community Program and you agree to our{' '}
            <Link href="/community-terms" className="underline hover:text-primary">
              Community Program Terms
            </Link>
            .
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            View our{' '}
            <Link href="/privacy-policy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

