import React from 'react';
import { Globe, ShieldCheck, Lock, Activity, Sparkles } from 'lucide-react';
import type { Language } from '../../utils/i18n';
import { translations } from '../../utils/i18n';

interface HeaderProps {
  title: string;
  subtitle: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  privacyEnabled: boolean;
  hasCloudKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  language,
  setLanguage,
  privacyEnabled,
  hasCloudKey
}) => {
  const t = translations[language];

  return (
    <header className="h-20 border-b border-slate-800/80 bg-[#0B1020]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          {title}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
          {subtitle}
        </p>
      </div>

      {/* Header Actions / Badges */}
      <div className="flex items-center gap-3">
        {/* Privacy Shield Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${
          privacyEnabled 
            ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' 
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          <Lock className="w-3.5 h-3.5" />
          <span>{privacyEnabled ? 'Privacy-First: Active' : 'Privacy-First: Off'}</span>
        </div>

        {/* Engine Pipeline Badge */}
        <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${
          hasCloudKey
            ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
            : 'bg-slate-800/80 text-slate-300 border-slate-700'
        }`}>
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{hasCloudKey ? 'Firebase AI Logic' : 'Deterministic Heuristics'}</span>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              language === 'en'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </button>
          <button
            onClick={() => setLanguage('ur-roman')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              language === 'ur-roman'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Roman Urdu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
