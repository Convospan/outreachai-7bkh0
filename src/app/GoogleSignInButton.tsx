'use client';

import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';

export default function GoogleSignInButton() {
  const {toast} = useToast();

  const signIn = async () => {
        toast({
          title: 'Success',
          description: 'Signed In Successfully!',
        });
  };

  const signOut = async () => {
        toast({
          title: 'Signed Out',
          description: 'Signed out Successfully!',
        });
  };

  return (
    <div>
          <Button variant="outline" onClick={signOut}>
          Continue
        </Button>
    </div>
  );
}

