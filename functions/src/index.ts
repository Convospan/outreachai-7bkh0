// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

// Define the owner and repo for your GitHub repository
const GITHUB_OWNER = "Convospan";
const GITHUB_REPO = "outreachai-7bkh0";

// HTTPS Callable Function to update a file in the GitHub repository
export const updateFileInRepo = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated if needed (optional, depends on your use case)
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     "unauthenticated",
  //     "The function must be called while authenticated."
  //   );
  // }

  const { filePath, content, commitMessage, branch = "master" } = data; // Default to master branch

  if (!filePath || typeof content !== "string" || !commitMessage) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required parameters: filePath, content, or commitMessage."
    );
  }

  // Retrieve the GitHub PAT from Firebase environment configuration
  // IMPORTANT: Set this in your Firebase Function's environment variables
  // firebase functions:config:set github.pat="YOUR_GITHUB_PAT"
  const githubToken = functions.config().github?.pat;

  if (!githubToken) {
    console.error("GitHub PAT is not configured in Firebase Function environment.");
    throw new functions.https.HttpsError(
      "internal",
      "Server configuration error: GitHub token missing."
    );
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  try {
    // 1. Get the current file (to get its SHA for updating)
    let currentFileSha: string | undefined;
    try {
      const getFileResponse = await axios.get(apiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          ref: branch,
        },
      });
      currentFileSha = getFileResponse.data.sha;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // File doesn't exist, this is fine for a create operation
        console.log(`File ${filePath} not found in branch ${branch}. Will create it.`);
      } else {
        // Other error getting the file, rethrow
        console.error("Error fetching file from GitHub:", error.response?.data || error.message);
        throw new functions.https.HttpsError("internal", "Failed to fetch file from GitHub.");
      }
    }

    // 2. Create or update the file
    const response = await axios.put(
      apiUrl,
      {
        message: commitMessage,
        content: Buffer.from(content).toString("base64"), // Content must be base64 encoded
        sha: currentFileSha, // Include SHA if updating an existing file
        branch: branch,
      },
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`File ${filePath} successfully ${currentFileSha ? "updated" : "created"} in branch ${branch}. Commit: ${response.data.commit.sha}`);
    return {
      success: true,
      message: `File ${filePath} successfully ${currentFileSha ? "updated" : "created"}.`,
      commit: response.data.commit.sha,
      url: response.data.content.html_url,
    };
  } catch (error: any) {
    console.error("Error interacting with GitHub API:", error.response?.data || error.message);
    throw new functions.https.HttpsError(
      "internal",
      `Failed to update file in GitHub: ${error.response?.data?.message || error.message}`
    );
  }
});
