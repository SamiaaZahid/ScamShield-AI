import React, { useState, useRef } from 'react';
import type { ScanResult, SettingsConfig } from '../../types';
import type { Language } from '../../utils/i18n';
import { translations } from '../../utils/i18n';
import { ThreatReportCard } from '../common/ThreatReportCard';
import { 
  Upload, 
  Trash2, 
  ScanEye, 
  AlertCircle, 
  Radio, 
  Info
} from 'lucide-react';

interface ScreenshotViewProps {
  settings: SettingsConfig;
  language: Language;
  onScanImage: (imageDataUrl: string, imageName: string, contextText: string) => Promise<ScanResult>;
  onNavigateToSettings: () => void;
}

export const ScreenshotView: React.FC<ScreenshotViewProps> = ({
  settings,
  language,
  onScanImage,
  onNavigateToSettings
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [contextText, setContextText] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasCloudKey = !!(settings.geminiApiKey?.trim() || settings.firebaseApiKey?.trim());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(language === 'ur-roman' ? 'Barae meherbani sirf tasveer (image) file muntakhib karein.' : 'Please select an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(language === 'ur-roman' ? 'Tasveer ka size 10MB se kam hona chahiye.' : 'Image size must be less than 10MB.');
      return;
    }

    setImageName(file.name);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setCurrentResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(language === 'ur-roman' ? 'Barae meherbani sirf tasveer file drag karein.' : 'Please drop an image file (PNG, JPG, WebP).');
      return;
    }

    setImageName(file.name);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setCurrentResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setErrorMsg(language === 'ur-roman' ? 'Barae meherbani jaanch ke liye screenshot upload karein.' : 'Please upload a screenshot to analyze.');
      return;
    }

    setErrorMsg(null);
    setIsScanning(true);
    setCurrentResult(null);

    try {
      const res = await onScanImage(selectedImage, imageName, contextText);
      setCurrentResult(res);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Multi-modal screenshot analysis failed.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageName('');
    setCurrentResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadDemoScreenshot = (scenario: 'bank' | 'job') => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 600, 360);

    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 0, 600, 60);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(scenario === 'bank' ? 'SMS: +92-300-8849201 (HBL Bank Alert)' : 'Telegram: HR_Recruiter_Official', 24, 38);

    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(24, 85, 552, 230, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px sans-serif';

    if (scenario === 'bank') {
      ctx.fillText('URGENT SECURITY ALERT: Your debit card has been locked', 44, 125);
      ctx.fillText('due to abnormal activity from IP 185.220.101.4.', 44, 150);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('Click to unlock: http://hbl-auth-portal.xyz/verify', 44, 185);
      ctx.fillStyle = '#F87171';
      ctx.fillText('Failure to verify in 2 hours will freeze all outgoing funds.', 44, 220);
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('Do not ignore this mandatory message.', 44, 255);
      setImageName('sample_bank_lockout_screenshot.png');
      setContextText('Suspicious SMS screenshot received on mobile banking phone.');
    } else {
      ctx.fillText('Congratulations! You have been shortlisted for Daily Task HR.', 44, 125);
      ctx.fillText('Earn $400 - $800 daily by simply reviewing YouTube videos.', 44, 150);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('Telegram manager: @task_payout_manager', 44, 185);
      ctx.fillStyle = '#FBBF24';
      ctx.fillText('Advance security deposit of $50 required to unlock tasks.', 44, 220);
      setImageName('sample_job_offer_screenshot.png');
      setContextText('WhatsApp recruiter offering remote work requiring advance deposit.');
    }

    const dataUrl = canvas.toDataURL('image/png');
    setSelectedImage(dataUrl);
    setCurrentResult(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner if no cloud key */}
      {!hasCloudKey && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-4 transition-all duration-200 hover:border-amber-400/50">
          <div className="flex items-start gap-3 group">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.65)]" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block">
                {language === 'ur-roman' ? 'Firebase AI Key Zaroori Hai' : 'Firebase AI Logic Required for Vision Forensics'}
              </span>
              <span>
                {language === 'ur-roman'
                  ? 'Screenshots ki multi-modal visual jaanch ke liye Firebase / Gemini API key zaroori hai. Settings mein ja kar key darj karein.'
                  : 'Multi-modal screenshot analysis requires an active Gemini / Firebase AI Logic API key in Settings to inspect visual elements.'}
              </span>
            </div>
          </div>
          <button
            onClick={onNavigateToSettings}
            className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 underline shrink-0 transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            {t.navSettings}
          </button>
        </div>
      )}

      {/* Upload Box Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6 transition-all duration-300 hover:border-slate-700">
        <div className="group cursor-default">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <ScanEye className="w-5 h-5 text-cyan-400 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
            <span>{t.screenshotTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.screenshotSubtitle}
          </p>
        </div>

        {/* Dropzone */}
        {!selectedImage ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-slate-900/40 hover:bg-slate-900/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)] group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_14px_rgba(34,211,238,0.65)] group-hover:border-cyan-400/50 mb-4">
              <Upload className="w-8 h-8 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </div>
            <p className="text-sm font-semibold text-slate-200 text-center transition-colors group-hover:text-cyan-300">
              {t.dropImageHere}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t.supportedFormats}
            </p>

            {/* Quick Demo Pre-loaders */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
              <span className="text-[11px] font-mono text-slate-500 mr-1">
                {language === 'ur-roman' ? 'Ya sample test screenshot load karein:' : 'Or load simulated screenshot:'}
              </span>
              <button
                type="button"
                onClick={() => loadDemoScreenshot('bank')}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.25)] transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer"
              >
                Simulated Bank SMS
              </button>
              <button
                type="button"
                onClick={() => loadDemoScreenshot('job')}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.25)] transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer"
              >
                Simulated Job Offer
              </button>
            </div>
          </div>
        ) : (
          /* Image Selected Preview */
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-2 flex flex-col items-center justify-center max-h-[420px] transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] group">
              <img
                src={selectedImage}
                alt="Selected Screenshot"
                className="max-h-[380px] w-auto object-contain rounded-xl shadow-lg"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/90 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-all duration-200 hover:scale-110 hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] cursor-pointer group/del"
                title={t.removeImage}
              >
                <Trash2 className="w-4 h-4 transition-all duration-200 group-hover/del:scale-110 group-hover/del:drop-shadow-[0_0_10px_rgba(239,68,68,0.65)]" />
              </button>
            </div>

            {/* Context Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">
                {language === 'ur-roman' ? 'Izafi Context (Ikhtiyari):' : 'Additional Context or Message Header (Optional):'}
              </label>
              <input
                type="text"
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                placeholder={language === 'ur-roman' ? 'Maslan: Yeh WhatsApp par anjan number se aya...' : 'e.g. Received via WhatsApp from unfamiliar international number...'}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:shadow-[0_0_14px_rgba(34,211,238,0.2)]"
              />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 transition-transform duration-200 hover:scale-110" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        {selectedImage && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
            <span className="text-xs font-mono text-slate-400 truncate max-w-xs">
              File: {imageName}
            </span>
            <button
              onClick={handleAnalyze}
              disabled={isScanning}
              className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-400/20 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-98 flex items-center gap-2 cursor-pointer group"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>{t.analyzingImageState}</span>
                </>
              ) : (
                <>
                  <ScanEye className="w-4 h-4 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(11,16,32,0.6)]" />
                  <span>{t.analyzeScreenshotBtn}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Loading Radar Animation */}
      {isScanning && (
        <div className="glass-panel rounded-2xl p-12 border border-slate-800 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
            <div className="absolute inset-3 rounded-full border border-cyan-500/30" />
            <div className="absolute inset-6 rounded-full border border-cyan-500/40" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-transparent to-transparent animate-radar" />
            <Radio className="w-8 h-8 text-cyan-400 relative z-10 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white tracking-tight">
              {t.analyzingImageState}
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Extracting OCR text tokens and cross-referencing visual fraud patterns
            </p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {currentResult && !isScanning && (
        <ThreatReportCard
          result={currentResult}
          onNewScan={handleRemoveImage}
          language={language}
        />
      )}
    </div>
  );
};
