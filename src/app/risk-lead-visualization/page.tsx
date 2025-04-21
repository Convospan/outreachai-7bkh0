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
import {generateCallScript} from '@/ai/flows/generate-call-script';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {useSearchParams} from 'next/navigation';

// Define data types for chart data
interface CampaignRiskData {
    campaign: string;
    riskScore: number;
}

interface LeadRankingData {
    lead: string;
    ranking: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Example theme colors

export default function RiskLeadVisualizationPage() {
    // Placeholder data for campaign risk scores and lead prioritization
    const campaignRiskScoresData: CampaignRiskData[] = [
        { campaign: "Campaign A", riskScore: 75 },
        { campaign: "Campaign B", riskScore: 30 },
        { campaign: "Campaign C", riskScore: 50 },
        { campaign: "Campaign D", riskScore: 90 },
    ];

    const leadPrioritizationRankingsData: LeadRankingData[] = [
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
    const [tier, setTier] = useState<'basic' | 'pro' | 'enterprise'>('basic');
    const [messageResponses, setMessageResponses] = useState<string>('');
    const [campaignHistory, setCampaignHistory] = useState<string>('');
    const [sentimentScore, setSentimentScore] = useState<number | undefined>(undefined);
    const [trendForecast, setTrendForecast] = useState<string | undefined>(undefined);
    const searchParams = useSearchParams();
    const callId = searchParams.get('callId') ?? '';


    // Placeholder function to simulate score generation (0-100)
    const generateCampaignScore = async () => {
        try {
            const input = {
                responseRates: Math.random(), // Example value
                complianceFlags: Math.random() > 0.5 ? 0 : 1, // Example value
                campaignName: "Campaign A", // Example value
                connections: connections,
                script: callScript, // Example value
                tier: tier, // Example value
                messageResponses: messageResponses,
                campaignHistory: campaignHistory,
                callId: callId,
            };

            const result: SummarizeOutreachPerformanceOutput = await summarizeOutreachPerformance(input);
            setCampaignScore(result.modelScore);
            setReportContent(result.reportContent);
            setSentimentScore(result.sentimentScore);
            setTrendForecast(result.trendForecast);
        } catch (error: any) {
            console.error('Failed to generate campaign score:', error);
            setCampaignScore(null);
            setReportContent(null);
            setSentimentScore(undefined);
            setTrendForecast(undefined);
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
                        {/* Pie Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    dataKey="riskScore"
                                    isAnimationActive={false}
                                    data={campaignRiskScoresData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {campaignRiskScoresData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid gap-2">
                            <Label htmlFor="tier">Tier</Label>
                            <Select onValueChange={(value) => setTier(value as 'basic' | 'pro' | 'enterprise')}>
                                <SelectTrigger id="tier">
                                    <SelectValue placeholder="Select Tier"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="messageResponses">Message Responses</Label>
                            <Input
                                id="messageResponses"
                                type="text"
                                value={messageResponses}
                                onChange={(e) => setMessageResponses(e.target.value)}
                                placeholder="Enter message responses"
                            />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="campaignHistory">Campaign History</Label>
                            <Input
                                id="campaignHistory"
                                type="text"
                                value={campaignHistory}
                                onChange={(e) => setCampaignHistory(e.target.value)}
                                placeholder="Enter campaign history"
                            />
                        </div>
                        <Button onClick={generateCampaignScore} className="mt-4">
                            Generate Campaign Score
                        </Button>
                        {campaignScore !== null && (
                            <p className="mt-2">Campaign Score: {campaignScore}</p>
                        )}
                         {reportContent !== null && (
                            <p className="mt-2">Report Content: {reportContent}</p>
                        )}
                        {sentimentScore !== undefined && (
                            <p className="mt-2">Sentiment Score: {sentimentScore}</p>
                        )}
                        {trendForecast !== undefined && (
                            <p className="mt-2">Trend Forecast: {trendForecast}</p>
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
                         {/* Bar Chart */}
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={leadPrioritizationRankingsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="lead" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="ranking" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
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
