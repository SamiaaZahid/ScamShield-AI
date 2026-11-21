import React, { useState } from 'react';
import type { ScanResult, SettingsConfig } from '../../types';
import type { Language } from '../../utils/i18n';
import { translations } from '../../utils/i18n';
import { ThreatReportCard } from '../common/ThreatReportCard';
import { 
  ShieldAlert, 
  Search, 
  Trash2, 
  Clipboard, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  Radio, 
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

interface ScanMessageViewProps {
  settings: SettingsConfig;
  language: Language;
  onScan: (text: string) => Promise<ScanResult>;
  initialText?: string;
  onResetInitialText?: () => void;
  onNavigateToSettings: () => void;
}

export const ScanMessageView: React.FC<ScanMessageViewProps> = ({
  settings,
  language,
  onScan,
  initialText = '',
  onResetInitialText,
  onNavigateToSettings
}) => {
  const t = translations[language];
  const [inputText, setInputText] = useState(initialText);
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When initialText changes from quick scan, set it
  React.useEffect(() => {
    if (initialText) {
      setInputText(initialText);
      if (onResetInitialText) onResetInitialText();
    }
  }, [initialText, onResetInitialText]);

  const hasCloudKey = !!(settings.geminiApiKey?.trim() || settings.firebaseApiKey?.trim());

  const sampleScams = [
    {
      label: t.sampleBankOtp,
      text: 'Urgent Security Notice: Unauthorized debit attempt of $1,250.00 flagged on your account. To prevent permanent suspension, verify your account immediately at http://secure-hbl-online.xyz/login within 1 hour or share OTP code 849201 to cancel.'
    },
    {
      label: t.sampleWhatsAppPrize,
      text: language === 'ur-roman'
        ? 'Mubarak ho! Aap ka Benazir Income Support Program aur Jeeto Pakistan mein 50,000 rupay ka inam nikla hai. Abhi rabta karein aur apna inam lene ke liye registration fees 2000 rupay JazzCash account par transfer karein.'
        : 'Congratulations! Your mobile number has won $250,000 in the International Mobile Rewards Draw. To claim your bank transfer cheque, contact officer via WhatsApp and deposit $150 clearance fee.'
    },
    {
      label: t.sampleFakeJob,
      text: 'Hello! I am Emma from Global Freelance HR. We have urgent remote positions rating hotel listings. Earn $300 to $600 daily. No prior experience needed. Contact our recruitment manager on Telegram @daily_task_payout to start immediately.'
    },
    {
      label: t.sampleCeoFraud,
      text: 'Are you at your desk right now? I am in a confidential board meeting and cannot take calls. I need you to purchase 4 Apple gift cards ($100 each) for an emergency client giveaway and email the pin codes directly to me ASAP.'
    }
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMsg(language === 'ur-roman' ? 'Barae meherbani jaanch ke liye paigham darj karein.' : 'Please enter message content to analyze.');
      return;
    }

    setErrorMsg(null);
    setIsScanning(true);
    setCurrentResult(null);

    try {
      const res = await onScan(inputText.trim());
      setCurrentResult(res);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Analysis failed. Please check inputs.');
    } finally {
      setIsScanning(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setErrorMsg(null);
      }
    } catch {
      // clipboard access denied, ignore
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner Notice if no cloud key configured */}
      {!hasCloudKey && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block">
                {language === 'ur-roman' ? 'Local Heuristics Engine Fa\'al Hai' : 'Local Heuristics Mode Active'}
              </span>
              <span>
                {language === 'ur-roman'
                  ? 'Aap ka data 100% browser mein hi rehta hai. Gehri Firebase AI Logic aur Gemini multi-modal jaanch ke liye Settings mein API Key darj karein.'
                  : 'Your messages are pre-filtered 100% client-side with zero data leaks. To activate deep multi-modal Firebase AI Logic, configure your API credentials in Settings.'}
              </span>
            </div>
          </div>
          <button
            onClick={onNavigateToSettings}
            className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 underline shrink-0"
          >
            {t.navSettings}
          </button>
        </div>
      )}

      {/* Main Input Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span>{t.scanMessageTitle}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.scanMessageSubtitle}
            </p>
          </div>

          <button
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
          >
            <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.pasteFromClipboard}</span>
          </button>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder={t.enterMessagePlaceholder}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition font-sans resize-y leading-relaxed"
          />
          {inputText && (
            <button
              onClick={() => {
                setInputText('');
                setCurrentResult(null);
              }}
              className="absolute right-3 bottom-3 p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800/80 transition"
              title={t.clearBtn}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sample Attack Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            {t.sampleScamsLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleScams.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sample.text);
                  setCurrentResult(null);
                  setErrorMsg(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            {settings.privacyPreMasking && (
              <span className="text-teal-400">Client-Side PII Masking: Active</span>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isScanning || !inputText.trim()}
            className={`px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all ${
              isScanning || !inputText.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'text-slate-900 bg-cyan-400 hover:bg-cyan-300 shadow-cyan-400/20 hover:shadow-cyan-400/40 cursor-pointer'
            }`}
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>{t.analyzingState}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>{t.analyzeNowBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Radar Animation State */}
      {isScanning && (
        <div className="glass-panel rounded-2xl p-12 border border-slate-800 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Concentric Radar Rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
            <div className="absolute inset-3 rounded-full border border-cyan-500/30" />
            <div className="absolute inset-6 rounded-full border border-cyan-500/40" />
            {/* Rotating Beam */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-transparent to-transparent animate-radar" />
            <Radio className="w-8 h-8 text-cyan-400 relative z-10 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white tracking-tight">
              {t.analyzingState}
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              {t.analyzingSubtext}
            </p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {currentResult && !isScanning && (
        <ThreatReportCard
          result={currentResult}
          onNewScan={() => {
            setInputText('');
            setCurrentResult(null);
          }}
          language={language}
        />
      )}
    </div>
  );
};
