import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Mail, MessageSquare, Shield, User, Workflow, PhoneCall, Link} from 'lucide-react';
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">OutreachAI - Streamline Your Outreach</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* AI Script Generation */}
        <Card>
          <CardHeader>
            <CardTitle>AI Script Generation</CardTitle>
            <CardDescription>
              Generate personalized outreach scripts for LinkedIn, Twitter/X, and email using Gemini 2.0.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <MessageSquare className="h-8 w-8 text-primary"/>
            <div>
              <p className="text-sm">Craft engaging and tailored messages effortlessly.</p>
            </div>
          </CardContent>
        </Card>

        {/* Risk & Lead Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Risk & Lead Visualization</CardTitle>
            <CardDescription>
              Displays campaign risk scores and lead prioritization rankings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <User className="h-8 w-8 text-primary"/>
            <div>
              <p className="text-sm">Quickly assess and focus on high-potential leads.</p>
            </div>
          </CardContent>
        </Card>

        {/* Script Approval Workflow */}
        <Card>
          <CardHeader>
            <CardTitle>Script Approval Workflow</CardTitle>
            <CardDescription>
              Review and approve AI-generated scripts before initiating calls via Twilio.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Workflow className="h-8 w-8 text-primary"/>
            <div>
              <p className="text-sm">Ensure quality and relevance with a streamlined approval process.</p>
            </div>
          </CardContent>
        </Card>

        {/* Real-Time Compliance Check */}
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Compliance Check</CardTitle>
            <CardDescription>
              Performs real-time checks against LinkedIn ToS, GDPR, and other regulations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary"/>
            <div>
              <p className="text-sm">Adhere to regulations before outreach.</p>
            </div>
          </CardContent>
          <CardContent>
               <a href="/compliance/check" className="text-sm text-blue-500 hover:underline">Compliance Check</a>
          </CardContent>
        </Card>

          {/* AI Calling Agent */}
          <Card>
              <CardHeader>
                  <CardTitle>AI Calling Agent</CardTitle>
                  <CardDescription>
                      AI generates and initiates calls, with user review and approval, powered by Dialogflow and Twilio.
                  </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                  <PhoneCall className="h-8 w-8 text-primary"/>
                  <div>
                      <p className="text-sm">Automate voice follow-ups with user-reviewed scripts.</p>
                  </div>
              </CardContent>
          </Card>

        {/* Multi-Platform API Integration */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Platform API Integration</CardTitle>
            <CardDescription>
              Integrates LinkedIn, Twitter/X and Email APIs for fetching profile data and automating outreach sequences.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Mail className="h-8 w-8 text-primary"/>
            <div>
              <p className="text-sm">Personalize interactions across multiple platforms.</p>
            </div>
          </CardContent>
           <CardContent>
               <a href="/auth/linkedin" className="text-sm text-blue-500 hover:underline">LinkedIn OAuth</a>
               <a href="/auth/twitter" className="text-sm text-blue-500 hover:underline">Twitter OAuth</a>
               <a href="/auth/email" className="text-sm text-blue-500 hover:underline">Email OAuth</a>
          </CardContent>
        </Card>

        {/* Placeholders for other features or future cards */}
        <Card>
          <CardHeader>
            <CardTitle>More features coming soon</CardTitle>
            <CardDescription>
              Placeholder card for additional features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Stay tuned for updates and new functionalities!</p>
            <Button>Learn More</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
