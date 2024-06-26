/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { JWT } = require("google-auth-library");
const creds = require("./creds.json");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const functions = require("firebase-functions");
//const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const client = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const SPREADSHEET_ID = "1nLUIjOBb566SsltJjlIIPF5_7fhhOsHmdsQZwssXwXg";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.testFunction = functions.https.onRequest((request, response) => {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, client);

  fetchDoc(doc, request, response);

  //   logger.info("Hello logs!", { structuredData: true });
  //   response.send("Hello from Firebase!");
});

const fetchDoc = async (doc, request, response) => {
  try {
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
    console.log(sheet.title);
    console.log(sheet.rowCount);

    const rows = await sheet.getRows();
    console.log(rows);

    response.send("Hello from Firebase!: " + rows);
  } catch (err) {
    console.error("Error accessing Google Sheets:", err);
    throw err;
  }
};
