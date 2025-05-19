// functions/src/index.ts
import * as functions from "firebase-functions";
import *import { logger } from "firebase-functions"; // Import logger for better logging
import * as admin from "firebase-admin";
import puppeteer, { Browser, Page } from "puppeteer"; // Added types

admin.initializeApp();

// HTTPS Callable Function to update a file in the GitHub repository (REMOVED as per new content)
// export const updateFileInRepo = functions.https.onCall(async (data, context) => { ... });


// Scheduled function to automate LinkedIn actions using Puppeteer
export const automateLinkedInActions = functions
  .runWith({
    timeoutSeconds: 300, // Increased timeout for browser operations
    memory: "1GB", // Increased memory for Puppeteer
  })
  .pubsub.schedule("every 5 minutes")
  .onRun(async (context) => {
    logger.info("Starting automateLinkedInActions function");
    let browser: Browser | null = null; // Declare browser outside try/catch for finally block

    try {
      // Launch Puppeteer.
      // In a real Cloud Functions environment, you might need to configure args for no-sandbox
      // if running in a restricted environment.
      browser = await puppeteer.launch({
        headless: true, // Ensure it runs headless
        args: [
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--no-first-run",
          "--no-sandbox",
          "--no-zygote",
          "--single-process",
        ],
      });
      const page: Page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36');


      const usersSnap = await admin.firestore().collection("users").get();
      logger.info(`Found ${usersSnap.docs.length} users to process.`);

      for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;
        logger.info(`Processing user: ${uid}`);

        const sessionDoc = await admin
          .firestore()
          .doc(`users/${uid}/sessions/linkedin_session`) // Assuming a specific doc for linkedin session
          .get();

        if (!sessionDoc.exists || !sessionDoc.data()?.cookies) {
          logger.warn(`No session cookies found for user: ${uid}`);
          continue; // Skip this user if no cookies
        }
        const cookies = sessionDoc.data()?.cookies;

        if (!Array.isArray(cookies)) {
            logger.warn(`Cookies for user ${uid} are not in the expected array format.`);
            continue;
        }

        // Ensure cookies have required fields (name, value, domain)
        const validCookies = cookies.filter(cookie => cookie.name && cookie.value && cookie.domain);
        if (validCookies.length === 0) {
            logger.warn(`No valid cookies with name, value, and domain found for user: ${uid}`);
            continue;
        }


        try {
            await page.setCookie(...validCookies);
            logger.info(`Cookies set for user: ${uid}`);

            await page.goto("https://www.linkedin.com/feed/", { waitUntil: "networkidle2" });
            logger.info(`Navigated to LinkedIn feed for user: ${uid}. Current URL: ${page.url()}`);

            // Check if login was successful (e.g., by looking for a feed element or profile name)
            // This is a basic check, LinkedIn might have more robust ways to detect non-interactive sessions
            const isLoggedIn = await page.evaluate(() => {
                return !!document.querySelector(".feed-identity-module__actor-meta a[href*='/in/']"); // Example selector for profile link
            });

            if (!isLoggedIn) {
                logger.warn(`User ${uid} does not appear to be logged into LinkedIn after setting cookies. Page title: ${await page.title()}`);
                // Optionally, save a screenshot for debugging
                // await page.screenshot({ path: `error_login_${uid}_${Date.now()}.png` });
                continue; // Skip to next user if login seems to have failed
            }
            logger.info(`User ${uid} appears to be logged in to LinkedIn.`);


            const queuedActionsSnap = await admin
              .firestore()
              .collection(`users/${uid}/actions`)
              .where("status", "==", "pending")
              .where("platform", "==", "linkedin") // Assuming you add a platform field
              .limit(5) // Process a few actions at a time to manage resources and time
              .get();

            logger.info(`Found ${queuedActionsSnap.docs.length} pending LinkedIn actions for user: ${uid}`);

            for (const actionDoc of queuedActionsSnap.docs) {
              const action = actionDoc.data();
              logger.info(`Processing action ID: ${actionDoc.id}, Type: ${action.type}`);

              if (action.type === "sendMessage" && action.messageUrl && action.message) {
                try {
                  await page.goto(action.messageUrl, { waitUntil: "networkidle2" });
                  logger.info(`Navigated to message URL: ${action.messageUrl}`);

                  // Wait for the message input field to be available
                  await page.waitForSelector(".msg-form__contenteditable", { timeout: 10000 });
                  await page.type(".msg-form__contenteditable", action.message, { delay: 100 }); // Add slight delay to typing

                  // Wait for the send button to be available
                  await page.waitForSelector(".msg-form__send-button:not([disabled])", { timeout: 5000 });
                  await page.click(".msg-form__send-button");

                  logger.info(`Message sent for action ID: ${actionDoc.id}`);
                  await actionDoc.ref.update({ status: "completed", completedAt: admin.firestore.FieldValue.serverTimestamp() });
                } catch (e: any) {
                  logger.error(`Error processing sendMessage action ID ${actionDoc.id} for user ${uid}: ${e.message}`, { error: e });
                  await actionDoc.ref.update({ status: "failed", error: e.message, failedAt: admin.firestore.FieldValue.serverTimestamp() });
                }
              } else if (action.type === "sendConnectionRequest" && action.profileUrl) {
                // Placeholder for connection request logic
                logger.info(`Placeholder for sendConnectionRequest to ${action.profileUrl}`);
                // Example:
                // await page.goto(action.profileUrl, { waitUntil: "networkidle2" });
                // await page.waitForSelector("button selector for connect button");
                // await page.click("button selector for connect button");
                // ... handle "add a note" if needed ...
                // await actionDoc.ref.update({ status: "completed", completedAt: admin.firestore.FieldValue.serverTimestamp() });
              }
              // Add a small delay between actions for a single user
              await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // 1-3 seconds
            }
        } catch (e: any) {
             logger.error(`Error during page operations for user ${uid}: ${e.message}`, { error: e });
             // Optionally, screenshot on error
             // await page.screenshot({ path: `error_page_${uid}_${Date.now()}.png` });
        }
      } // end user loop
    } catch (error: any) {
      logger.error("Error in automateLinkedInActions function: ", error.message, { error: error });
      return null; // Or handle error appropriately
    } finally {
      if (browser) {
        await browser.close();
        logger.info("Browser closed.");
      }
    }
    logger.info("Finished automateLinkedInActions function successfully.");
    return null;
  });
