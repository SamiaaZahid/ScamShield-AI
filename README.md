# ScamShield AI - Autonomous Cyber Fraud Defense Platform

ScamShield AI is a premium, futuristic, privacy-first cybersecurity web application engineered to detect scam messages, phishing URLs, fake job offers, payment/wire scams, and impersonation attempts.

Built for competitive hackathon evaluation, the application implements a hybrid on-device and cloud inference architecture powered by genuine Firebase AI Logic, deterministic local heuristic rules, and bilingual localization (English and Roman Urdu).

---

## Key Features

1. **Hybrid Inference Architecture**
   - **Local Heuristics Shield**: 100% on-device, zero-leak deterministic analysis evaluating linguistic urgency, spoofed brand typosquats, suspicious top-level domains, Nigerian 419 schemes, and OTP harvesting patterns.
   - **On-Device Chrome AI (Prompt API)**: Auto-detects and connects to experimental Chromium Built-in AI (`window.ai`) for on-device generative reasoning without server calls.
   - **Firebase AI Logic (Cloud)**: Genuine multi-modal analysis via Gemini 2.0 / 1.5 Flash models for deep contextual threat intelligence and vision forensics on screenshots.
   - **Transparent Telemetry**: Real latency measurements, confidence scores, and honest engine badges. Never simulates fake AI responses or fake statistics.

2. **Client-Side Privacy Pre-Scrubbing**
   - Built-in PII scrubber redacts phone numbers, email addresses, payment cards, and security PINs locally before any data leaves the client.

3. **Multi-Modal Screenshot Forensics**
   - Drag-and-drop screenshot uploader supporting PNG, JPG, and WebP images of suspicious SMS messages, WhatsApp chats, banking alerts, and fake job portals.
   - Built-in simulated screenshot presets for rapid demonstration.

4. **Bilingual Localization (English & Roman Urdu)**
   - Instant language switching across all screens, metrics, categories, threat summaries, and actionable safety advisories.

5. **Strict Zero-Emoji Interface**
   - Zero emojis across all UI elements, badges, buttons, notifications, and scan reports. Styled exclusively using high-tech SVG icons from the Lucide library.

6. **Cybersecurity Startup Design System**
   - Exact Palette: Background `#0B1020`, Surface `#121A30`, Cyan `#22D3EE`, Blue `#4F8CFF`, Violet `#7C5CFF`, Teal `#2DD4BF`, Warning `#F59E0B`, Error `#EF4444`.
   - Subtle interactive mouse-following spotlight glow (`--mouse-x`, `--mouse-y`).
   - Animated radar sweeps and circular SVG Risk Threat Gauge with glowing arcs.
   - Cyber-grid pattern and backdrop-blurred glassmorphism panels.

---

## Application Structure

- **Dashboard**: Live defense telemetry, threat radar, rapid triage input, and threat category distribution.
- **Scan Message**: Multi-line suspicious text scanner with one-click real-world presets (Bank OTP scam, WhatsApp lottery, Job offer, CEO fraud).
- **Screenshot Analysis**: Multi-modal vision analyzer for image-based fraud forensics.
- **Scan History**: Cryptographically indexed local repository with risk tier filters, report inspection modal, and JSON/Text audit log exports.
- **Scam Library**: Searchable threat knowledgebase detailing tactics, real-world attack signatures, and defensive protocols.
- **Settings**: Firebase AI Logic credentials, live connection ping tester, engine mode routing, privacy toggles, and cache purge.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Execution
```bash
# Navigate to the project directory
cd "C:\Users\samia\Desktop\ScamShield-AI"

# Install dependencies (already completed)
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## Technology Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom glowing utilities & cyber-grid
- **Icons**: Lucide React
- **Cloud AI**: Firebase Vertex AI SDK / Google Gemini API
- **On-Device AI**: Chrome Built-in AI (window.ai Prompt API)
- **State & Storage**: LocalStorage with automatic schema persistence and audit log exporter
