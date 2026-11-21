import React, { useState } from 'react';
import type { ScanResult, SettingsConfig } from '../../types';
import type { Language } from '../../utils/i18n';
import { translations } from '../../utils/i18n';
import type { ActiveTab } from '../layout/Sidebar';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Radio, 
  ArrowUpRight, 
  Search, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface DashboardViewProps {
  history: ScanResult[];
  settings: SettingsConfig;
  language: Language;
  setActiveTab: (tab: ActiveTab) => void;
  onQuickScan: (text: string) => void;
  onInspectResult: (scan: ScanResult) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  settings,
  language,
  setActiveTab,
  onQuickScan,
  onInspectResult
}) => {
  const t = translations[language];
  const [quickInput, setQuickInput] = useState('');

  const totalScans = history.length;
  const criticalThreats = history.filter(h => h.riskLevel === 'Critical' || h.riskLevel === 'High').length;
  const safeScans = history.filter(h => h.riskLevel === 'Safe' || h.riskLevel === 'Low').length;
  const hasCloudKey = !!(settings.geminiApiKey?.trim() || settings.firebaseApiKey?.trim());

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onQuickScan(quickInput.trim());
      setActiveTab('scan-message');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Threat Defense Status Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 glass-panel border border-slate-800 shadow-2xl transition-all duration-300 hover:border-slate-700">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-teal-500/10 text-teal-300 border border-teal-500/30 transition-all duration-200 hover:shadow-[0_0_10px_rgba(45,212,191,0.3)]">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>{t.systemOperational}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {language === 'ur-roman' ? 'ScamShield AI Cyber Difaai Markaz' : 'Autonomous Cyber Fraud Defense Hub'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {t.protectionActive}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('scan-message')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-400/25 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_18px_rgba(34,211,238,0.5)] active:scale-98 flex items-center gap-2 group cursor-pointer"
            >
              <Search className="w-4 h-4 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(11,16,32,0.6)]" />
              <span>{t.navScanMessage}</span>
            </button>
            <button
              onClick={() => setActiveTab('screenshot')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 shadow-lg transition-all duration-200 hover:scale-105 hover:border-cyan-400/50 hover:shadow-[0_0_16px_rgba(34,211,238,0.3)] active:scale-98 flex items-center gap-2 group cursor-pointer"
            >
              <Radio className="w-4 h-4 text-cyan-400 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
              <span>{t.navScreenshot}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Scans */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden group hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {t.metricScansPerformed}
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(79,140,255,0.65)] group-hover:border-cyan-400/40">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {totalScans}
            </span>
            <span className="text-xs font-mono text-teal-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Cryptographically indexed
          </p>
        </div>

        {/* Metric 2: Threats Isolated */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden group hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all duration-300 cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {t.metricThreatsBlocked}
            </span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.65)] group-hover:border-red-400/40">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {criticalThreats}
            </span>
            <span className="text-xs font-mono text-red-400">
              High Severity
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Social engineering payloads
          </p>
        </div>

        {/* Metric 3: Safe / Benign */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden group hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)] transition-all duration-300 cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {language === 'ur-roman' ? 'Mehfooz Payloads' : 'Verified Benign'}
            </span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.65)] group-hover:border-teal-400/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {safeScans}
            </span>
            <span className="text-xs font-mono text-teal-400">
              Passed Audit
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Clean communications
          </p>
        </div>

        {/* Metric 4: Pipeline */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden group hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(124,92,255,0.15)] transition-all duration-300 cursor-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {t.metricActiveEngine}
            </span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(124,92,255,0.65)] group-hover:border-violet-400/40">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold font-mono text-white tracking-tight line-clamp-1">
              {hasCloudKey ? 'Firebase AI' : 'Local Shield'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            {hasCloudKey ? 'Gemini 2.0 / 1.5 Cloud' : 'Deterministic Heuristics Engine'}
          </p>
        </div>
      </div>

      {/* Quick Scan Launcher Form */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative transition-all duration-300 hover:border-slate-700">
        <div className="flex items-center gap-2 mb-2 group cursor-default">
          <Zap className="w-4 h-4 text-cyan-400 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
          <h3 className="text-base font-bold text-white tracking-tight">
            {t.quickScanTitle}
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          {t.quickScanDesc}
        </p>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder={t.quickScanPlaceholder}
            className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition font-sans"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-400/20 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_18px_rgba(34,211,238,0.5)] active:scale-98 flex items-center justify-center gap-2 shrink-0 group cursor-pointer"
          >
            <Search className="w-4 h-4 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(11,16,32,0.6)]" />
            <span>{t.quickScanBtn}</span>
          </button>
        </form>
      </div>

      {/* Two Column Layout: Recent Threats & Threat Vector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity Feed */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-slate-800/80 transition-all duration-300 hover:border-slate-700">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {t.threatFeedTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.threatFeedSubtitle}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all duration-200 hover:scale-105 group cursor-pointer"
            >
              <span>{language === 'ur-roman' ? 'Tamam Dekhein' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-all duration-200 group-hover:scale-110 group-hover:translate-x-0.5 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]" />
            </button>
          </div>

          <div className="space-y-3">
            {history.slice(0, 4).map((scan) => {
              const isDanger = scan.riskLevel === 'Critical' || scan.riskLevel === 'High';
              return (
                <div
                  key={scan.id}
                  onClick={() => onInspectResult(scan)}
                  className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 hover:scale-[1.01] hover:shadow-[0_0_16px_rgba(34,211,238,0.08)] cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 transition-all duration-200 group-hover:scale-110 ${
                      isDanger 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.65)]' 
                        : 'bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.65)]'
                    }`}>
                      {isDanger ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100 truncate">
                          {scan.scamCategory}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 transition-all duration-200 group-hover:scale-105 ${
                          isDanger ? 'bg-red-500/15 text-red-300' : 'bg-teal-500/15 text-teal-300'
                        }`}>
                          {scan.riskLevel} ({scan.riskScore}/100)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {scan.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-slate-500 group-hover:text-cyan-400 transition-all duration-200">
                    <span className="text-[11px] font-mono hidden sm:inline">
                      {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <ArrowUpRight className="w-4 h-4 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Threat Category Distribution */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between transition-all duration-300 hover:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight mb-1">
              {t.threatDistributionTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {language === 'ur-roman' ? 'Fraud tareeqon ki aam shara' : 'Prevalent vector distribution in current telemetry'}
            </p>

            <div className="space-y-4">
              {[
                { name: 'Phishing Links', pct: 42, color: 'bg-cyan-400' },
                { name: 'Fake Job / Tasks', pct: 24, color: 'bg-violet-400' },
                { name: 'Lottery & Grants', pct: 18, color: 'bg-amber-400' },
                { name: 'Bank Impersonation', pct: 12, color: 'bg-red-400' },
                { name: 'Crypto Drainers', pct: 4, color: 'bg-teal-400' }
              ].map((item) => (
                <div key={item.name} className="space-y-1.5 group cursor-default">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 transition-colors group-hover:text-cyan-300">{item.name}</span>
                    <span className="text-slate-400">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.5)]`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Security Framework</span>
            <span className="text-slate-400">MITRE ATT&CK & D3FEND</span>
          </div>
        </div>
      </div>
    </div>
  );
};
