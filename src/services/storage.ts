import type { ScanResult, SettingsConfig } from '../types';

const STORAGE_KEY_HISTORY = 'scamshield_scan_history_v1';
const STORAGE_KEY_SETTINGS = 'scamshield_settings_v1';

export const DEFAULT_SETTINGS: SettingsConfig = {
  firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  firebaseAuthDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  firebaseStorageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  firebaseMessagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  firebaseAppId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  firebaseAppCheckDebugToken: import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN || '',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || '',
  preferredEngine: 'hybrid',
  privacyPreMasking: true,
  language: 'en',
  autoSaveHistory: true
};

export function loadSettings(): SettingsConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { 
      ...DEFAULT_SETTINGS, 
      ...parsed,
      // If localStorage values are empty, fallback to env variables if available
      firebaseApiKey: parsed.firebaseApiKey || DEFAULT_SETTINGS.firebaseApiKey,
      firebaseAuthDomain: parsed.firebaseAuthDomain || DEFAULT_SETTINGS.firebaseAuthDomain,
      firebaseProjectId: parsed.firebaseProjectId || DEFAULT_SETTINGS.firebaseProjectId,
      firebaseStorageBucket: parsed.firebaseStorageBucket || DEFAULT_SETTINGS.firebaseStorageBucket,
      firebaseMessagingSenderId: parsed.firebaseMessagingSenderId || DEFAULT_SETTINGS.firebaseMessagingSenderId,
      firebaseAppId: parsed.firebaseAppId || DEFAULT_SETTINGS.firebaseAppId,
      firebaseAppCheckDebugToken: parsed.firebaseAppCheckDebugToken || DEFAULT_SETTINGS.firebaseAppCheckDebugToken,
      geminiApiKey: parsed.geminiApiKey || DEFAULT_SETTINGS.geminiApiKey
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SettingsConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadHistory(): ScanResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return getInitialHistory();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getInitialHistory();
  } catch {
    return getInitialHistory();
  }
}

export function saveScanToHistory(scan: ScanResult): ScanResult[] {
  try {
    const current = loadHistory();
    // Prepend new scan, keep up to 100 entries
    const updated = [scan, ...current.filter(item => item.id !== scan.id)].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to persist scan history:', err);
    return loadHistory();
  }
}

export function deleteScanFromHistory(id: string): ScanResult[] {
  try {
    const current = loadHistory();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return loadHistory();
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}

export function exportHistoryAsJson(history: ScanResult[]): void {
  const jsonStr = JSON.stringify(history, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scamshield-audit-log-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportHistoryAsText(history: ScanResult[]): void {
  let output = `========================================================\n`;
  output += `SCAMSHIELD AI - THREAT AUDIT & FORENSIC LOG\n`;
  output += `Generated: ${new Date().toUTCString()}\n`;
  output += `Total Analyzed Records: ${history.length}\n`;
  output += `========================================================\n\n`;

  for (const item of history) {
    output += `[RECORD ID: ${item.id}]\n`;
    output += `Date: ${new Date(item.timestamp).toLocaleString()}\n`;
    output += `Engine: ${item.inferenceEngine}\n`;
    output += `Threat Score: ${item.riskScore}/100 [Level: ${item.riskLevel}]\n`;
    output += `Category: ${item.scamCategory}\n`;
    output += `Summary: ${item.summary}\n`;
    if (item.redFlags.length > 0) {
      output += `Red Flags:\n`;
      for (const rf of item.redFlags) {
        output += `  - [${rf.severity.toUpperCase()}] ${rf.title}: ${rf.explanation}\n`;
      }
    }
    if (item.recommendations.length > 0) {
      output += `Recommendations:\n`;
      for (const rec of item.recommendations) {
        output += `  * ${rec}\n`;
      }
    }
    output += `\n--------------------------------------------------------\n\n`;
  }

  const blob = new Blob([output], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scamshield-audit-report-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function getInitialHistory(): ScanResult[] {
  return [
    {
      id: 'scan-init-01',
      timestamp: Date.now() - 3600000 * 2,
      inputText: 'Alert: Your HBL Bank debit card has been suspended due to suspicious activity. Click http://hbl-security-verify.xyz/login within 12 hours to verify identity or account will be permanently closed.',
      riskScore: 94,
      riskLevel: 'Critical',
      scamCategory: 'Phishing Link',
      summary: 'Critical phishing attack simulating a commercial banking security lockout with a deceptive lookalike domain.',
      redFlags: [
        {
          id: 'rf-1',
          title: 'Suspicious Domain TLD',
          explanation: 'Target URL uses .xyz extension, which is widely deployed in credential harvesting kits.',
          severity: 'critical',
          quote: 'http://hbl-security-verify.xyz/login'
        },
        {
          id: 'rf-2',
          title: 'Artificial Time Pressure',
          explanation: 'Demanding compliance within 12 hours to induce panic without verification.',
          severity: 'high',
          quote: 'within 12 hours'
        }
      ],
      evidence: ['http://hbl-security-verify.xyz/login', 'within 12 hours', 'permanently closed'],
      recommendations: [
        'Do not visit the URL or enter account PIN/credentials.',
        'Call the official bank customer support number listed on the back of your card.',
        'Report this phishing domain to the bank fraud department.'
      ],
      confidence: 96,
      inferenceEngine: 'Local Heuristics Engine',
      latencyMs: 18,
      status: 'dangerous',
      language: 'en'
    },
    {
      id: 'scan-init-02',
      timestamp: Date.now() - 3600000 * 5,
      inputText: 'Mubarak ho! Aap ka Benazir Income Support Program mein 25000 rupay ka inam nikla hai. Foran rabta karein aur verification fee 1500 JazzCash par bhejein.',
      riskScore: 88,
      riskLevel: 'Critical',
      scamCategory: 'Lottery / Prize Fraud',
      summary: 'Benazir Income Support Program ke naam par advance fee scam. Inam lene ke liye paise mangna standard fraud signature hai.',
      redFlags: [
        {
          id: 'rf-3',
          title: 'Advance Fee Fraud',
          explanation: 'Inam lene ke liye pehlay JazzCash par fees mangi ja rahi hai.',
          severity: 'critical',
          quote: 'verification fee 1500 JazzCash par bhejein'
        },
        {
          id: 'rf-4',
          title: 'Jali Sarkari Inam',
          explanation: 'Sarkari schemes kabhi bhi message par advance fees nahi mangtein.',
          severity: 'high',
          quote: 'Benazir Income Support Program'
        }
      ],
      evidence: ['25000 rupay ka inam', 'verification fee 1500 JazzCash'],
      recommendations: [
        'Koi bhi raqam JazzCash ya EasyPaisa par transfer na karein.',
        'Number ko foran block karein aur BISP ki helpline par fraud report karein.'
      ],
      confidence: 94,
      inferenceEngine: 'Local Heuristics Engine',
      latencyMs: 14,
      status: 'dangerous',
      language: 'ur-roman'
    },
    {
      id: 'scan-init-03',
      timestamp: Date.now() - 3600000 * 18,
      inputText: 'Your Amazon package delivery has been rescheduled to tomorrow between 2 PM and 5 PM. Track updates in your official Amazon app.',
      riskScore: 4,
      riskLevel: 'Safe',
      scamCategory: 'Legitimate / Safe',
      summary: 'Standard benign logistical delivery notification with no malicious links, OTP demands, or payment solicitations.',
      redFlags: [],
      evidence: ['Track updates in your official Amazon app'],
      recommendations: [
        'Normal transactional message. Continue to access deliveries via the verified mobile app.'
      ],
      confidence: 95,
      inferenceEngine: 'Local Heuristics Engine',
      latencyMs: 11,
      status: 'safe',
      language: 'en'
    }
  ];
}
