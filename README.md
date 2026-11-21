# ScamShield AI

**A privacy-first, AI-powered cyber fraud detection platform.**

ScamShield AI detects scam messages, phishing links, fake job offers, payment scams, and impersonation attempts using a transparent hybrid inference architecture — local heuristics run entirely on-device, Firebase AI Logic provides deep cloud analysis only when explicitly enabled, and every analysis result is clearly attributed to its source engine.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Privacy and PII Scrubbing](#privacy-and-pii-scrubbing)
- [Hybrid Inference: Local vs. Cloud](#hybrid-inference-local-vs-cloud)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [License](#license)

---

## Architecture Overview

```
User Input (Text / Screenshot)
        |
        v
 [Privacy Pre-Scrubber]       <-- runs 100% on-device, before anything else
   Redacts PII locally
        |
        v
 [Local Heuristic Engine]     <-- always runs, zero network calls
   Deterministic rules,
   pattern matching, scoring
        |
        v
 [Hybrid Router]
   |                   |
   v                   v
[Chrome Built-in AI]  [Firebase AI Logic]   <-- cloud, opt-in only
 window.ai Prompt API   Gemini 2.0/1.5 Flash
 (experimental)         via firebase/ai SDK
        |                   |
        +--------+----------+
                 |
                 v
        [Result Aggregator]
   Confidence scores, risk level,
   red flags, recommendations,
   engine attribution badges
```

No analysis result is ever faked. Every response includes an honest engine badge (`Local Heuristic`, `Chrome Built-in AI`, `Firebase AI Logic`) with real latency measurements.

---

## Privacy and PII Scrubbing

A client-side **Privacy Pre-Scrubber** (`src/services/privacyPreScrubber.ts`) runs before any data is routed to cloud inference engines. It redacts:

- Phone numbers (Pakistani, international, and formatted variants)
- Email addresses
- Payment card numbers (13–16 digits, Luhn-aware masking)
- Security PINs and OTP codes
- CNIC numbers (Pakistani national ID format)

The scrubbed text replaces the original in any payload sent to Firebase AI Logic. The user can toggle cloud inference entirely from the Settings panel. When cloud is disabled, all analysis stays on-device — zero bytes leave the browser.

---

## Hybrid Inference: Local vs. Cloud

### Local Heuristic Engine (`src/services/localHeuristicEngine.ts`)

Always runs. No network. No API key required. Evaluates:

- Linguistic urgency and pressure tactics
- Spoofed brand names and typosquatting domains
- Suspicious TLDs and URL patterns
- Nigerian 419 / advance-fee fraud signatures
- OTP harvesting and account takeover language
- Fake job offer markers (salary inflation, upfront payment demands)
- WhatsApp lottery and prize scam templates

### Firebase AI Logic Cloud Engine (`src/services/firebaseAiEngine.ts`)

Requires a Firebase project with **Firebase AI Logic** (Vertex AI for Firebase) enabled. Uses the official `firebase/ai` SDK:

- **SDK:** `firebase@^11` with `firebase/ai` module
- **Model:** `gemini-2.0-flash` (auto-fallback to `gemini-1.5-flash`)
- **Inference mode:** `prefer_on_device` with `only_in_cloud` fallback
- **App Check:** Configured via `CustomProvider` with debug token support (development only)
- **Firebase project:** `scamshield-ai-15e94` (configure your own — see [Environment Variables](#environment-variables))

Cloud inference is only called when:
1. The user has entered Firebase credentials in Settings, **and**
2. Cloud inference is not explicitly disabled in Settings.

### On-Device Chrome AI (`src/services/onDeviceAiEngine.ts`)

Attempts to connect to `window.ai` (Chrome's experimental Built-in AI Prompt API) on startup. Only available in Chrome Canary / Dev with the flag enabled. Falls back gracefully to the heuristic engine when unavailable — no errors, no fake responses.

---

## Features

| View | Description |
|---|---|
| **Dashboard** | Live defense telemetry, threat radar animation, rapid triage input, and category distribution chart |
| **Scan Message** | Multi-line text scanner with one-click preset samples (bank OTP, lottery, CEO fraud, job offer) |
| **Screenshot Analysis** | Drag-and-drop multi-modal forensics for PNG/JPG/WebP images; PII is scrubbed from extracted text before cloud upload |
| **Scan History** | Local-only audit log with risk-tier filters, detail modal, and JSON/text export |
| **Scam Library** | Searchable threat knowledge base with tactics, real-world signatures, and defensive protocols |
| **Settings** | Firebase credential configuration, live connection ping, engine mode routing, and privacy toggles |

Additional capabilities:
- Bilingual interface: **English** and **Roman Urdu** — instant switch, no reload
- Zero emojis across the entire interface — Lucide SVG icons only
- Risk Score + Threat Level gauge (Critical / High / Medium / Low / Safe)
- Identified red flags and evidence list per scan
- Actionable safety recommendations per scan

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 with custom `@theme` variables |
| Icons | Lucide React |
| Cloud AI | Firebase AI Logic (`firebase/ai`) — Gemini 2.0/1.5 Flash |
| On-Device AI | Chrome Built-in AI (`window.ai`) — optional/experimental |
| Security | Firebase App Check (debug token for local dev) |
| Storage | Browser `localStorage` — no backend database |
| Linting | oxlint |

---

## Local Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A Firebase project with **Firebase AI Logic** enabled (optional — app works without it using local heuristics)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ScamShield-AI.git
cd ScamShield-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your own Firebase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) below). The app runs without Firebase credentials — cloud inference is simply disabled.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
```

Output is in `dist/`.

---

## Environment Variables

All environment variables are prefixed with `VITE_` so Vite exposes them to the client bundle. **Never commit your `.env` file** — it is listed in `.gitignore`.

| Variable | Required | Description |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | For cloud AI | Your Firebase web app API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | For cloud AI | Firebase auth domain (`<project>.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | For cloud AI | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | For cloud AI | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | For cloud AI | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | For cloud AI | Firebase web app ID |
| `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN` | Dev only | App Check debug token (never use in production) |

See `.env.example` for the exact placeholder format.

> **Security note:** The `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN` variable is for local development only. Remove it before any production deployment. All secrets must remain in `.env` which is gitignored.

---

## Project Structure

```
ScamShield-AI/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, TopBar, layout wrappers
│   │   └── views/           # DashboardView, ScanMessageView, ScreenshotView,
│   │                        # HistoryView, ScamLibraryView, SettingsView
│   ├── services/
│   │   ├── firebaseAiEngine.ts      # Firebase AI Logic SDK integration
│   │   ├── localHeuristicEngine.ts  # On-device deterministic rules
│   │   ├── onDeviceAiEngine.ts      # Chrome Built-in AI (window.ai)
│   │   ├── privacyPreScrubber.ts    # Client-side PII redaction
│   │   └── scanOrchestrator.ts      # Hybrid routing and result aggregation
│   ├── types/               # Shared TypeScript interfaces and enums
│   ├── utils/               # Formatting, scoring helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # Tailwind v4 @theme, glassmorphism, glow utilities
├── .env.example             # Safe placeholder template (committed)
├── .env                     # Real secrets (gitignored, never committed)
├── .gitignore
├── .vscode/
│   └── settings.json        # Disables VS Code CSS validator false positives for Tailwind v4
├── LICENSE
├── README.md
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Design System

Custom cybersecurity color palette defined in Tailwind `@theme`:

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-dark` | `#0B1020` | Page background |
| `--color-surface` | `#121A30` | Cards, panels |
| `--color-cyber-cyan` | `#22D3EE` | Primary accent, glows |
| `--color-cyber-blue` | `#4F8CFF` | Secondary accent |
| `--color-cyber-violet` | `#7C5CFF` | Tertiary accent |
| `--color-cyber-teal` | `#2DD4BF` | Safe indicators |
| `--color-warning` | `#F59E0B` | Medium risk |
| `--color-error` | `#EF4444` | Critical risk |

Additional UI patterns:
- Interactive mouse-following spotlight glow (`--mouse-x` / `--mouse-y` CSS custom properties)
- Animated radar sweep (SVG + `@keyframes radar-spin`)
- Glassmorphism panels (`backdrop-blur`, `bg-white/5`, `border-white/10`)
- Cyber-grid background texture
- Hover scale pop-up (`hover:scale-110`) with cyan drop-shadow glow on all interactive elements

---

## License

MIT License — Copyright (c) 2026 Samia Zahid. See [LICENSE](./LICENSE) for full text.
