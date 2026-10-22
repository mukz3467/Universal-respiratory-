const SITE_URL = 'https://universal-respiratory.vercel.app';

const urlsToCheck = [
  '/',
  '/word-counter.html',
  '/case-converter.html',
  '/universal-time.html',
  '/stopwatch.html',
  '/robots.txt',
  '/sitemap.xml',
];

async function checkUrl(path) {
  const url = new URL(path, SITE_URL).toString();
  const response = await fetch(url, { redirect: 'follow' });
  console.log(`${response.status} ${url}`);
  if (!response.ok) {
    throw new Error(`URL check failed with HTTP ${response.status}: ${url}`);
  }
  return { url, body: path === '/sitemap.xml' ? await response.text() : '' };
}

async function main() {
  const results = await Promise.all(urlsToCheck.map(checkUrl));
  const sitemap = results.find((item) => item.url.endsWith('/sitemap.xml'));
  if (!sitemap?.body.includes('<urlset') && !sitemap?.body.includes('<sitemapindex')) {
    throw new Error('sitemap.xml does not contain a valid sitemap root element.');
  }

  console.log('All site URLs and sitemap checks passed.');
  console.log('This workflow checks crawl readiness only. Google controls crawling and indexing.');
  console.log('Google Indexing API is restricted to eligible JobPosting and livestream pages; it is not for ordinary utility pages.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
