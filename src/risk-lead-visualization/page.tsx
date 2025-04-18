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
import { useState } from 'react';
import {summarizeOutreachPerformance, SummarizeOutreachPerformanceOutput} from '@/ai/flows/summarize-outreach-performance';
import {generateCallScript, GenerateCallScriptOutput} from '@/ai/flows/generate-call-script';


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

    const [campaignScore, setCampaignScore] = useState<number | null>(null);
    const [callScript, setCallScript] = useState<string>('');
    const [industry, setIndustry] = useState<string>('Software'); //Default values
    const [connections, setConnections] = useState<number>(500); //Default values
    const [reportContent, setReportContent] = useState<string | null>(null);
    const [tier, setTier] = useState<string>('Tier 1');


    // Placeholder function to simulate score generation (0-100)
    const generateCampaignScore = async () => {
        try {
            const input = {
                responseRates: Math.random(), // Example value
                sentimentScores: Math.random(), // Example value
                complianceFlags: Math.random() > 0.5 ? 0 : 1, // Example value
                campaignName: "Campaign A", // Example value
                connections: connections,
                script: callScript, // Example value
                tier: tier, // Example value
            };

            const result: SummarizeOutreachPerformanceOutput = await summarizeOutreachPerformance(input);
            setCampaignScore(result.modelScore);
            setReportContent(result.reportContent);
        } catch (error: any) {
            console.error('Failed to generate campaign score:', error);
            setCampaignScore(null);
            setReportContent(null);
        }
    };

    // Placeholder function to simulate call script generation
    const generateCallScript = async () => {
        try {
            const input = {
                campaignName: "Test Campaign",
                productName: "Awesome Product",
                targetAudience: "Tech Professionals",
                callObjective: "Introduce Product",
                additionalContext: "Mention AI ethics",
                industry: industry,
                connections: connections,
            };

            const result: { script: string } = await generateCallScript(input);
            setCallScript(result.script);
        } catch (error: any) {
            console.error('Failed to generate call script:', error);
            setCallScript('Error generating script.');
        }
    };

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
                        <Button onClick={generateCampaignScore} className="mt-4">
                            Generate Campaign Score
                        </Button>
                        {campaignScore !== null && (
                            <p className="mt-2">Campaign Score: {campaignScore}</p>
                        )}
                         {reportContent !== null && (
                            <p className="mt-2">Report Content: {reportContent}</p>
                        )}
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
                    <Button onClick={generateCallScript}>Generate Call Script</Button>
                    {callScript !== '' && (
                        <p className="mt-2">Call Script: {callScript}</p>
                    )}
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
