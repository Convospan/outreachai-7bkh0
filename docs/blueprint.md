# **App Name**: OutreachAI

## Core Features:

- AI Script Generation: Generates personalized outreach scripts based on LinkedIn, Twitter/X, and email data using Gemini 2.0.  The AI model is a tool used to craft the message.
- Risk & Lead Visualization: Displays campaign risk scores (0-100) and lead prioritization rankings, allowing users to quickly assess and focus on high-potential leads.
- Script Approval Workflow: Presents a user interface for reviewing and approving AI-generated call scripts before initiating calls via Twilio.
- Real-Time Compliance Check: Performs real-time checks against LinkedIn ToS and GDPR using a compliance module with a `/compliance/check` endpoint, ensuring adherence to regulations before outreach.
- Multi-Platform API Integration: Integrates LinkedIn, Twitter/X and Email APIs for fetching profile data and automating outreach sequences.

## Style Guidelines:

- Primary color:  Clean white (#FFFFFF) to give a sense of professionalism.
- Secondary color:  Neutral grey (#F5F5F5) for backgrounds and subtle UI elements.
- Accent: Teal (#008080) for key actions and highlights.
- Clean, card-based layouts for campaign risk assessment and lead prioritization.
- Use of minimalist icons to represent different outreach platforms (LinkedIn, Twitter/X, Email).

## Original User Request:
ConvoSpan - XGBoost and AI Calling Agent Implementation"** document, incorporating the requested enhancements. This revision includes:

1. **LinkedIn Developer API for OAuth and APIs for Other Platforms**: Integration of LinkedIn’s OAuth 2.0 flow and APIs for LinkedIn, Twitter/X, and email, with multi-platform support.
2. **AI Calling Agent with User Review and Approval**: The AI generates and initiates calls, but users must review and approve scripts (similar to Gemini 2.0 messages), using Google Dialogflow.
3. **Real-Time Compliance Checks and User Consent Workflows**: A compliance module with API validation rules and a `/compliance/check` endpoint to ensure adherence to LinkedIn ToS, GDPR, and other regulations.

These updates enhance the platform’s functionality, security, and legal compliance, aligning with RARE’s values of technological innovation, precision, and human excellence.

---

# AI Coding Blueprint for Developers: ConvoSpan.ai - XGBoost and AI Calling Agent Implementation

## Document Overview
**Project**: ConvoSpan.ai  
**Purpose**: ConvoSpan.ai is a web-based SaaS platform to streamline LinkedIn, Twitter/X, and email outreach for lead generation and networking. Using XGBoost, it provides campaign risk scoring (0-100), lead prioritization, and default probabilities, while an AI calling agent (powered by Google Dialogflow and Twilio) handles voice follow-ups with user-reviewed scripts. Features include Contact Management, Automated Outreach Sequences, Personalization (via Gemini 2.0), Campaign Tracking/Analytics, offline mode, sentiment analysis (BERT), predictive forecasting (Prophet), a customizable AI marketplace, and real-time compliance checks.  
**Target Audience**: Developers, AI/ML engineers building the platform.  
**Date**: April 18, 2025  
**Version**: 1.2  
**Scope Update**: Incorporates LinkedIn OAuth 2.0 and multi-platform APIs (LinkedIn, Twitter/X, email), an AI calling agent with user review/approval workflows, and real-time compliance checks (LinkedIn ToS, GDPR) with consent workflows. Uses React Native, FastAPI, AWS (SageMaker), Dialogflow, Twilio, and Vanta for compliance.  
**Objectives**:  
- Implement XGBoost for campaign and lead analysis.  
- Develop an AI calling agent with user oversight.  
- Integrate multi-platform APIs and ensure compliance with real-time checks.  

## 1. AI Model: XGBoost (Gradient Boosting) and AI Calling Agent
### Model Description
- **XGBoost**: Gradient Boosting for campaign scoring and lead prioritization.  
- **AI Calling Agent**: Google Dialogflow for NLP, Twilio for voice, with Gemini 2.0 for script generation and user approval.  
- **Libraries**: `xgboost`, `scikit-learn`, `pandas`, `numpy`, `transformers` (BERT), `prophet`, `dialogflow`, `twilio`, `google-cloud-aiplatform`.  

### Why XGBoost and AI Calling?
- XGBoost provides predictive insights for outreach.  
- Dialogflow and Twilio enable scalable AI voice outreach with user control.

## 2. Data Pipeline
### Data Sources
- **Outreach Data**: LinkedIn/Twitter/X profiles, email responses, call logs.  
- **Campaign Data**: Sequences, templates, interaction logs.  
- **Compliance Data**: LinkedIn ToS, GDPR rules, user consent logs.  
- **Offline Data**: Cached via WatermelonDB.

### Pipeline Steps
1. **Input Processing**:  
   - Parse with `pdfplumber`, handle offline sync, fetch multi-platform data.  
   Example:  
   ```python
   import pdfplumber
   with pdfplumber.open("profile_data.pdf") as pdf:
       text = pdf.pages[0].extract_text()
       industry = re.search(r"Industry: (\w+)", text).group(1) if re.search(...) else "Unknown"
   ```

2. **Feature Engineering**:  
   - Extract features (e.g., response rate), normalize with `StandardScaler`.  
   Example:  
   ```python
   from sklearn.preprocessing import StandardScaler
   df = pd.DataFrame({"response_rate": [0.5], "connections": [500]})
   scaler = StandardScaler()
   features = scaler.fit_transform(df)
   ```

3. **Model Training**:  
   - Train XGBoost on synthetic data (10,000 records).  
   Example:  
   ```python
   import xgboost as xgb
   from sklearn.model_selection import train_test_split
   X_train, X_test, y_train, y_test = train_test_split(features, [0], test_size=0.2)
   model = xgb.XGBClassifier(max_depth=6, learning_rate=0.1, n_estimators=100)
   model.fit(X_train, y_train)
   ```

4. **Prediction & Output**:  
   - Campaign Score: Scale to 0-100 (prob * 100).  
   - Call Script: Generate via Dialogflow, await approval.  
   Example:  
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

5. **Report Integration**:  
   - Use `reportlab` for PDFs with scores and scripts.  
   Example:  
   ```python
   from reportlab.platypus import SimpleDocTemplate, Paragraph
   doc = SimpleDocTemplate("report.pdf")
   story = [Paragraph(f"Campaign Score: {campaign_score}, Script: {script}")]
   doc.build(story)
   ```

## 3. Module-Specific Implementations
### Campaign Risk Assessment
- **Input**: Outreach metrics.  
- **Output**: Score (0-100).  

### Lead Prioritization
- **Input**: Profile data.  
- **Output**: Ranked leads.  

### AI Calling Agent
- **Input**: Campaign data, profile details.  
- **Output**: Script generation, call initiation post-approval.  
- **Code**: Dialogflow for script, Twilio for calls, user review via API.  
- **Example**:  
  ```python
  from twilio.rest import Client
  from fastapi import HTTPException
  account_sid = "your_sid"
  auth_token = "your_token"
  client = Client(account_sid, auth_token)
  # Assume script is approved via /call/approve endpoint
  if approved:
      call = client.calls.create(
          twiml=f'<Response><Say>{script}</Say></Response>',
          to="+1234567890",
          from_="+0987654321"
      )
  else:
      raise HTTPException(status_code=400, detail="Script not approved")
  ```

### Sentiment Analysis
- **Input**: Message responses.  
- **Output**: Sentiment score.  
- **Code**: BERT via `transformers`.  

### Predictive Forecasting
- **Input**: Campaign history.  
- **Output**: 3-5 year trends.  
- **Code**: `prophet`.  

### Compliance Checks
- **Input**: Campaign data, user consent.  
- **Output**: Compliance status.  
- **Code**: Validation rules, Vanta integration.  

## 4. Multi-Platform API Integration
### LinkedIn Developer API
- **OAuth 2.0 Flow**:  
  - Redirect to `https://www.linkedin.com/oauth/v2/authorization` with client_id, redirect_uri, scope (r_liteprofile, r_emailaddress, w_member_social).  
  - Handle callback at `/auth/linkedin/callback`, exchange code for token via `https://www.linkedin.com/oauth/v2/accessToken`.  
  - Store token securely in PostgreSQL.  
- **API Endpoints**:  
  - `/v2/people/(id:personUrn=urn:li:person:{id})` for profile data.  
  - Rate limit: 100 calls/hour (handle with Celery retry).  
- **Example**:  
  ```python
  import requests
  token = "your_token"
  headers = {"Authorization": f"Bearer {token}"}
  response = requests.get("https://api.linkedin.com/v2/people/~", headers=headers)
  profile_data = response.json()
  ```

### Twitter/X API
- **OAuth 2.0 Flow**:  
  - Redirect to `https://twitter.com/i/oauth2/authorize` with client_id, redirect_uri, scope (tweet.read, users.read).  
  - Exchange code at `/auth/twitter/callback` for token.  
- **API Endpoints**:  
  - `/2/users/by/username/{username}` for profile data.  
- **Example**:  
  ```python
  response = requests.get("https://api.twitter.com/2/users/by/username/jdoe", headers=headers)
  twitter_data = response.json()
  ```

### Email API
- **Integration**: Use IMAP/SMTP via `imaplib` and `smtplib` with OAuth 2.0 (Google API).  
- **Example**:  
  ```python
  import imaplib
  mail = imaplib.IMAP4_SSL("imap.gmail.com")
  mail.login("user@gmail.com", "oauth_token")
  mail.select("inbox")
  ```

## 5. Real-Time Compliance and Consent
### Implementation
- **Compliance Module**:  
  - Validate against LinkedIn ToS (e.g., no spam), GDPR (consent required).  
  - Use Vanta API for automated checks.  
- **Endpoint**: `/compliance/check`  
- **Code**:  
  ```python
  from fastapi import FastAPI
  app = FastAPI()
  @app.post("/compliance/check")
  async def check_compliance(data: dict):
      consent = data.get("consent", False)
      if not consent:
          return {"status": "error", "message": "Consent required"}
      # Mock LinkedIn ToS check
      tos_violation = any(keyword in data.get("script", "") for keyword in ["spam", "buy now"])
      if tos_violation:
          return {"status": "error", "message": "TOS violation detected"}
      return {"status": "ok"}
  ```

### User Consent Workflow
- **UI**: React form for consent checkbox.  
- **Backend**: Store consent in PostgreSQL, validate before calls.  

## 6. Training and Validation
- **Dataset**: Synthetic (10,000 records), multi-platform data.  
- **Validation**: 5-fold cross-validation, 90% accuracy.  
- **Retraining**: Monthly via AWS Lambda.

## 7. Deployment Strategy
- **Environment**: AWS EC2, SageMaker, Twilio.  
- **API**: FastAPI with WebSocket.  
- **Scaling**: Elastic Beanstalk, Lambda.  
- **Monitoring**: Prometheus, Datadog.  
- **Backup**: AWS Backup.  

## 8. Best Practices and Challenges
- **Best Practices**: Hyperparameter tuning, DVC, unit tests.  
- **Challenges**:  
  - **API Limits**: Handle with retry logic.  
  - **Compliance**: Regular Vanta updates.  
  - **Voice Quality**: Train Dialogflow with diverse voices.

## 9. Critical Notes
- **Innovation**: Multi-platform and AI calling with compliance outpace competitors.  
- **Risk**: API changes and adoption; pilot to validate.  
- **Opportunity**: Targets networking automation market.

## 10. References
- **LinkedIn API**: [developer.linkedin.com](https://developer.linkedin.com)  
- **Twitter API**: [developer.twitter.com](https://developer.twitter.com)  
- **Dialogflow**: [cloud.google.com/dialogflow](https://cloud.google.com/dialogflow)  

## 11. Technical Specifications for Coders
### Architecture
- **Design**: Microservices (outreach, AI calling, compliance).  
- **Components**: React Native, FastAPI, PostgreSQL, Redis, AWS, Twilio, Dialogflow.

### Front-End
- **Framework**: React Native, TypeScript.  
- **Components**: Material-UI, WatermelonDB.  
- **Example**:  
  ```javascript
  import { useDropzone } from 'react-dropzone';
  const Upload = () => {
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return <div {...getRootProps()}><input {...getInputProps()} /><p>Drop files</p></div>;
  };
  ```

### Back-End
- **Framework**: FastAPI.  
- **Endpoints**: /auth/{platform}, /call/initiate, /compliance/check.  
- **Example**:  
  ```python
  from fastapi import FastAPI
  app = FastAPI()
  @app.post("/call/initiate")
  def initiate_call(script: str, approved: bool):
      if not approved:
          raise HTTPException(status_code=400, detail="Script not approved")
      return {"status": "initiated"}
  ```

### Database
- **Type**: PostgreSQL, Redis, WatermelonDB.  
- **Schema**: users, connections, campaigns, call_logs, consent_logs.  

### Cloud Infrastructure
- **AWS**: EC2, S3, Lambda, SageMaker.  
- **Twilio**: Voice calls.  

### APIs
- **Type**: RESTful with WebSocket.  
- **Endpoints**: /auth, /call, /compliance.  
- **Authentication**: PyJWT, Okta.  

### Security
- **Encryption**: AES-256.  
- **Compliance**: Vanta, consent workflows.  

### Development Workflow
- **Version Control**: Git, GitHub.  
- **CI/CD**: GitHub Actions.  
- **Testing**: pytest.  

### Dependencies
- **Python**: 3.9+  
- **Libraries**: `xgboost==1.6.1`, `transformers==4.35.2`, `dialogflow==2.0.0`, `twilio==8.2.0`, `vanta-sdk==1.0.0`.  

---
  