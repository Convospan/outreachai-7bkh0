"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function RiskLeadVisualizationPage() {
    // Placeholder data for campaign risk scores and lead prioritization
    const campaignRiskScores = [
        { campaign: "Campaign A", riskScore: 75 },
        { campaign: "Campaign B", riskScore: 30 },
        { campaign: "Campaign C", riskScore: 50 },
        { campaign: "Campaign D", riskScore: 90 },
    ];

    const leadPrioritizationRankings = [
        { lead: "Lead 1", ranking: 1 },
        { lead: "Lead 2", ranking: 2 },
        { lead: "Lead 3", ranking: 3 },
        { lead: "Lead 4", ranking: 4 },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Risk & Lead Visualization</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campaign Risk Assessment */}
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Risk Assessment</CardTitle>
                        <CardDescription>Displays risk scores for each campaign.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {campaignRiskScores.map((item, index) => (
                                <li key={index} className="flex justify-between py-2">
                                    <span>{item.campaign}</span>
                                    <span>{item.riskScore}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Lead Prioritization Ranking */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lead Prioritization Ranking</CardTitle>
                        <CardDescription>Ranks leads based on their potential.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {leadPrioritizationRankings.map((item, index) => (
                                <li key={index} className="flex justify-between py-2">
                                    <span>{item.lead}</span>
                                    <span>{item.ranking}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Call Script Generation Placeholder */}
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Call Script Generation</CardTitle>
                    <CardDescription>Generate a call script using Dialogflow and Gemini 2.0.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>This section is a placeholder for integrating Dialogflow and Gemini 2.0 to generate call scripts.
                        The AI will generate and initiate calls, with user review and approval.
                    </p>
                    <Button>Generate Call Script</Button>
                </CardContent>
            </Card>
             <div className="flex justify-between mt-4">
                <Link href="/call/approve" passHref>
                    <Button variant="outline">Back to Call Approval</Button>
                </Link>
            </div>
        </div>
    );
}
