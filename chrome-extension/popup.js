
document.addEventListener('DOMContentLoaded', function() {
  const scrapeProfileButton = document.getElementById('scrapeProfileButton');
  const scrapeMessagesButton = document.getElementById('scrapeMessagesButton');
  const sendTestMessageButton = document.getElementById('sendTestMessageButton');
  const authenticateButton = document.getElementById('authenticateButton');
  const statusMessage = document.getElementById('statusMessage');
  const authStatus = document.getElementById('authStatus');

  // Placeholder for checking auth status
  // In a real extension, you'd check if a token or UID is stored from a previous auth
  // For now, let's assume not authenticated
  let currentUid = null;

  function updateAuthStatus(uid) {
    if (uid) {
      currentUid = uid;
      authStatus.textContent = `Status: Authenticated (UID: ${uid.substring(0,6)}...)`;
      authStatus.style.color = 'green';
      authenticateButton.textContent = 'Re-Authenticate';
      // Enable action buttons
      scrapeProfileButton.disabled = false;
      scrapeMessagesButton.disabled = false;
      sendTestMessageButton.disabled = false;
    } else {
      currentUid = null;
      authStatus.textContent = 'Status: Not Authenticated';
      authStatus.style.color = 'red';
      authenticateButton.textContent = 'Authenticate with ConvoSpan';
      // Disable action buttons
      scrapeProfileButton.disabled = true;
      scrapeMessagesButton.disabled = true;
      sendTestMessageButton.disabled = true;
    }
  }

  // Initial auth status check (e.g., from chrome.storage.local)
  chrome.storage.local.get(['convospan_uid'], function(result) {
    if (result.convospan_uid) {
      updateAuthStatus(result.convospan_uid);
    } else {
      updateAuthStatus(null);
    }
  });


  authenticateButton.addEventListener('click', () => {
    statusMessage.textContent = 'Authentication process initiated...';
    // This is a conceptual trigger.
    // In a real scenario, you might open a new tab to your web app's login page,
    // and after successful login there, the web app would post a message
    // to this extension with the user's ID or a temporary code.
    // For this example, we'll simulate receiving a User ID.
    // You would need a more secure flow here.
    const webAppUserId = prompt("Simulate Web App Login: Enter your ConvoSpan User ID (for testing):");
    if (webAppUserId) {
        chrome.runtime.sendMessage({ action: "authenticateExtension", userId: webAppUserId }, (response) => {
            if (chrome.runtime.lastError) {
                statusMessage.textContent = `Error: ${chrome.runtime.lastError.message}`;
                console.error("Auth message error:", chrome.runtime.lastError);
                updateAuthStatus(null);
            } else if (response && response.success) {
                statusMessage.textContent = `Authenticated successfully! UID: ${response.uid.substring(0,6)}...`;
                updateAuthStatus(response.uid);
            } else {
                statusMessage.textContent = `Authentication failed: ${response?.error || 'Unknown error'}`;
                console.error("Auth failed response:", response);
                updateAuthStatus(null);
            }
        });
    } else {
        statusMessage.textContent = 'Authentication cancelled.';
    }
  });


  if (scrapeProfileButton) {
    scrapeProfileButton.addEventListener('click', function() {
      statusMessage.textContent = 'Requesting profile scrape...';
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "scrapeProfile"}, function(response) {
            if (chrome.runtime.lastError) {
              statusMessage.textContent = `Error: ${chrome.runtime.lastError.message}`;
              console.error(chrome.runtime.lastError.message);
            } else if (response) {
              statusMessage.textContent = response.status || 'No response from content script.';
              console.log("Response from content.js (scrapeProfile):", response);
            } else {
              statusMessage.textContent = 'No response from content script for profile scrape.';
            }
          });
        } else {
          statusMessage.textContent = 'No active tab found.';
        }
      });
    });
  }

  if (scrapeMessagesButton) {
    scrapeMessagesButton.addEventListener('click', function() {
      statusMessage.textContent = 'Requesting messages scrape...';
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
         if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "scrapeMessages"}, function(response) {
            if (chrome.runtime.lastError) {
              statusMessage.textContent = `Error: ${chrome.runtime.lastError.message}`;
              console.error(chrome.runtime.lastError.message);
            } else if (response) {
              statusMessage.textContent = response.status || 'No response from content script.';
              console.log("Response from content.js (scrapeMessages):", response);
            } else {
              statusMessage.textContent = 'No response from content script for messages scrape.';
            }
          });
        } else {
          statusMessage.textContent = 'No active tab found.';
        }
      });
    });
  }

  if (sendTestMessageButton) {
    sendTestMessageButton.addEventListener('click', function() {
      statusMessage.textContent = 'Queueing test LinkedIn message...';
      // This sends a message to background.js to queue an action
      chrome.runtime.sendMessage({
        action: "queueLinkedInAction",
        type: "sendMessage",
        payload: { message: "Hello from ConvoSpan AI popup! Hope you're having a great day." }
      }, function(response) {
         if (chrome.runtime.lastError) {
            statusMessage.textContent = `Error: ${chrome.runtime.lastError.message}`;
            console.error(chrome.runtime.lastError.message);
        } else if (response && response.success) {
          statusMessage.textContent = 'Test message queued via background script.';
          console.log("Response from background.js (queueLinkedInAction):", response);
        } else {
          statusMessage.textContent = `Failed to queue message: ${response?.error || 'Unknown error'}`;
        }
      });
    });
  }
});
