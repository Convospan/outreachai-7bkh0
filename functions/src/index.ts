// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import puppeteer, { Browser, Page } from "puppeteer"; // Added types for Puppeteer
import axios from "axios"; // For updateFileInRepo (if keeping) and potentially other HTTP requests
import cors from "cors"; // Import cors

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true }); // Allows all origins for simplicity, restrict in production

// --- Puppeteer LinkedIn Automation Function ---
export const automateLinkedInActions = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "1GB",
  })
  .pubsub.schedule("every 10 minutes") // Adjusted schedule for less frequent execution
  .onRun(async (context) => {
    functions.logger.info("Starting automateLinkedInActions function");
    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--no-first-run",
          "--no-sandbox",
          "--no-zygote",
          // "--single-process", // Consider removing if causing issues; often for resource-constrained envs
        ],
      });
      const page: Page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36');

      const usersSnap = await admin.firestore().collection("users").get();
      functions.logger.info(`Found ${usersSnap.docs.length} users to process for LinkedIn automation.`);

      for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;
        functions.logger.info(`Processing user for LinkedIn: ${uid}`);

        const sessionDoc = await admin
          .firestore()
          .doc(`users/${uid}/sessions/linkedin_session`)
          .get();

        if (!sessionDoc.exists || !sessionDoc.data()?.cookies) {
          functions.logger.warn(`No session cookies found for user: ${uid}`);
          continue;
        }
        const cookies = sessionDoc.data()?.cookies;

        if (!Array.isArray(cookies)) {
          functions.logger.warn(`Cookies for user ${uid} are not in the expected array format.`);
          continue;
        }

        const validCookies = cookies.filter(cookie => cookie.name && cookie.value && cookie.domain);
        if (validCookies.length === 0) {
          functions.logger.warn(`No valid cookies with name, value, and domain found for user: ${uid}`);
          continue;
        }

        try {
          await page.setCookie(...validCookies);
          functions.logger.info(`Cookies set for user: ${uid}`);

          await page.goto("https://www.linkedin.com/feed/", { waitUntil: "networkidle2" });
          functions.logger.info(`Navigated to LinkedIn feed for user: ${uid}. Current URL: ${page.url()}`);

          const isLoggedIn = await page.evaluate(() => {
            return !!document.querySelector(".feed-identity-module__actor-meta a[href*='/in/']");
          });

          if (!isLoggedIn) {
            functions.logger.warn(`User ${uid} does not appear to be logged into LinkedIn after setting cookies. Page title: ${await page.title()}`);
            // await page.screenshot({ path: `error_login_${uid}_${Date.now()}.png` }); // For debugging
            continue;
          }
          functions.logger.info(`User ${uid} appears to be logged in to LinkedIn.`);

          const queuedActionsSnap = await admin
            .firestore()
            .collection(`users/${uid}/actions`)
            .where("status", "==", "pending")
            .where("platform", "==", "linkedin")
            .limit(2) // Process fewer actions per run to stay under limits
            .get();

          functions.logger.info(`Found ${queuedActionsSnap.docs.length} pending LinkedIn actions for user: ${uid}`);

          for (const actionDoc of queuedActionsSnap.docs) {
            const action = actionDoc.data();
            functions.logger.info(`Processing LinkedIn action ID: ${actionDoc.id}, Type: ${action.type}`);

            if (action.type === "sendMessage" && action.messageUrl && action.message) {
              try {
                await page.goto(action.messageUrl, { waitUntil: "networkidle2" });
                functions.logger.info(`Navigated to message URL: ${action.messageUrl}`);
                await page.waitForSelector(".msg-form__contenteditable", { timeout: 15000 });
                await page.type(".msg-form__contenteditable", action.message, { delay: 120 });
                await page.waitForSelector(".msg-form__send-button:not([disabled])", { timeout: 7000 });
                await page.click(".msg-form__send-button");
                functions.logger.info(`Message sent for action ID: ${actionDoc.id}`);
                await actionDoc.ref.update({ status: "completed", completedAt: admin.firestore.FieldValue.serverTimestamp() });
              } catch (e: any) {
                functions.logger.error(`Error processing sendMessage action ID ${actionDoc.id} for user ${uid}: ${e.message}`, { error: e });
                await actionDoc.ref.update({ status: "failed", error: e.message, failedAt: admin.firestore.FieldValue.serverTimestamp() });
              }
            }
            // Add other action types like "sendConnectionRequest" here if needed
            await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000)); // 2-5 seconds delay
          }
        } catch (e: any) {
          functions.logger.error(`Error during page operations for user ${uid}: ${e.message}`, { error: e });
        }
      }
    } catch (error: any) {
      functions.logger.error("Error in automateLinkedInActions function: ", error.message, { error });
    } finally {
      if (browser) {
        await browser.close();
        functions.logger.info("Browser closed for LinkedIn automation.");
      }
    }
    functions.logger.info("Finished automateLinkedInActions function successfully.");
    return null;
  });

// --- Function to Generate Custom Token for Chrome Extension Auth ---
exports.getCustomToken = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => { // Wrap with CORS handler
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed. Only POST requests are accepted." });
      return;
    }
    try {
      const { userId } = req.body;

      if (!userId || typeof userId !== 'string') {
        functions.logger.warn("getCustomToken called without a valid userId.", { body: req.body });
        res.status(400).json({ error: "Missing or invalid userId in request body." });
        return;
      }

      // TODO: CRITICAL SECURITY - Add server-side validation here to ensure the request
      // to generate a token for this `userId` is legitimate and authorized.
      // For example, if the Chrome extension passes an ID token from the main web app's
      // Firebase session, verify it here using admin.auth().verifyIdToken(idTokenFromExtension).
      // Only proceed if the token is valid and its uid matches the requested userId or
      // if the calling context has administrative privileges to mint tokens for others.
      // Without this, anyone could request a custom token for any user ID.
      functions.logger.info(`Received request to generate custom token for userId: ${userId}`);

      const customToken = await admin.auth().createCustomToken(userId);
      functions.logger.info(`Successfully generated custom token for userId: ${userId}`);
      res.json({ token: customToken });

    } catch (error: any) {
      functions.logger.error("Error creating custom token:", {
        errorMessage: error.message,
        errorCode: error.code,
        body: req.body, // Be careful logging request body in production if it contains PII
      });
      res.status(500).json({ error: "Failed to create custom token. " + error.message });
    }
  });
});


// --- Placeholder for generatePersonalizedMessage (Illustrative - better as Genkit flow in Next.js) ---
// This function is illustrative. For your Next.js app, it's better to have Genkit flows
// handle AI interactions directly within your Next.js backend/API routes
// or have your Next.js API routes call Genkit flows.
// If you need a callable function for this specifically, ensure API keys are configured for functions.
/*
import { generatePersonalizedMessage as genMessageService } from "../src/services/ai"; // Path might need adjustment

exports.generateMessage = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => { // Wrap with CORS
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    try {
      const { profileData } = req.body;
      if (!profileData) {
        res.status(400).json({ error: "Missing profileData in request body." });
        return;
      }
      // Ensure GOOGLE_GENAI_API_KEY is available to this function's environment if genMessageService uses it directly
      const message = await genMessageService(profileData);
      res.json({ message });
    } catch (error: any) {
      functions.logger.error("Error in generateMessage function:", error);
      res.status(500).json({ error: "Failed to generate message. " + error.message });
    }
  });
});
*/

    