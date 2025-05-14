// functions/src/index.ts

import * as admin from "firebase-admin";

admin.initializeApp();

// Other Firebase Cloud Functions for your application can be defined below.
// For example:
// export const myOtherFunction = functions.https.onCall(async (data, context) => {
//   // ... your function logic
// });

// If no other cloud functions are defined, this file can be very minimal
// or even just export an empty object if your deployment tool expects some export.
// For now, keeping the admin initialization.

// console.log("Firebase Admin SDK initialized in functions/src/index.ts");
// export {}; // Export an empty object if nothing else is exported
