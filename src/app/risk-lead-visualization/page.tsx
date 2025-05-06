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
import { Textarea } from "@/components/ui/textarea";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import {useSearchParams} from 'next/navigation';
import { HomeIcon, Loader2, AlertTriangle } from "lucide-react";

// Define data types for chart data
interface CampaignRiskData {
    campaign: string;
    riskScore: number;
}

interface LeadRankingData {
    lead: string;
    ranking: number;
}

interface HistoricalCampaignRiskEntry {
    date: string; // e.g., "Jan '24", "Feb '24"
    averageRisk: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF']; // Example theme colors

function RiskLeadVisualizationContent() {
    // Placeholder data for campaign risk scores and lead prioritization
    const campaignRiskScoresData: CampaignRiskData[] = [
        { campaign: "Campaign Alpha", riskScore: 75 },
        { campaign: "Campaign Beta", riskScore: 30 },
        { campaign: "Campaign Gamma", riskScore: 50 },
        { campaign: "Campaign Delta", riskScore: 90 },
        { campaign: "Campaign Epsilon", riskScore: 60 },
    ];

    const leadPrioritizationRankingsData: LeadRankingData[] = [
        { lead: "Lead Prospect 1", ranking: 85 },
        { lead: "Lead Prospect 2", ranking: 92 },
        { lead: "Lead Prospect 3", ranking: 70 },
        { lead: "Lead Prospect 4", ranking: 60 },
        { lead: "Lead Prospect 5", ranking: 78 },
    ];

    // Simulated historical data for average campaign risk
    const initialHistoricalRiskData: HistoricalCampaignRiskEntry[] = [
        { date: "Jan '24", averageRisk: 65 },
        { date: "Feb '24", averageRisk: 60 },
        { date: "Mar '24", averageRisk: 58 },
        { date: "Apr '24", averageRisk: 62 },
        { date: "May '24", averageRisk: 55 },
        { date: "Jun '24", averageRisk: 50 },
    ];

    const [historicalRiskData, setHistoricalRiskData] = useState<HistoricalCampaignRiskEntry[]>(initialHistoricalRiskData);
    const [selectedDateRange, setSelectedDateRange] = useState<string>("last-6-months");


    const [campaignScore, setCampaignScore] = useState<number | null>(null);
    const [callScript, setCallScript] = useState<string>('');
    const [industry, setIndustry] = useState<string>('Technology'); //Default values
    const [connections, setConnections] = useState<number>(500); //Default values
    const [reportContent, setReportContent] = useState<string | null>(null);
    const [tier, setTier] = useState<'basic' | 'pro' | 'enterprise'>('pro');
    const [messageResponses, setMessageResponses] = useState<string>('Great feedback, interested in learning more.');
    const [campaignHistory, setCampaignHistory] = useState<string>('Launched Q1, good engagement, some drop-off in Q2.');
    const [sentimentScore, setSentimentScore] = useState<number | undefined>(undefined);
    const [trendForecast, setTrendForecast] = useState<string | undefined>(undefined);
    const [suggestCall, setSuggestCall] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const callId = searchParams.get('callId') ?? 'test-call-id-123'; // Default if not present
    const sarvamCallId = searchParams.get('sarvamCallId');
    const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'email'>('linkedin');
    const [isLoadingScore, setIsLoadingScore] = useState(false);
    const [isLoadingScript, setIsLoadingScript] = useState(false);

    const hasHighRiskCampaigns = campaignRiskScoresData.some(c => c.riskScore > 80);


    // Placeholder function to simulate score generation (0-100)
    const generateCampaignScore = async () => {
        setIsLoadingScore(true);
        try {
            const input = {
                responseRates: Math.random() * 0.5 + 0.2, // Simulate 20-70% response rates
                complianceFlags: Math.random() > 0.8 ? 1 : 0, // 20% chance of compliance flag
                campaignName: "Generated Campaign Insights", // Example value
                connections: connections,
                script: callScript || "Default script for scoring.",
                tier: tier,
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

    const generateCallScriptPlaceholder = async () => {
        setIsLoadingScript(true);
        try {
            // In a real app, you might get these from a form or context
            const scriptInput = {
                campaignName: "Dynamic Campaign X",
                productName: "Our Innovative Solution",
                targetAudience: `Professionals in ${industry}`,
                callObjective: "Schedule a brief demo",
                additionalContext: `They have ${connections} connections. Focus on value proposition.`,
                industry: industry,
                connections: connections,
                subscriptionTier: tier,
                usedCallCount: 0, // Example
                leadId: "lead-placeholder-id",
            };
            // const result = await generateAICallScript(scriptInput);
            // setCallScript(result.script);
            // For placeholder:
            await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
            setCallScript(`AI Script: Hello, this is a generated script for ${industry} leads with ~${connections} connections. We'd love to discuss our solution.`);
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


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Campaign Risk Assessment */}
                <Card className="shadow-lg drop-shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Campaign Risk Assessment</CardTitle>
                        <CardDescription>Current risk scores for active campaigns.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    dataKey="riskScore"
                                    isAnimationActive={true}
                                    data={campaignRiskScoresData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="hsl(var(--primary))"
                                    label={({ name, riskScore }) => `${name}: ${riskScore}%`}
                                >
                                    {campaignRiskScoresData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value}%`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        {hasHighRiskCampaigns && (
                            <div className="mt-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                <p className="text-sm font-semibold">High-risk campaigns detected!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Lead Prioritization Ranking */}
                <Card className="shadow-lg drop-shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Lead Prioritization Ranking</CardTitle>
                        <CardDescription>Ranks leads based on their potential score.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={leadPrioritizationRankingsData} layout="vertical" barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="lead" type="category" width={120} />
                                <Tooltip formatter={(value: number) => `${value}/100`} />
                                <Legend />
                                <Bar dataKey="ranking" name="Priority Score" fill="hsl(var(--primary))" radius={[0, 5, 5, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Historical Campaign Risk Trend */}
            <Card className="mb-6 shadow-lg drop-shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">Historical Campaign Risk Trend</CardTitle>
                    <CardDescription>Average campaign risk score over the past months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 max-w-xs">
                        <Label htmlFor="dateRange">Select Date Range (Placeholder)</Label>
                         <Select value={selectedDateRange} onValueChange={setSelectedDateRange} disabled>
                            <SelectTrigger id="dateRange">
                                <SelectValue placeholder="Select Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                                <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={historicalRiskData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value: number) => `${value}%`} />
                            <Legend />
                            <Line type="monotone" dataKey="averageRisk" name="Average Risk" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


             {/* Campaign Score & Insights Section */}
            <Card className="mb-6 shadow-lg drop-shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">Campaign Insights Generation</CardTitle>
                    <CardDescription>Generate a campaign score, report, sentiment analysis, and trend forecast based on current inputs.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
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
                        <div>
                            <Label htmlFor="platform-select">Platform</Label>
                            <Select value={platform} onValueChange={(value) => setPlatform(value as 'linkedin' | 'twitter' | 'email')}>
                                <SelectTrigger id="platform-select">
                                    <SelectValue placeholder="Select Platform"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    <SelectItem value="twitter">Twitter/X</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="messageResponses">Message Responses (for Sentiment)</Label>
                            <Textarea
                                id="messageResponses"
                                value={messageResponses}
                                onChange={(e) => setMessageResponses(e.target.value)}
                                placeholder="Paste message responses here..."
                                rows={3}
                            />
                        </div>
                         <div className="md:col-span-2">
                            <Label htmlFor="campaignHistory">Campaign History (for Trends)</Label>
                            <Textarea
                                id="campaignHistory"
                                value={campaignHistory}
                                onChange={(e) => setCampaignHistory(e.target.value)}
                                placeholder="Summarize campaign history or link data..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <Button onClick={generateCampaignScore} className="w-full md:w-auto" disabled={isLoadingScore}>
                        {isLoadingScore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Campaign Score & Insights
                    </Button>
                    {campaignScore !== null && (
                        <div className="mt-4 space-y-2 p-4 border rounded-md bg-muted/50">
                            <p className="font-semibold">Campaign Score: <span className="text-primary">{campaignScore.toFixed(2)}</span></p>
                            {reportContent && <p className="text-sm text-muted-foreground">Report Content: {reportContent}</p>}
                            {sentimentScore !== undefined && <p className="text-sm text-muted-foreground">Sentiment Score: <span className={sentimentScore > 0.3 ? 'text-green-600' : sentimentScore < -0.3 ? 'text-destructive' : ''}>{sentimentScore.toFixed(2)}</span></p>}
                            {trendForecast && <p className="text-sm text-muted-foreground">Trend Forecast: {trendForecast}</p>}
                            {suggestCall && <p className="font-semibold text-green-600">Suggestion: Consider a follow-up call for this lead!</p>}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Call Script Generation Placeholder */}
            <Card className="shadow-lg drop-shadow-md">
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

