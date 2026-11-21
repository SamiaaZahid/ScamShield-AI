import React, { useState } from 'react';
import type { SettingsConfig } from '../../types';
import type { Language } from '../../utils/i18n';
import { translations } from '../../utils/i18n';
import { testFirebaseConnection } from '../../services/firebaseAiEngine';
import { 
  Settings, 
  Key, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  Cloud, 
  Trash2, 
  Check, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Zap, 
  Activity,
  Layers
} from 'lucide-react';

interface SettingsViewProps {
  settings: SettingsConfig;
  language: Language;
  onUpdateSettings: (newSettings: SettingsConfig) => void;
  onClearHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  language,
  onUpdateSettings,
  onClearHistory
}) => {
  const t = translations[language];

  const [formData, setFormData] = useState<SettingsConfig>({ ...settings });
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<{ testing: boolean; success?: boolean; message?: string }>({
    testing: false
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    const key = formData.geminiApiKey || formData.firebaseApiKey;
    if (!key) {
      setTestStatus({
        testing: false,
        success: false,
        message: language === 'ur-roman' ? 'Pehle API Key darj karein.' : 'Please enter an API Key to test.'
      });
      return;
    }

    setTestStatus({ testing: true });
    const res = await testFirebaseConnection(key);
    setTestStatus({
      testing: false,
      success: res.success,
      message: res.message
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Top Header */}
      <div>
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>{t.settingsTitle}</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {t.settingsSubtitle}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: AI Inference Configuration */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'ur-roman' ? 'Firebase AI Logic Aur Cloud Configuration' : 'Firebase AI Logic & Cloud Pipeline'}
            </h4>
          </div>

          {/* Engine Routing Mode */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-semibold block">
              {t.engineConfigLabel}
            </label>
            <p className="text-xs text-slate-400">
              {t.engineConfigDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[
                { id: 'hybrid', label: 'Hybrid Auto', desc: 'On-device / Chrome AI + Firebase Cloud' },
                { id: 'cloud', label: 'Cloud Only', desc: 'Firebase Vertex AI / Gemini 2.0' },
                { id: 'local', label: 'Local Only', desc: '100% On-device privacy heuristics' }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setFormData({ ...formData, preferredEngine: m.id as 'hybrid' | 'cloud' | 'local' })}
                  className={`p-3 rounded-xl border text-left transition ${
                    formData.preferredEngine === m.id
                      ? 'bg-cyan-500/15 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold block">{m.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                {t.geminiApiKeyLabel}
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Client-side encrypted
              </span>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={formData.geminiApiKey || formData.firebaseApiKey}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    geminiApiKey: e.target.value,
                    firebaseApiKey: e.target.value
                  });
                }}
                placeholder="AIzaSy..."
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {t.geminiApiKeyDesc}
            </p>
          </div>

          {/* Optional Project ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                {t.firebaseProjectIdLabel} (Optional)
              </label>
              <input
                type="text"
                value={formData.firebaseProjectId}
                onChange={(e) => setFormData({ ...formData, firebaseProjectId: e.target.value })}
                placeholder="scamshield-hackathon"
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                {t.firebaseAppIdLabel} (Optional)
              </label>
              <input
                type="text"
                value={formData.firebaseAppId}
                onChange={(e) => setFormData({ ...formData, firebaseAppId: e.target.value })}
                placeholder="1:1234567890:web:abcdef"
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition font-mono"
              />
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus.testing}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{testStatus.testing ? t.connectionTesting : t.testConnectionBtn}</span>
            </button>

            {testStatus.message && (
              <div className={`p-2 rounded-lg text-xs font-mono flex items-center gap-2 ${
                testStatus.success ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'
              }`}>
                {testStatus.success ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{testStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Localization */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.languageSelectLabel}
            </h4>
          </div>
          <p className="text-xs text-slate-400">
            {t.languageSelectDesc}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, language: 'en' })}
              className={`p-3 rounded-xl border text-left transition ${
                formData.language === 'en'
                  ? 'bg-cyan-500/15 border-cyan-400/50 text-white font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs block">English (Standard)</span>
              <span className="text-[10px] text-slate-500">Universal cyber intelligence interface</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, language: 'ur-roman' })}
              className={`p-3 rounded-xl border text-left transition ${
                formData.language === 'ur-roman'
                  ? 'bg-cyan-500/15 border-cyan-400/50 text-white font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs block">Roman Urdu</span>
              <span className="text-[10px] text-slate-500">Pakistani and South Asian localization</span>
            </button>
          </div>
        </div>

        {/* Section 3: Privacy & Data Confidentiality */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Lock className="w-4 h-4 text-teal-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.privacySectionTitle}
            </h4>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white block">
                {t.privacyPreMaskingLabel}
              </span>
              <span className="text-xs text-slate-400 block">
                {t.privacyPreMaskingDesc}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, privacyPreMasking: !formData.privacyPreMasking })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                formData.privacyPreMasking ? 'bg-teal-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.privacyPreMasking ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4">
          <div>
            {saveSuccess && (
              <span className="text-xs font-mono text-teal-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                {t.settingsSavedNotice}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-400/25 transition cursor-pointer"
          >
            {t.saveSettingsBtn}
          </button>
        </div>
      </form>

      {/* Section 4: Data Management & Cache Purge */}
      <div className="glass-panel rounded-2xl p-6 border border-red-900/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-red-400">
              {language === 'ur-roman' ? 'Khatarnaak Zone: Cache Aur Record Purge' : 'Local Storage & Data Wipe'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Permanently purges all locally persisted scan logs and cached reports from this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t.clearDataConfirm)) {
                onClearHistory();
              }
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.clearAllDataBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
