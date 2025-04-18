"use client";

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function CallScriptApprovalPage() {
    const [script, setScript] = useState('This is a placeholder for the AI-generated call script.');
    const [approved, setApproved] = useState(false);

    const handleApproveScript = () => {
        setApproved(true);
        toast({
            title: "Script Approved",
            description: "The call script has been approved and is ready to be used.",
        });
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Call Script Approval</CardTitle>
                    <CardDescription>Review and approve the AI-generated call script before initiating the call.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="script">Call Script</Label>
                        <Textarea
                            id="script"
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            placeholder="AI-generated call script will appear here"
                            readOnly={approved}
                        />
                    </div>
                    <Button onClick={handleApproveScript} disabled={approved}>
                        {approved ? 'Approved' : 'Approve Script'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

    