import type { ScanResult, RedFlag, RiskLevel, ScamCategory } from '../types';

export interface FirebaseAiCredentials {
  apiKey: string;
  projectId?: string;
  appId?: string;
  authDomain?: string;
}

export async function testFirebaseConnection(apiKey: string): Promise<{ success: boolean; message: string }> {
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, message: 'API Key is empty. Please enter your Firebase or Gemini API key.' };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Ping test: respond with OK' }] }]
        })
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      const errMsg = errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      return { success: false, message: errMsg };
    }

    return { success: true, message: 'Connection established successfully with Gemini / Firebase AI Logic endpoint.' };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Network failure when connecting to AI endpoint.'
    };
  }
}

export async function analyzeWithFirebaseAi(
  text: string,
  imageDataUrl?: string,
  apiKey?: string,
  language: 'en' | 'ur-roman' = 'en'
): Promise<ScanResult> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Firebase AI Logic API key is missing. Please provide it in Settings.');
  }

  const startTime = performance.now();

  const systemInstruction = `You are ScamShield AI, an enterprise cybersecurity scam detection intelligence engine.
Your task is to analyze the provided message or screenshot for phishing, fraud, impersonation, fake job scams, financial fraud, and social engineering.
CRITICAL CONSTRAINT: Do not use ANY emojis in your output.
You must respond strictly in JSON matching this schema:
{
  "riskScore": number (integer between 0 and 100),
  "riskLevel": "Safe" | "Low" | "Medium" | "High" | "Critical",
  "scamCategory": "Phishing Link" | "Fake Job Offer" | "Payment / Wire Fraud" | "Impersonation" | "Tech Support Scam" | "Crypto Giveaway Scam" | "Urgent Account Suspension" | "Lottery / Prize Fraud" | "Malicious Attachment / File" | "Legitimate / Safe",
  "summary": string (concise 1-2 sentence threat summary in ${language === 'ur-roman' ? 'Roman Urdu' : 'English'}),
  "redFlags": [
    {
      "id": string,
      "title": string,
      "explanation": string,
      "severity": "low" | "medium" | "high" | "critical",
      "quote": string (optional excerpt)
    }
  ],
  "evidence": string[] (key forensic snippets found),
  "recommendations": string[] (actionable, direct security advice in ${language === 'ur-roman' ? 'Roman Urdu' : 'English'}),
  "confidence": number (integer between 0 and 100)
}`;

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

  if (text && text.trim().length > 0) {
    parts.push({
      text: `Context/Text Payload to Analyze:
"""
${text}
"""
Language for text and recommendations: ${language === 'ur-roman' ? 'Roman Urdu' : 'English'}`
    });
  }

  if (imageDataUrl) {
    const match = imageDataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match) {
      parts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2]
        }
      });
      parts.push({
        text: 'Analyze the screenshot visual content, text, UI elements, brand logos, and message bubbles.'
      });
    }
  }

  if (parts.length === 0) {
    throw new Error('No input text or screenshot provided for analysis.');
  }

  const requestBody = {
    contents: [{ parts }],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    const msg = errBody?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`Firebase AI Logic Error: ${msg}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Firebase AI Logic returned an empty response.');
  }

  let parsed;
  try {
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse structured JSON from AI inference response.');
  }

  const endTime = performance.now();
  const latencyMs = Math.round(endTime - startTime);

  const riskScore = typeof parsed.riskScore === 'number' ? Math.min(100, Math.max(0, parsed.riskScore)) : 50;

  let riskLevel: RiskLevel = parsed.riskLevel || 'Medium';
  if (riskScore >= 75) riskLevel = 'Critical';
  else if (riskScore >= 50) riskLevel = 'High';
  else if (riskScore >= 25) riskLevel = 'Medium';
  else if (riskScore >= 10) riskLevel = 'Low';
  else riskLevel = 'Safe';

  const status: 'safe' | 'suspicious' | 'dangerous' =
    riskScore >= 50 ? 'dangerous' : riskScore >= 25 ? 'suspicious' : 'safe';

  return {
    id: `scan-cloud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    inputText: text,
    hasImage: !!imageDataUrl,
    imageDataUrl: imageDataUrl,
    riskScore,
    riskLevel,
    scamCategory: (parsed.scamCategory as ScamCategory) || 'Phishing Link',
    summary: parsed.summary || 'Deep analysis completed via Firebase AI Logic.',
    redFlags: Array.isArray(parsed.redFlags) ? (parsed.redFlags as RedFlag[]) : [],
    evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 95,
    inferenceEngine: 'Firebase AI Logic (Cloud)',
    latencyMs,
    status,
    language
  };
}
