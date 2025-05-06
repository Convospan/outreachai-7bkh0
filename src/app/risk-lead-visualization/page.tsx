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
import { useState, useEffect, Suspense } from 'react';
import {summarizeOutreachPerformance, SummarizeOutreachPerformanceOutput} from '@/ai/flows/summarize-outreach-performance';
import {generateCallScript as generateAICallScript} from '@/ai/flows/generate-call-script'; // Renamed to avoid conflict
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {useSearchParams} from 'next/navigation';
import { HomeIcon, Loader2 } from "lucide-react";

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

function RiskLeadVisualizationContent() {
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
    const [suggestCall, setSuggestCall] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const callId = searchParams.get('callId') ?? '';
    const sarvamCallId = searchParams.get('sarvamCallId'); // Get Sarvam Call ID
    const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'email'>('linkedin');
    const [isLoadingScore, setIsLoadingScore] = useState(false);
    const [isLoadingScript, setIsLoadingScript] = useState(false);


    // Placeholder function to simulate score generation (0-100)
    const generateCampaignScore = async () => {
        setIsLoadingScore(true);
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
                platform: platform,
            };

            const result: SummarizeOutreachPerformanceOutput = await summarizeOutreachPerformance(input);
            setCampaignScore(result.modelScore);
            setReportContent(result.reportContent);
            setSentimentScore(result.sentimentScore);
            setTrendForecast(result.trendForecast);
            setSuggestCall(result.suggestCall);
        } catch (error: any) {
            console.error('Failed to generate campaign score:', error);
            setCampaignScore(null);
            setReportContent(null);
            setSentimentScore(undefined);
            setTrendForecast(undefined);
            setSuggestCall(false);
        } finally {
            setIsLoadingScore(false);
        }
    };

    // Placeholder function to simulate call script generation
    const generateCallScriptPlaceholder = async () => { // Renamed to avoid conflict if another function is named generateCallScript
        setIsLoadingScript(true);
        try {
            // This would typically call your AI service:
            // const result = await generateAICallScript({ /* ...input based on UI ... */ });
            // setCallScript(result.script);
            // For placeholder:
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            setCallScript(`Placeholder AI-generated script for ${industry} with ${connections} connections.`);
        } catch (error: any) {
            console.error('Failed to generate call script:', error);
            setCallScript('Error generating script.');
        } finally {
            setIsLoadingScript(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-primary text-center">Campaign Risk & Lead Visualization</h1>
            {callId && <p className="text-center text-muted-foreground mb-2">Internal Call ID: {callId}</p>}
            {sarvamCallId && <p className="text-center text-green-600 font-semibold mb-4">Sarvam AI Call ID: {sarvamCallId}</p>}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campaign Risk Assessment */}
                <Card className="shadow-lg drop-shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Campaign Risk Assessment</CardTitle>
                        <CardDescription>Visualizes risk scores for campaigns.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Pie Chart */}
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    dataKey="riskScore"
                                    isAnimationActive={true}
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
                        <div className="space-y-4 mt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="tier">Subscription Tier</Label>
                                <Select value={tier} onValueChange={(value) => setTier(value as 'basic' | 'pro' | 'enterprise')}>
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
                                <Label htmlFor="messageResponses">Message Responses (for Sentiment)</Label>
                                <Textarea
                                    id="messageResponses"
                                    value={messageResponses}
                                    onChange={(e) => setMessageResponses(e.target.value)}
                                    placeholder="Paste message responses here..."
                                />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="campaignHistory">Campaign History (for Trends)</Label>
                                <Textarea
                                    id="campaignHistory"
                                    value={campaignHistory}
                                    onChange={(e) => setCampaignHistory(e.target.value)}
                                    placeholder="Summarize campaign history or link data..."
                                />
                            </div>
                            <Button onClick={generateCampaignScore} className="w-full" disabled={isLoadingScore}>
                                {isLoadingScore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Campaign Score & Insights
                            </Button>
                            {campaignScore !== null && (
                                <p className="mt-2 font-semibold">Campaign Score: <span className="text-primary">{campaignScore.toFixed(2)}</span></p>
                            )}
                             {reportContent !== null && (
                                <p className="mt-2 text-sm">Report Content: {reportContent}</p>
                            )}
                            {sentimentScore !== undefined && (
                                <p className="mt-2 text-sm">Sentiment Score: {sentimentScore.toFixed(2)}</p>
                            )}
                            {trendForecast !== undefined && (
                                <p className="mt-2 text-sm">Trend Forecast: {trendForecast}</p>
                            )}
                            {suggestCall && (
                                <p className="mt-2 font-semibold text-green-600">Suggestion: Consider a follow-up call for this lead!</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Lead Prioritization Ranking */}
                <Card className="shadow-lg drop-shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Lead Prioritization Ranking</CardTitle>
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
            <Card className="mt-6 shadow-lg drop-shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">AI Call Script (Reference)</CardTitle>
                    <CardDescription>Generate or review an AI-powered call script. This is typically done before this stage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="scriptIndustry">Lead Industry</Label>
                            <Input id="scriptIndustry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="E.g. Software" />
                        </div>
                        <div>
                            <Label htmlFor="scriptConnections">Lead Connections</Label>
                            <Input id="scriptConnections" type="number" value={connections} onChange={(e) => setConnections(Number(e.target.value))} placeholder="E.g. 500" />
                        </div>
                    </div>
                    <Button onClick={generateCallScriptPlaceholder} className="w-full md:w-auto" disabled={isLoadingScript}>
                         {isLoadingScript && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate/Refresh Script
                    </Button>
                    {callScript && (
                        <Textarea value={callScript} readOnly rows={6} className="bg-muted/30" />
                    )}
                </CardContent>
            </Card>
            <div className="flex justify-between mt-8">
                <Link href="/call/select-sarvam-model" passHref>
                    <Button variant="outline">Back to AI Model Selection</Button>
                </Link>
                 <Link href="/" passHref>
                    <Button variant="outline"><HomeIcon className="mr-2 h-4 w-4"/>Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}

export default function RiskLeadVisualizationPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-3 text-lg text-muted-foreground">Loading Visualization...</p>
            </div>
        }>
            <RiskLeadVisualizationContent />
        </Suspense>
    )
}
