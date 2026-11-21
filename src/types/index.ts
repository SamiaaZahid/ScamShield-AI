export type RiskLevel = 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';

export type ScamCategory =
  | 'Phishing Link'
  | 'Fake Job Offer'
  | 'Payment / Wire Fraud'
  | 'Impersonation'
  | 'Tech Support Scam'
  | 'Crypto Giveaway Scam'
  | 'Urgent Account Suspension'
  | 'Lottery / Prize Fraud'
  | 'Malicious Attachment / File'
  | 'Legitimate / Safe';

export interface RedFlag {
  id: string;
  title: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  quote?: string;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  inputText: string;
  hasImage?: boolean;
  imageDataUrl?: string;
  imageName?: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  scamCategory: ScamCategory;
  summary: string;
  redFlags: RedFlag[];
  evidence: string[];
  recommendations: string[];
  confidence: number; // 0 to 100
  inferenceEngine: 'Firebase AI Logic (Cloud)' | 'Chrome Built-in AI (On-Device)' | 'Local Heuristics Engine';
  latencyMs: number;
  status: 'safe' | 'suspicious' | 'dangerous';
  language: 'en' | 'ur-roman';
  analysisDetails?: {
    urgencyDetected: boolean;
    suspiciousLinksDetected: string[];
    financialRequestsDetected: boolean;
    impersonationDetected: boolean;
    credentialsTargeted: boolean;
  };
}

export interface SettingsConfig {
  firebaseApiKey: string;
  firebaseProjectId: string;
  firebaseAppId: string;
  firebaseAuthDomain: string;
  geminiApiKey: string;
  preferredEngine: 'hybrid' | 'cloud' | 'local';
  privacyPreMasking: boolean;
  language: 'en' | 'ur-roman';
  autoSaveHistory: boolean;
}

export interface ScamLibraryItem {
  id: string;
  title: string;
  titleUr: string;
  category: ScamCategory;
  riskLevel: RiskLevel;
  overview: string;
  overviewUr: string;
  tactics: string[];
  tacticsUr: string[];
  realWorldExample: string;
  indicators: string[];
  defenseTips: string[];
  defenseTipsUr: string[];
}
