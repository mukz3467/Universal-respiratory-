const { google } = require('googleapis');
const credentials = JSON.parse(process.env.GOOGLE_CREDS);
console.log("Google API Credentials Setup Done!");
console.log("Project ID:", credentials.project_id);
