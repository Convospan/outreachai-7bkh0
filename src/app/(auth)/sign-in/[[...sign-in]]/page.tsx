// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
"use client";
import { useEffect, useState } from "react"; // Added useState
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { app } from "@/lib/firebase"; // Import the initialized Firebase app

export default function SignInPage() { // Renamed component to follow convention
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get auth instance once app is available
  const [auth, setAuth] = useState<any>(null); // Use 'any' for auth type, or import 'Auth' from 'firebase/auth'
  useEffect(() => {
    if (app) {
      setAuth(getAuth(app));
    }
  }, []);


  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) {
      toast({
        title: "Authentication Error",
        description: "Firebase Auth is not initialized yet. Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Signed In Successfully!",
        description: "Redirecting to your dashboard...",
      });
      router.push("/"); // Redirect to home/dashboard
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast({
        title: "Sign-In Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-xl drop-shadow-lg">
        <h1 className="text-2xl font-bold text-center text-card-foreground">Sign In to ConvoSpan AI</h1>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="font-medium text-primary hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
