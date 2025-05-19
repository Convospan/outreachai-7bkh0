
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeProfile") {
    const name = document.querySelector(".pv-top-card--list li:first-child")?.innerText.trim() || "";
    const headline = document.querySelector(".pv-top-card--list li:nth-child(2)")?.innerText.trim() || "";
    // More robust selector for company name, looking for a link within the experience section
    let company = "";
    const experienceSection = document.querySelector("#experience");
    if (experienceSection) {
        const companyLink = experienceSection.querySelector("a[data-field='experience_company_logo'] .t-normal span.visually-hidden");
        if (companyLink) {
          company = companyLink.parentElement?.innerText.replace("Company Name", "").trim() || "";
        }
        // Fallback for older structures or different views
        if (!company) {
            const companyElement = Array.from(experienceSection.querySelectorAll('li .mr1 span.visually-hidden')).find(el => el.innerText.includes('Company Name'));
            company = companyElement?.parentElement?.innerText.replace("Company Name", "").trim() || "";
        }
         if (!company) {
            company = document.querySelector(".pv-top-card-v2-ctas a[href*='/company/']")?.innerText.trim() || "";
        }
    }


    const profileData = { name, headline, company, url: window.location.href };

    chrome.runtime.sendMessage({ action: "storeProfile", data: profileData }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending storeProfile message:", chrome.runtime.lastError.message);
        sendResponse({ status: "Error sending message", error: chrome.runtime.lastError.message });
      } else {
        console.log("Profile scraped, sent to background. Response from background:", response);
        sendResponse({ status: "Profile scraped and sent", data: profileData });
      }
    });
    return true; // Indicates that the response will be sent asynchronously
  }

  if (request.action === "scrapeMessages") {
    const messages = Array.from(document.querySelectorAll(".msg-s-message-list__event")).map(msgElement => {
      const senderElement = msgElement.querySelector(".msg-s-message-group__name");
      const contentElement = msgElement.querySelector(".msg-s-event-listitem__body, .msg-s-message-list__body"); // Added another common selector
      const timeElement = msgElement.querySelector("time.msg-s-message-list__time-heading");

      return {
        sender: senderElement?.innerText.trim() || "Unknown Sender",
        content: contentElement?.innerText.trim() || "No content",
        timestamp: timeElement?.getAttribute('datetime') || new Date().toISOString() // Use datetime attribute or current time
      };
    });

    chrome.runtime.sendMessage({ action: "storeMessages", data: messages }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending storeMessages message:", chrome.runtime.lastError.message);
        sendResponse({ status: "Error sending message", error: chrome.runtime.lastError.message });
      } else {
        console.log("Messages scraped, sent to background. Response from background:", response);
        sendResponse({ status: "Messages scraped and sent", data: messages });
      }
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});

console.log("ConvoSpan AI LinkedIn content script loaded.");
