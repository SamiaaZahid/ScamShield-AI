import React from 'react';
import type { RiskLevel } from '../../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
  label?: string;
  showSubtitle?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  size = 180,
  label = 'Threat Score',
  showSubtitle = true
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc for gauge look
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#2DD4BF'; // Teal (Safe)
  let glowColor = 'rgba(45, 212, 191, 0.4)';
  let bgBadge = 'bg-teal-500/10 text-teal-400 border-teal-500/30';

  if (level === 'Critical') {
    strokeColor = '#EF4444'; // Error
    glowColor = 'rgba(239, 68, 68, 0.4)';
    bgBadge = 'bg-red-500/10 text-red-400 border-red-500/30';
  } else if (level === 'High') {
    strokeColor = '#F59E0B'; // Warning / Amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
    bgBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (level === 'Medium') {
    strokeColor = '#F59E0B'; // Warning
    glowColor = 'rgba(245, 158, 11, 0.3)';
    bgBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (level === 'Low') {
    strokeColor = '#4F8CFF'; // Blue
    glowColor = 'rgba(79, 140, 255, 0.3)';
    bgBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Gauge Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {score}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-400 mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${bgBadge}`}>
            {level} Risk
          </span>
        </div>
      )}
    </div>
  );
};
