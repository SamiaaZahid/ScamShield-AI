import React from 'react';
import { Cloud, Cpu, ShieldCheck, Zap } from 'lucide-react';

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
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#4F8CFF]/10 text-[#4F8CFF] border border-[#4F8CFF]/30 glow-blue">
        <Cloud className="w-3.5 h-3.5 text-[#22D3EE]" />
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
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#7C5CFF]/10 text-[#7C5CFF] border border-[#7C5CFF]/30 glow-violet">
        <Cpu className="w-3.5 h-3.5 text-[#22D3EE]" />
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
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 glow-teal">
      <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
      <span>Local Heuristics Shield</span>
      {showLatency && latencyMs !== undefined && (
        <span className="text-slate-400 font-mono text-[11px] ml-1">
          {latencyMs}ms
        </span>
      )}
    </div>
  );
};
