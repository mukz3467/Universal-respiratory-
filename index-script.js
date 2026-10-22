import { google } from 'googleapis';

const credentials = JSON.parse(process.env.GOOGLE_CREDS);

const auth = new google.auth.JWT({
email: credentials.client_email,
key: credentials.private_key.replace(/\n/g, '\n'),
scopes: [
'https://www.googleapis.com/auth/indexing'
]
});

const indexing = google.indexing({
version: 'v3',
auth
});

const urlsToIndex = [
'https://YOUR-DOMAIN.vercel.app/',
'https://YOUR-DOMAIN.vercel.app/word-counter.html',
'https://YOUR-DOMAIN.vercel.app/case-converter.html',
'https://YOUR-DOMAIN.vercel.app/universal-time.html',
'https://YOUR-DOMAIN.vercel.app/stopwatch.html'
];

async function sendIndexRequest() {
for (const url of urlsToIndex) {
try {
const response = await indexing.urlNotifications.publish({
requestBody: {
url,
type: 'URL_UPDATED'
}
});

  console.log(`Successfully submitted: ${url}`);
  console.log(response.data);

} catch (error) {
  console.error(
    `Error for ${url}:`,
    error.response?.data || error.message
  );
}

}
}

sendIndexRequest();
