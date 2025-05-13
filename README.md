# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables Setup

This project requires certain environment variables to be set up for Firebase integration and other third-party services to function correctly.

1.  **Create a `.env.local` file:**
    In the root directory of your project, create a new file named `.env.local`. This file will store your local environment variables and should **not** be committed to Git.

2.  **Copy from Example:**
    Copy the contents of the template below into your newly created `.env.local` file.

3.  **Populate Variables:**
    Replace the placeholder values in `.env.local` with your actual credentials and API keys.

    ```env
    # Firebase Project Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID" # Optional

    # Firebase Admin SDK (Service Account Key for backend operations)
    # This is a JSON string. For local development, you can paste the entire JSON here.
    # For production, it's highly recommended to set this as a secret in your deployment environment.
    FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "...", ...}'

    # Google GenAI API Key (for Genkit - this is the primary key used by the application)
    GOOGLE_GENAI_API_KEY="YOUR_GOOGLE_GENAI_API_KEY"

    # Additional Gemini API Key (if needed for specific, non-Genkit uses)
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

    # reCAPTCHA Enterprise Site Key (for Firebase App Check - Optional but Recommended)
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY="YOUR_RECAPTCHA_SITE_KEY"

    # LinkedIn OAuth
    NEXT_PUBLIC_LINKEDIN_CLIENT_ID="YOUR_LINKEDIN_CLIENT_ID"
    LINKEDIN_CLIENT_SECRET="YOUR_LINKEDIN_CLIENT_SECRET" # Server-side only
    NEXT_PUBLIC_LINKEDIN_REDIRECT_URI="http://localhost:9003/auth/linkedin/callback" # Update for production

    # Google OAuth (for Google Calendar)
    GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET" # Server-side only
    GOOGLE_CALENDAR_REDIRECT_URI="http://localhost:9003/auth/google-calendar/callback" # Update for production
    
    # Sarvam AI API Key
    SARVAM_API_KEY="YOUR_SARVAM_API_KEY"

    # SendPulse API
    SENDPULSE_API_BASE_URL="https://api.sendpulse.com" # Note: Changed from SENDPULSE_API_URL
    SENDPULSE_CLIENT_ID="YOUR_SENDPULSE_CLIENT_ID"
    SENDPULSE_CLIENT_SECRET="YOUR_SENDPULSE_CLIENT_SECRET"
    DEFAULT_FROM_EMAIL="noreply@yourdomain.com"
    DEFAULT_FROM_NAME="ConvoSpan AI"

    # Application Base URL
    NEXT_PUBLIC_BASE_URL="http://localhost:9003" # Update for production
    ```

4.  **Important Notes:**
    *   Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not store sensitive secrets (like `LINKEDIN_CLIENT_SECRET`, `FIREBASE_SERVICE_ACCOUNT_KEY`, `GEMINI_API_KEY`, `GOOGLE_GENAI_API_KEY`, `GOOGLE_CLIENT_SECRET`, `SARVAM_API_KEY`, `SENDPULSE_CLIENT_SECRET`) with this prefix if they are only needed server-side.
    *   For production deployments, these environment variables must be configured in your hosting provider's settings (e.g., Vercel, Netlify, Firebase Hosting environment configuration).
    *   Ensure your `.gitignore` file includes `.env.local` to prevent committing your local secrets.

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
# Assuming model, X_test, industry, connections are defined
# prob = model.predict_proba(X_test)[0][1] # This line requires a trained model and test data
# campaign_score = prob * 100
# aiplatform.init(project="your-project", location="us-central1")
# genai_model = aiplatform.Model(model_name="gemini-2.0") # Ensure correct model name
# prompt = f"Generate a follow-up call script for {industry} professional with {connections} connections."
# response = genai_model.predict([prompt]).predictions[0]
# script = response.text
# print(f"Campaign Score: {campaign_score}, Script: {script}")
```
