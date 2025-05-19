
// chrome-extension/background.js
import { initializeApp } from './firebase-app.js'; // For Firebase App
import { getAuth, signInWithCustomToken } from './firebase-auth.js'; // For Firebase Auth

// Initialize Firebase
const firebaseApp = initializeApp({
    // IMPORTANT: REPLACE with your actual Firebase config
    apiKey: "YOUR_NEXT_PUBLIC_FIREBASE_API_KEY",
    authDomain: "YOUR_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_NEXT_PUBLIC_FIREBASE_APP_ID"
});
const auth = getAuth(firebaseApp);

const MAX_DAILY_ACTIONS = 100; // Example limit
let actionQueue = [];
let dailyActionCount = 0; // Needs persistent storage for actual daily tracking

// Function to securely get user ID (placeholder - implement robustly)
async function getUserId() {
    // This is a placeholder. In a real extension:
    // 1. Check if user is already signed in (e.g., via signInWithCustomToken from a previous session)
    // 2. If not, trigger an authentication flow (e.g., open a tab for user to sign into your web app,
    //    then have web app communicate token back to extension, or use chrome.identity API for Google Sign-In if appropriate)
    // 3. For this example, we'll try to get it from storage or return a placeholder.
    const result = await chrome.storage.local.get(['convospan_uid']);
    if (result.convospan_uid) {
        return result.convospan_uid;
    }
    console.warn("USER_UID is not set. Using placeholder. Implement proper authentication.");
    return "PLACEHOLDER_USER_UID"; // Replace with actual logic
}


// Authenticate with Firebase using a custom token from your backend
async function authenticateExtensionUser(userIdFromWebApp) {
  try {
    // Fetch Firebase custom token from your backend
    // The backend function needs to be secure and verify the userIdFromWebApp
    const response = await fetch("https://YOUR_FIREBASE_FUNCTION_URL/getCustomToken", { // REPLACE
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // IMPORTANT: Securely pass the userId from the web app session to the extension,
      // then to this function. This example assumes userIdFromWebApp is obtained securely.
      body: JSON.stringify({ userId: userIdFromWebApp })
    });
    const { token, error } = await response.json();

    if (error || !token) {
      console.error("Failed to get custom token:", error || "No token received");
      return null;
    }

    const userCredential = await signInWithCustomToken(auth, token);
    console.log("Extension successfully authenticated with Firebase UID:", userCredential.user.uid);
    await chrome.storage.local.set({ convospan_uid: userCredential.user.uid }); // Store UID
    return userCredential.user.uid;
  } catch (error) {
    console.error("Error authenticating extension with Firebase:", error);
    return null;
  }
}

// Example: Listen for a message from your web app to trigger authentication
// This would require your web app to send a message to the extension after user logs in there.
chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
    if (request.action === "authenticateExtension" && request.userId) {
        const uid = await authenticateExtensionUser(request.userId);
        if (uid) {
            sendResponse({ success: true, uid: uid });
        } else {
            sendResponse({ success: false, error: "Extension authentication failed" });
        }
        return true; // Keep the message channel open for async response
    }
});


function addToQueue(actionType, data) {
  // TODO: Implement proper daily action count persistence (e.g., using chrome.storage.local)
  if (dailyActionCount >= MAX_DAILY_ACTIONS) {
    console.log("Daily action limit reached for today.");
    // Optionally, notify the user via popup or badge
    return;
  }
  actionQueue.push({ type: actionType, data: data });
  dailyActionCount++; // Increment (needs proper daily reset logic)
  console.log(`Action added to queue. Current queue size: ${actionQueue.length}, Actions today: ${dailyActionCount}`);
  processQueue(); // Attempt to process immediately if queue was empty
}

async function processQueue() {
  if (actionQueue.length === 0) {
    console.log("Action queue is empty.");
    return;
  }

  const currentAction = actionQueue.shift(); // Get the next action
  console.log("Processing action:", currentAction);

  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab || !activeTab.id) {
      console.error("No active tab found to execute script.");
      actionQueue.unshift(currentAction); // Re-add to front of queue if tab not ready
      return;
    }
    if (!activeTab.url || !activeTab.url.includes("linkedin.com")) {
        console.warn("Not on a LinkedIn page. Action skipped:", currentAction.type);
        // Optionally, re-queue or notify user
        return;
    }


    if (currentAction.type === "sendConnectionRequest") {
      // Note: Sending connection requests often involves multiple steps (click connect, then send with/without note)
      // This is a simplified version.
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          // More robust selectors are needed for LinkedIn
          const connectButton = document.querySelector("button[aria-label*='Invite'][aria-label*='to connect'], button[aria-label*='Follow']"); // Example selectors
          if (connectButton) {
            connectButton.click();
            return "Connection request button clicked.";
          } else {
            return "Connection request button not found.";
          }
        }
      }).then(results => console.log(results[0].result));

    } else if (currentAction.type === "sendMessage" && currentAction.data) {
      const messageContent = currentAction.data.message.replace(/"/g, '\\"').replace(/\n/g, '\\n'); // Escape quotes and newlines
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (msg) => {
          // These selectors are highly likely to change.
          const msgInput = document.querySelector(".msg-form__contenteditable div[contenteditable='true']");
          const sendButton = document.querySelector(".msg-form__send-button");
          if (msgInput && sendButton) {
            msgInput.focus();
            document.execCommand('insertText', false, msg); // Safer way to insert text
            // msgInput.innerHTML = msg; // Can be problematic due to HTML injection and event handling
            
            // Trigger input event if necessary for LinkedIn's JS to recognize change
            msgInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

            setTimeout(() => { // Slight delay to ensure message is processed by LinkedIn's JS
                if (!sendButton.disabled) {
                    sendButton.click();
                    return "Message send button clicked.";
                } else {
                    return "Send button was disabled.";
                }
            }, 100);
          } else {
            if(!msgInput) console.error("Message input field not found.");
            if(!sendButton) console.error("Message send button not found.");
            return "Message input field or send button not found.";
          }
        },
        args: [messageContent]
      }).then(results => console.log(results?.[0]?.result));
    }
    // Add other actions like "viewProfile", "likePost" etc.
  } catch (error) {
    console.error("Error executing script in active tab:", error);
    actionQueue.unshift(currentAction); // Re-add action to queue on error for retry
  }


  const delay = Math.random() * 10000 + 5000; // 5-15 seconds delay
  console.log(`Waiting ${delay / 1000} seconds before next action.`);
  setTimeout(processQueue, delay);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => { // Wrap in async IIFE to use await
    if (request.action === "storeProfile" || request.action === "storeMessages") {
      const userId = await getUserId(); // Get the authenticated user's ID
      if (userId === "PLACEHOLDER_USER_UID") {
          console.error("Cannot store data: User is not properly authenticated in extension.");
          sendResponse({ success: false, error: "User not authenticated in extension" });
          return;
      }

      const endpoint = request.action === "storeProfile" ? "/storeProfile" : "/storeMessages";
      const backendUrl = "https://YOUR_FIREBASE_FUNCTION_URL" + endpoint; // REPLACE

      try {
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // TODO: Include an auth token for your backend if needed (e.g., Firebase ID token)
          // headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
          body: JSON.stringify({ uid: userId, data: request.data }) // Send data under 'data' key
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Failed to parse error response from backend."}));
            throw new Error(`Backend error: ${response.status} ${response.statusText} - ${errorData.error || JSON.stringify(errorData)}`);
        }
        const responseData = await response.json();
        console.log(`${request.action} successful:`, responseData);
        sendResponse({ success: true, data: responseData });
      } catch (error) {
        console.error(`Error in ${request.action}:`, error.message);
        sendResponse({ success: false, error: error.message });
      }
    } else if (request.action === "queueLinkedInAction") {
        if (request.type && request.payload) {
            addToQueue(request.type, request.payload);
            sendResponse({ success: true, message: "Action queued." });
        } else {
            sendResponse({ success: false, error: "Missing type or payload for queueLinkedInAction." });
        }
    }
  })(); // Immediately invoke the async function
  return true; // Required for asynchronous sendResponse
});

// Example: Queue an action when the extension starts (for testing)
// This should ideally be triggered by user interaction from popup.js or options page
// addToQueue("sendMessage", { message: "Hi from ConvoSpan AI! Just testing the queue." });

console.log("ConvoSpan AI background script loaded and running.");
