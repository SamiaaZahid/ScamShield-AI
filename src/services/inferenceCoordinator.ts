import type { ScanResult, SettingsConfig } from '../types';
import { scrubPii } from './privacyPreScrubber';
import { analyzeLocally } from './localHeuristicEngine';
import { analyzeWithChromeAi, checkChromeAiAvailability } from './chromeAiEngine';
import { analyzeWithFirebaseAi, type FirebaseAiCredentials } from './firebaseAiEngine';

export interface ScanRequest {
  text: string;
  imageDataUrl?: string;
  imageName?: string;
  settings: SettingsConfig;
  forceEngine?: 'hybrid' | 'cloud' | 'local';
}

export async function coordinateScan(request: ScanRequest): Promise<{
  result: ScanResult;
  piiRedactedCount: number;
  engineUsed: 'Firebase AI Logic (Cloud)' | 'Chrome Built-in AI (On-Device)' | 'Local Heuristics Engine';
  cloudFallbackReason?: string;
}> {
  const { text, imageDataUrl, imageName, settings, forceEngine } = request;
  const engineMode = forceEngine || settings.preferredEngine || 'hybrid';
  const language = settings.language || 'en';

  let processedText = text || '';
  let piiRedactedCount = 0;

  // 1. Privacy Pre-Scrubbing if enabled
  if (settings.privacyPreMasking && processedText.trim().length > 0) {
    const scrub = scrubPii(processedText);
    processedText = scrub.scrubbedText;
    piiRedactedCount = scrub.itemsRedactedCount;
  }

  // 2. If user explicitly chooses Local Only (or no image and no cloud key)
  if (engineMode === 'local' && !imageDataUrl) {
    const localResult = analyzeLocally(processedText, language);
    return {
      result: localResult,
      piiRedactedCount,
      engineUsed: 'Local Heuristics Engine'
    };
  }

  // 3. Try Firebase AI Logic (Cloud) if key is provided
  const hasCloudKey = !!(settings.geminiApiKey?.trim() || settings.firebaseApiKey?.trim());
  const effectiveCloudKey = (settings.geminiApiKey?.trim() || settings.firebaseApiKey?.trim()) ?? '';

  if (hasCloudKey) {
    const creds: FirebaseAiCredentials = {
      apiKey: effectiveCloudKey,
      projectId: settings.firebaseProjectId?.trim(),
      appId: settings.firebaseAppId?.trim(),
      authDomain: settings.firebaseAuthDomain?.trim(),
      storageBucket: settings.firebaseStorageBucket?.trim(),
      messagingSenderId: settings.firebaseMessagingSenderId?.trim(),
      appCheckDebugToken: settings.firebaseAppCheckDebugToken?.trim()
    };

    try {
      const cloudResult = await analyzeWithFirebaseAi(
        processedText,
        imageDataUrl,
        creds,
        language,
        engineMode
      );
      if (imageName) {
        cloudResult.imageName = imageName;
      }
      return {
        result: cloudResult,
        piiRedactedCount,
        engineUsed: 'Firebase AI Logic (Cloud)'
      };
    } catch (cloudErr) {
      console.warn('Firebase AI Logic failed, falling back to local analysis:', cloudErr);
      const fallbackReason = cloudErr instanceof Error ? cloudErr.message : 'Cloud AI unavailable';
      
      // Fall back to local
      const fallbackLocal = analyzeLocally(processedText, language);
      if (imageDataUrl) {
        fallbackLocal.hasImage = true;
        fallbackLocal.imageDataUrl = imageDataUrl;
        fallbackLocal.imageName = imageName;
        fallbackLocal.summary += language === 'ur-roman'
          ? ' (Tasveer ki AI jaanch ke liye Firebase key ki zaroorat hai).'
          : ' (Screenshot vision analysis requires operational Firebase AI Logic connection).';
      }
      return {
        result: fallbackLocal,
        piiRedactedCount,
        engineUsed: 'Local Heuristics Engine',
        cloudFallbackReason: fallbackReason
      };
    }
  }

  // 4. If in Hybrid mode and no cloud key, try On-Device Chrome AI
  if (engineMode === 'hybrid' && !imageDataUrl) {
    const chromeCaps = await checkChromeAiAvailability();
    if (chromeCaps.available) {
      const chromeResult = await analyzeWithChromeAi(processedText, language);
      if (chromeResult) {
        return {
          result: chromeResult,
          piiRedactedCount,
          engineUsed: 'Chrome Built-in AI (On-Device)'
        };
      }
    }
  }

  // 5. Default Fallback: Local Heuristics Engine
  const localResult = analyzeLocally(processedText, language);
  if (imageDataUrl) {
    localResult.hasImage = true;
    localResult.imageDataUrl = imageDataUrl;
    localResult.imageName = imageName;
    localResult.summary += language === 'ur-roman'
      ? ' (Cloud AI key darj na hone ki wajah se local heuristics engine ne text ka tajziya kiya).'
      : ' (Cloud AI API key is not yet configured. Local heuristics evaluated provided context).';
  }

  return {
    result: localResult,
    piiRedactedCount,
    engineUsed: 'Local Heuristics Engine',
    cloudFallbackReason: !hasCloudKey ? 'No Firebase / Gemini API Key configured in Settings' : undefined
  };
}
