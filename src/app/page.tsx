'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import GoogleSignInButton from "@/app/GoogleSignInButton";
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '@/firebase';

export default function Dashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });

        return () => unsubscribe();
    }, [router]);

    if (!user) {
        return (
            <div
                className="min-h-screen bg-background text-foreground flex items-center justify-center py-24"
            >
                <div>
                    <h1 className="text-4xl font-bold text-center mb-8">ConvoSpan.ai</h1>
                    <GoogleSignInButton />
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-background text-foreground flex items-center justify-center py-24"
        >
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-center mb-8">ConvoSpan.ai Dashboard</h1>
                <GoogleSignInButton />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border shadow-md p-6 bg-card">
                        <h2 className="text-xl font-semibold text-primary mb-2">Active Campaigns</h2>
                        <p className="text-base mb-4">3 Running | 5 Scheduled</p>
                        <Button onClick={() => router.push('/campaign/create')}>
                            Start Campaign
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
