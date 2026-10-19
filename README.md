# OmniTool Global – Web Utilities Suite

A high-performance, lightweight, zero-dependency web utility suite engineered for creators, software developers, writers, and remote teams worldwide.

Built using **100% pure, standalone HTML5, CSS3, and vanilla JavaScript** with zero external frameworks, providing instant sub-second load times, 0.00 Cumulative Layout Shift (CLS), and 100% client-side privacy.

---

## 🚀 Live Pages & Architecture

The application is architected into 4 independent, modular HTML pages that link together seamlessly:

1. **`index.html`** – **Navigation Center Hub**
   - 3-column responsive card navigation hub.
   - Core global On-Page SEO meta stack and Schema.org structured data (`WebSite`).
   - Hardcoded Anti-CLS ad container reservation spaces (`728x90` desktop / `320x50` mobile).
   - Global dark/light theme switch synchronized via `localStorage`.

2. **`word-counter.html`** – **Live Multi-Script Text Metric Counter**
   - Top-layer full-width text input with instant metrics updates.
   - Multi-byte Unicode segmentation supporting English, Roman Urdu, Hindi, Arabic, and CJK scripts.
   - Dual character counts (with and without whitespace), words, sentences, lines, and paragraphs.
   - Silent reading time (~225 wpm) and spoken pacing (~130 wpm) estimation.
   - Text analytics breakdown: word length distribution and character frequency charts.
   - One-click Copy, .txt Report Export, File Import, and sample loaders.

3. **`case-converter.html`** – **Universal Text Case Transformer**
   - 12 case transformation formats:
     - **UPPERCASE**, **lowercase**, **Title Case**, **Sentence case**, **Capitalized Case**
     - **aLtErNaTiNg cAsE**, **InVeRsE cAsE**
     - **camelCase**, **PascalCase**, **kebab-case**, **snake_case**, **CONSTANT_CASE**
   - **Trim & Clean**: Normalizes consecutive spaces/tabs and cleans excess line breaks.
   - Multi-level Undo / Redo history stack.
   - Safe event delegation ensuring button child elements never intercept clicks.

4. **`universal-time.html`** – **High-Precision UTC Clock & Global Zone Tracker**
   - Real-time millisecond atomic UTC clock running via `requestAnimationFrame` to prevent background tab sleep drift.
   - Worldwide timezone tracker (EST, GMT, CET, PKT, IST, and auto-detected Local offset).
   - Focus countdown timer (Pomodoro 25m, 15m, 5m, 1m) with Web Audio API harmonic chime alert.

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

## 📄 License
MIT License. Free for personal, open-source, and commercial use.
