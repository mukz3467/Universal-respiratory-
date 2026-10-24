# OmniTool Global – Web Utilities Suite

A high-performance, lightweight, zero-dependency web utility suite engineered for creators, software developers, writers, and remote teams worldwide.

Built using **100% pure, standalone HTML5, CSS3, and vanilla JavaScript** with zero external frameworks, providing instant sub-second load times, 0.00 Cumulative Layout Shift (CLS), and 100% client-side privacy.

---

## 🚀 Live Pages & Architecture

The repository contains six standalone HTML pages:

1. **`index.html` — OmniTool Global homepage**
   - Links to the text, time and stopwatch utilities.
   - Homepage title, meta description, canonical URL and WebSite structured data.

2. **`word-counter.html` — Word and character counter**
   - Counts words, characters with and without spaces, sentences, lines and paragraphs.
   - Includes reading-time estimates and text import/export features.

3. **`case-converter.html` — Uppercase/lowercase and text case converter**
   - Converts text to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, kebab-case and snake_case, among other formats.

4. **`universal-time.html` — World clock and UTC time**
   - Displays UTC and selected world time zones, with a focus countdown timer.

5. **`stopwatch.html` — Online stopwatch and countdown**
   - Stopwatch with lap splits and countdown-timer functionality.

6. **`christmas-countdown-2026.html` — Christmas countdown**
   - Live countdown to December 25, 2026, with share options and holiday information.

See [SEO-KEYWORD-PLAN.md](SEO-KEYWORD-PLAN.md) for dated keyword evidence, page mapping and the next measurement steps.
---

## 🛡️ Security & Performance Guarantees

- **Zero Remote Telemetry**: 100% client-side processing; no user input or text is ever transmitted across the network.
- **Strict Content Security Policy (CSP)**: Hardcoded headers in every file (`default-src 'self'; script-src 'self' 'unsafe-inline'; ...`).
- **Defensive Type Safety**: String functions (`.indexOf()`, `.match()`, `.split()`) are guarded against null/undefined inputs to prevent console crashes.
- **Flawless Mobile Ergonomics**: Full-width viewport design with zero side margins/padding on screens $\le 768\text{px}$.

---

## 📦 How to Deploy to GitHub & GitHub Pages

Because this site uses pure standalone HTML files, it deploys instantly on **GitHub Pages** with zero build configuration!

### Step 1: Create a New GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Enter a repository name (for example, `omnitool-global`).
3. Set the visibility to **Public** (or Private).
4. Click **Create repository** (do not initialize with README since you already have this one).

### Step 2: Push from your Terminal / Command Line
Run the following commands in the project folder:

```bash
# 1. Initialize Git (if not already initialized)
git init -b main

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "feat: complete OmniTool Global standalone HTML utility suite"

# 4. Link your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/omnitool-global.git

# 5. Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages (Free Instant Hosting)
1. In your GitHub repository, click **Settings** (tab at the top).
2. On the left sidebar under *Code and automation*, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` and folder `/ (root)`.
4. Click **Save**.
5. Within 1–2 minutes, GitHub will publish your live website at:
   `https://YOUR_USERNAME.github.io/omnitool-global/`

---

## 💻 Local Development & Preview

You can open any `.html` file directly in your browser:

- Double-click `index.html` to open in Chrome, Firefox, Safari, or Edge.
- Or use any static web server:
  ```bash
  # Using Python 3:
  python3 -m http.server 8080

  # Or using Node npx:
  npx serve .
  ```
  Then visit `http://localhost:8080/index.html`.

---

## 🌐 Live Website & Tools

Explore OmniTool Global and use the tools directly:

- [OmniTool Global — All Tools](https://universal-respiratory.vercel.app/)
- [Word Counter & Character Counter](https://universal-respiratory.vercel.app/word-counter.html)
- [Uppercase to Lowercase Converter](https://universal-respiratory.vercel.app/case-converter.html)
- [World Clock & UTC Time](https://universal-respiratory.vercel.app/universal-time.html)
- [Online Stopwatch & Countdown](https://universal-respiratory.vercel.app/stopwatch.html)
- [Christmas Countdown 2026](https://universal-respiratory.vercel.app/christmas-countdown-2026.html)
- [SEO Keyword Research Plan](SEO-KEYWORD-PLAN.md)

If you find these utilities useful, share the relevant tool with people who need it.
---

## 📄 License
MIT License. Free for personal, open-source, and commercial use.
