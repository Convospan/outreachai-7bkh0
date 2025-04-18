# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Plan Breakdown (INR):

**Connect & Explore (Free):**

*   LinkedIn Connection: Connect 1 LinkedIn profile.
*   Limited LinkedIn Outreach: Up to 50 connection requests and 15 direct messages per month.
*   Basic Physical Outreach Requests: Up to 5 physical outreach requests per month.
*   Standard Record Keeping: Access to basic history of digital and physical outreach (last 30 days).
*   Limitations: ConvoSpan branding on some communications, standard support.

**Engage & Grow (INR 99/month):**

*   LinkedIn Connection: Connect 1 LinkedIn profile.
*   Enhanced LinkedIn Outreach: Up to 250 connection requests and 75 direct messages per month.
*   Expanded Physical Outreach: Up to 25 physical outreach requests per month.
*   Advanced LinkedIn Features: Basic message templates.
*   Extended Record Keeping: Access to outreach history for the last 90 days.
*   Support: Priority email support.

**Outreach Pro (INR 299/month):**

*   LinkedIn Connection: Connect up to 3 LinkedIn profiles.
*   Advanced LinkedIn Outreach: Up to 1000 connection requests and 300 direct messages per month. Automated follow-ups (up to 2 steps).
*   Comprehensive Physical Outreach: Up to 100 physical outreach requests per month with basic team assignment features (up to 3 team members).
*   Advanced LinkedIn Features: Personalized message templates, advanced filtering.
*   Detailed Analytics & Reporting: Basic outreach performance metrics.
*   Extended Record Keeping: Full history of digital and physical outreach.
*   Support: Priority chat and email support.

**Scale & Impact (INR 599/month):**

*   LinkedIn Connection: Connect up to 5 LinkedIn profiles.
*   Unlimited LinkedIn Outreach: Unlimited connection requests and direct messages (within LinkedIn's fair usage policy). Advanced automation workflows.
*   Unlimited Physical Outreach: Unlimited physical outreach requests with advanced team collaboration (up to 10 team members), role-based access, and custom status tracking.
*   Advanced LinkedIn Features: All features included.
*   Comprehensive Analytics & Reporting: Detailed insights into all outreach activities, team performance, and conversion metrics. CRM integration (basic).
*   Priority Support: Dedicated account manager and 24/7 support.
*   White-labeling options (limited).

Feature Engineering:
- Extract features (e.g., response rate), normalize with `StandardScaler`.
Example:
```python
from sklearn.preprocessing import StandardScaler
df = pd.DataFrame({"response_rate": [0.5], "connections": [500]})
scaler = StandardScaler()
features = scaler.fit_transform(df)
```

```python
from google.cloud import dialogflow_v2 as dialogflow
from google.cloud import aiplatform
prob = model.predict_proba(X_test)[0][1]
campaign_score = prob * 100
aiplatform.init(project="your-project", location="us-central1")
model = aiplatform.Model(model_name="gemini-2.0")
prompt = f"Generate a follow-up call script for {industry} professional with {connections} connections."
response = model.predict([prompt]).predictions[0]
script = response.text
print(f"Campaign Score: {campaign_score}, Script: {script}")
```

```

```
 </content>
 </change>
  <change>
    <file>components.json</file>
    <description>The request is not clear on where the logos need to be placed and how the app needs to be changed.</description>
   <content><![CDATA[{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
