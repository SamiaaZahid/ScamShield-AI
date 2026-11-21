import type { ScanResult } from '../types';

/**
 * Adapter for Chrome's experimental Built-in AI / Prompt API (window.ai)
 * Operates 100% on-device on supported Chromium builds with Gemini Nano.
 */

export interface ChromeAiCapabilities {
  available: boolean;
  model: string;
  reason?: string;
}

export async function checkChromeAiAvailability(): Promise<ChromeAiCapabilities> {
  try {
    const win = window as unknown as {
      ai?: {
        languageModel?: {
          capabilities?: () => Promise<{ available: string }>;
        };
      };
    };

    if (win.ai && win.ai.languageModel) {
      if (typeof win.ai.languageModel.capabilities === 'function') {
        const caps = await win.ai.languageModel.capabilities();
        if (caps.available === 'readily' || caps.available === 'after-download') {
          return { available: true, model: 'Gemini Nano (Chrome Built-in AI)' };
        }
      }
      return { available: true, model: 'Chrome Built-in AI' };
    }
    return {
      available: false,
      model: 'None',
      reason: 'Chrome Built-in AI / Prompt API not enabled in this browser (requires Chrome Dev/Canary with flags enabled).'
    };
  } catch (err) {
    return {
      available: false,
      model: 'None',
      reason: err instanceof Error ? err.message : 'Error checking Chrome AI capabilities'
    };
  }
}

export async function analyzeWithChromeAi(
  text: string,
  language: 'en' | 'ur-roman' = 'en'
): Promise<ScanResult | null> {
  const win = window as unknown as {
    ai?: {
      languageModel?: {
        create?: (opts?: unknown) => Promise<{
          prompt: (msg: string) => Promise<string>;
          destroy?: () => void;
        }>;
      };
    };
  };

  if (!win.ai?.languageModel?.create) {
    return null;
  }

  const startTime = performance.now();
  let session;
  try {
    session = await win.ai.languageModel.create({
      systemPrompt: 'You are a cybersecurity expert analyzing suspicious messages for scams, phishing, or social engineering. Respond only in valid JSON.'
    });

    const promptText = `Analyze this message for cyber scam or fraud:
Message: "${text}"

Respond ONLY with valid JSON with keys:
- riskScore (number 0-100)
- riskLevel ("Safe"|"Low"|"Medium"|"High"|"Critical")
- scamCategory (string e.g. "Phishing Link", "Fake Job Offer", "Payment / Wire Fraud", "Impersonation", "Urgent Account Suspension", "Lottery / Prize Fraud", "Legitimate / Safe")
- summary (string)
- redFlags (array of { id, title, explanation, severity: "low"|"medium"|"high"|"critical", quote })
- evidence (array of strings)
- recommendations (array of strings)
- confidence (number 0-100)`;

    const rawResponse = await session.prompt(promptText);
    const cleaned = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    return {
      id: `scan-chrome-${Date.now()}`,
      timestamp: Date.now(),
      inputText: text,
      riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : 50,
      riskLevel: parsed.riskLevel || 'Medium',
      scamCategory: parsed.scamCategory || 'Phishing Link',
      summary: parsed.summary || 'Analyzed via On-Device Chrome Prompt API.',
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 88,
      inferenceEngine: 'Chrome Built-in AI (On-Device)',
      latencyMs,
      status: parsed.riskScore >= 50 ? 'dangerous' : parsed.riskScore >= 25 ? 'suspicious' : 'safe',
      language
    };
  } catch (e) {
    console.warn('Chrome Built-in AI execution failed or returned invalid JSON:', e);
    return null;
  } finally {
    if (session?.destroy) {
      session.destroy();
    }
  }
}
