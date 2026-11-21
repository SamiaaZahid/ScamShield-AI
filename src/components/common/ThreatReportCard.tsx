import React, { useState } from 'react';
import type { ScanResult } from '../../types';
import { RiskGauge } from './RiskGauge';
import { EngineStatusBadge } from './EngineStatusBadge';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Copy, 
  Check, 
  Terminal, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface ThreatReportCardProps {
  result: ScanResult;
  onNewScan?: () => void;
  language?: 'en' | 'ur-roman';
}

export const ThreatReportCard: React.FC<ThreatReportCardProps> = ({
  result,
  onNewScan,
  language = 'en'
}) => {
  const [copied, setCopied] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);

  const copyAdvisory = () => {
    let advisory = `--- SCAMSHIELD AI THREAT REPORT ---\n`;
    advisory += `Threat Index: ${result.riskScore}/100 (${result.riskLevel} Risk)\n`;
    advisory += `Category: ${result.scamCategory}\n`;
    advisory += `Engine: ${result.inferenceEngine}\n`;
    advisory += `Summary: ${result.summary}\n\n`;
    if (result.redFlags.length > 0) {
      advisory += `Red Flags Detected:\n`;
      result.redFlags.forEach((rf, i) => {
        advisory += `${i + 1}. [${rf.severity.toUpperCase()}] ${rf.title}: ${rf.explanation}\n`;
      });
      advisory += `\n`;
    }
    if (result.recommendations.length > 0) {
      advisory += `Safety Recommendations:\n`;
      result.recommendations.forEach((rec, i) => {
        advisory += `${i + 1}. ${rec}\n`;
      });
    }
    advisory += `-----------------------------------`;

    navigator.clipboard.writeText(advisory).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const isSafe = result.riskLevel === 'Safe' || result.riskLevel === 'Low';
  const isCritical = result.riskLevel === 'Critical';

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-slate-700">
      {/* Top Banner Accent Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: isSafe 
            ? 'linear-gradient(90deg, #2DD4BF, #4F8CFF)' 
            : isCritical 
            ? 'linear-gradient(90deg, #EF4444, #F59E0B)' 
            : 'linear-gradient(90deg, #F59E0B, #22D3EE)'
        }}
      />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3 group cursor-default">
          <div className={`p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110 ${
            isSafe 
              ? 'bg-teal-500/10 border-teal-500/30 text-teal-400 group-hover:drop-shadow-[0_0_12px_rgba(45,212,191,0.65)]' 
              : 'bg-red-500/10 border-red-500/30 text-red-400 group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.65)]'
          }`}>
            {isSafe ? (
              <ShieldCheck className="w-6 h-6 transition-all duration-200 group-hover:scale-110" />
            ) : (
              <ShieldAlert className="w-6 h-6 transition-all duration-200 group-hover:scale-110" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {result.scamCategory}
              </h3>
              <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded uppercase border transition-all duration-200 hover:scale-105 ${
                isSafe 
                  ? 'bg-teal-500/10 text-teal-300 border-teal-500/30 hover:shadow-[0_0_8px_rgba(45,212,191,0.3)]' 
                  : 'bg-red-500/10 text-red-300 border-red-500/30 hover:shadow-[0_0_8px_rgba(239,68,68,0.3)]'
              }`}>
                {result.riskLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ID: {result.id} | {new Date(result.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <EngineStatusBadge engine={result.inferenceEngine} latencyMs={result.latencyMs} />
          <button
            onClick={copyAdvisory}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-all duration-200 hover:scale-105 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.35)] cursor-pointer group"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-teal-400 transition-all duration-200 scale-110 drop-shadow-[0_0_8px_#2DD4BF]" />
            ) : (
              <Copy className="w-3.5 h-3.5 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
            )}
            <span>{copied ? (language === 'ur-roman' ? 'Copy Ho Gaya' : 'Copied') : (language === 'ur-roman' ? 'Advisory Copy Karein' : 'Copy Advisory')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Score Gauge & Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        {/* Left: Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          <RiskGauge score={result.riskScore} level={result.riskLevel} size={190} />
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-400 font-mono">
            <span>Confidence: <strong className="text-slate-200">{result.confidence}%</strong></span>
            <span>Latency: <strong className="text-slate-200">{result.latencyMs}ms</strong></span>
          </div>
        </div>

        {/* Right: Summary and Context */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 transition-all duration-200 hover:border-slate-700">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5 group cursor-default">
              <FileText className="w-3.5 h-3.5 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
              <span>{language === 'ur-roman' ? 'Executive Khulasa' : 'Executive Threat Assessment'}</span>
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {result.summary}
            </p>
          </div>

          {/* Analyzed Text Snippet Preview */}
          {result.inputText && (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-xs text-slate-400 transition-all duration-200 hover:border-slate-700">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>{language === 'ur-roman' ? 'Jaanch Shuda Payload' : 'Evaluated Text Payload'}</span>
                {result.hasImage && <span className="text-cyan-400 font-semibold">Multi-Modal Vision Active</span>}
              </div>
              <p className="line-clamp-2 text-slate-300">
                "{result.inputText}"
              </p>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-center transition-all duration-200 hover:border-cyan-500/30 hover:scale-[1.02]">
              <span className="text-[11px] text-slate-400 block">{language === 'ur-roman' ? 'Mashkook Nishaniyan' : 'Red Flags'}</span>
              <span className="text-lg font-bold font-mono text-white">{result.redFlags.length}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-center transition-all duration-200 hover:border-cyan-500/30 hover:scale-[1.02]">
              <span className="text-[11px] text-slate-400 block">{language === 'ur-roman' ? 'Saboot' : 'Evidence Extracted'}</span>
              <span className="text-lg font-bold font-mono text-white">{result.evidence.length}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-center transition-all duration-200 hover:border-cyan-500/30 hover:scale-[1.02]">
              <span className="text-[11px] text-slate-400 block">{language === 'ur-roman' ? 'Hifazati Hidayat' : 'Safety Actions'}</span>
              <span className="text-lg font-bold font-mono text-white">{result.recommendations.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags Section */}
      {result.redFlags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-2 group cursor-default">
            <AlertTriangle className="w-4 h-4 text-amber-400 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.65)]" />
            <span>{language === 'ur-roman' ? 'Daryaft Shuda Khatarnaak Nishaniyan (Red Flags)' : 'Identified Red Flags & Deception Markers'}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.redFlags.map((flag) => (
              <div 
                key={flag.id} 
                className={`p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                  flag.severity === 'critical'
                    ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                    : flag.severity === 'high'
                    ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50 hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                    {flag.title}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    flag.severity === 'critical'
                      ? 'bg-red-500/20 text-red-400'
                      : flag.severity === 'high'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {flag.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {flag.explanation}
                </p>
                {flag.quote && (
                  <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded border border-slate-800/80">
                    Quote: <span className="text-cyan-300 font-sans">"{flag.quote}"</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Recommendations Section */}
      {result.recommendations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-2 group cursor-default">
            <Lock className="w-4 h-4 text-teal-400 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.65)]" />
            <span>{language === 'ur-roman' ? 'Hifazati Hidayat Aur Mashwaray' : 'Actionable Safety Protocols'}</span>
          </h4>
          <div className="space-y-2">
            {result.recommendations.map((rec, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80 group cursor-default"
              >
                <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110 group-hover:translate-x-0.5 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Telemetry Drawer Toggle & New Scan Button */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => setShowTelemetry(!showTelemetry)}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-all duration-200 group cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400 transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
          <span>{showTelemetry ? 'Hide Engine Telemetry' : 'View Deep Forensics & Raw Telemetry'}</span>
          {showTelemetry ? (
            <ChevronUp className="w-3.5 h-3.5 transition-all duration-200 group-hover:scale-110" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 transition-all duration-200 group-hover:scale-110" />
          )}
        </button>

        {onNewScan && (
          <button
            onClick={onNewScan}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-lg hover:shadow-[0_0_16px_rgba(34,211,238,0.4)] transition-all duration-200 hover:scale-105 active:scale-98 cursor-pointer"
          >
            {language === 'ur-roman' ? 'Nayi Jaanch Karein' : 'New Scan'}
          </button>
        )}
      </div>

      {/* Deep Telemetry Details */}
      {showTelemetry && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <span>Cryptographic Session: {result.id}</span>
            <span>Source: {result.inferenceEngine}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">Risk Score:</span>
              <span className="text-white font-bold">{result.riskScore} / 100</span>
            </div>
            <div>
              <span className="text-slate-500 block">Inference Speed:</span>
              <span className="text-white font-bold">{result.latencyMs} ms</span>
            </div>
            <div>
              <span className="text-slate-500 block">Confidence Metric:</span>
              <span className="text-white font-bold">{result.confidence}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Language Target:</span>
              <span className="text-white font-bold">{result.language}</span>
            </div>
          </div>
          {result.evidence.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-500 block text-[11px] mb-1">Extracted Evidence Tokens:</span>
              <div className="flex flex-wrap gap-1.5">
                {result.evidence.map((ev, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] transition-all duration-200 hover:border-cyan-400/40 hover:text-cyan-200 border border-transparent">
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
