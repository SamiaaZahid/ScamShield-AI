import React, { useState } from 'react';
import type { ScanResult } from '../../types';
import type { Language } from '../../utils/i18n';
import { translations } from '../../utils/i18n';
import { ThreatReportCard } from '../common/ThreatReportCard';
import { 
  History, 
  Search, 
  Download, 
  FileText, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  X
} from 'lucide-react';
import { exportHistoryAsJson, exportHistoryAsText } from '../../services/storage';

interface HistoryViewProps {
  history: ScanResult[];
  language: Language;
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  selectedInspectScan?: ScanResult | null;
  onClearInspectScan?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  language,
  onDeleteScan,
  onClearHistory,
  selectedInspectScan,
  onClearInspectScan
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'safe' | 'suspicious' | 'dangerous'>('all');
  const [inspectModalScan, setInspectModalScan] = useState<ScanResult | null>(selectedInspectScan || null);

  React.useEffect(() => {
    if (selectedInspectScan) {
      setInspectModalScan(selectedInspectScan);
    }
  }, [selectedInspectScan]);

  const filtered = history.filter((scan) => {
    const term = searchTerm.toLowerCase();
    const textMatch = (scan.inputText || '').toLowerCase().includes(term);
    const catMatch = (scan.scamCategory || '').toLowerCase().includes(term);
    const summaryMatch = (scan.summary || '').toLowerCase().includes(term);
    const matchesSearch = textMatch || catMatch || summaryMatch;

    if (!matchesSearch) return false;

    if (filterLevel === 'safe') return scan.riskLevel === 'Safe' || scan.riskLevel === 'Low';
    if (filterLevel === 'suspicious') return scan.riskLevel === 'Medium';
    if (filterLevel === 'dangerous') return scan.riskLevel === 'High' || scan.riskLevel === 'Critical';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="group cursor-default">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
            <span>{t.historyTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.historySubtitle}
          </p>
        </div>

        {/* Export and Clear buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportHistoryAsJson(history)}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.35)] transition-all duration-200 hover:scale-105 active:scale-98 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer group"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
            <span>{t.exportJson}</span>
          </button>
          <button
            onClick={() => exportHistoryAsText(history)}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-400/50 hover:shadow-[0_0_12px_rgba(79,140,255,0.35)] transition-all duration-200 hover:scale-105 active:scale-98 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer group"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(79,140,255,0.65)]" />
            <span>{t.exportAuditText}</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(t.clearDataConfirm)) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_12px_rgba(239,68,68,0.35)] transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer group"
            >
              <Trash2 className="w-3.5 h-3.5 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.65)]" />
              <span>{t.clearHistory}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:border-slate-700">
        {/* Search */}
        <div className="relative w-full sm:w-80 group">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 transition-all duration-200 group-hover:scale-110 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchHistoryPlaceholder}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:shadow-[0_0_12px_rgba(34,211,238,0.2)]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t.filterAll },
            { id: 'safe', label: t.filterSafe },
            { id: 'suspicious', label: t.filterSuspicious },
            { id: 'dangerous', label: t.filterDangerous }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterLevel(tab.id as 'all' | 'safe' | 'suspicious' | 'dangerous')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer ${
                filterLevel === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-[0_0_10px_rgba(34,211,238,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 border border-slate-800 text-center space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto transition-transform duration-300 hover:scale-110 hover:text-cyan-400" />
          <h4 className="text-sm font-semibold text-slate-300">
            {t.noHistoryYet}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'ur-roman'
              ? 'Nayi jaanch shuru karne ke liye Scan Message ya Screenshot section ka istemal karein.'
              : 'Execute a new scan via Message Scanner or Screenshot Forensics to record audit telemetry.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((scan) => {
            const isDanger = scan.riskLevel === 'Critical' || scan.riskLevel === 'High';
            const isSuspicious = scan.riskLevel === 'Medium';

            return (
              <div
                key={scan.id}
                className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_0_16px_rgba(34,211,238,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110 ${
                    isDanger 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.65)]' 
                      : isSuspicious
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.65)]'
                      : 'bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.65)]'
                  }`}>
                    {isDanger ? <ShieldAlert className="w-5 h-5" /> : isSuspicious ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {scan.scamCategory}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase transition-all duration-200 group-hover:scale-105 ${
                        isDanger 
                          ? 'bg-red-500/20 text-red-300' 
                          : isSuspicious
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-teal-500/20 text-teal-300'
                      }`}>
                        {scan.riskLevel} ({scan.riskScore}/100)
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(scan.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-1">
                      {scan.summary}
                    </p>

                    <p className="text-[11px] font-mono text-slate-500 line-clamp-1">
                      Payload: "{scan.inputText}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => setInspectModalScan(scan)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer group/btn"
                  >
                    <Eye className="w-3.5 h-3.5 transition-all duration-200 group-hover/btn:scale-110 group-hover/btn:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
                    <span>{t.viewDetails}</span>
                  </button>
                  <button
                    onClick={() => onDeleteScan(scan.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.65)] cursor-pointer group/trash"
                    title={t.deleteItem}
                  >
                    <Trash2 className="w-3.5 h-3.5 transition-all duration-200 group-hover/trash:scale-110 group-hover/trash:drop-shadow-[0_0_10px_rgba(239,68,68,0.65)]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Modal */}
      {inspectModalScan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-4xl my-8">
            <button
              onClick={() => {
                setInspectModalScan(null);
                if (onClearInspectScan) onClearInspectScan();
              }}
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white shadow-xl transition-all duration-200 hover:scale-115 hover:border-cyan-400/50 hover:shadow-[0_0_14px_rgba(34,211,238,0.5)] cursor-pointer group"
            >
              <X className="w-5 h-5 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
            </button>
            <ThreatReportCard
              result={inspectModalScan}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};
