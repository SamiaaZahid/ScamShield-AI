import React from 'react';
import { Cloud, Cpu, ShieldCheck } from 'lucide-react';

interface EngineStatusBadgeProps {
  engine: 'Firebase AI Logic (Cloud)' | 'Chrome Built-in AI (On-Device)' | 'Local Heuristics Engine';
  latencyMs?: number;
  showLatency?: boolean;
}

export const EngineStatusBadge: React.FC<EngineStatusBadgeProps> = ({
  engine,
  latencyMs,
  showLatency = true
}) => {
  if (engine === 'Firebase AI Logic (Cloud)') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#4F8CFF]/10 text-[#4F8CFF] border border-[#4F8CFF]/30 glow-blue transition-all duration-200 hover:scale-105 hover:shadow-[0_0_12px_rgba(79,140,255,0.4)] group cursor-default">
        <Cloud className="w-3.5 h-3.5 text-[#22D3EE] transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
        <span>Firebase AI Logic (Cloud)</span>
        {showLatency && latencyMs !== undefined && (
          <span className="text-slate-400 font-mono text-[11px] ml-1">
            {latencyMs}ms
          </span>
        )}
      </div>
    );
  }

  if (engine === 'Chrome Built-in AI (On-Device)') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#7C5CFF]/10 text-[#7C5CFF] border border-[#7C5CFF]/30 glow-violet transition-all duration-200 hover:scale-105 hover:shadow-[0_0_12px_rgba(124,92,255,0.4)] group cursor-default">
        <Cpu className="w-3.5 h-3.5 text-[#22D3EE] transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
        <span>On-Device (Chrome AI)</span>
        {showLatency && latencyMs !== undefined && (
          <span className="text-slate-400 font-mono text-[11px] ml-1">
            {latencyMs}ms
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 glow-teal transition-all duration-200 hover:scale-105 hover:shadow-[0_0_12px_rgba(45,212,191,0.4)] group cursor-default">
      <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF] transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.65)]" />
      <span>Local Heuristics Shield</span>
      {showLatency && latencyMs !== undefined && (
        <span className="text-slate-400 font-mono text-[11px] ml-1">
          {latencyMs}ms
        </span>
      )}
    </div>
  );
};
