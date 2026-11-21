import React, { useState } from 'react';
import type { Language } from '../../utils/i18n';
import { translations } from '../../utils/i18n';
import { SCAM_LIBRARY_ITEMS } from '../../services/scamLibraryData';
import { 
  BookOpen, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';

interface LibraryViewProps {
  language: Language;
  onTestScamPattern: (sampleText: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  language,
  onTestScamPattern
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = SCAM_LIBRARY_ITEMS.filter((item) => {
    const term = searchTerm.toLowerCase();
    const title = (language === 'ur-roman' ? item.titleUr : item.title).toLowerCase();
    const overview = (language === 'ur-roman' ? item.overviewUr : item.overview).toLowerCase();
    const category = item.category.toLowerCase();
    const matchesSearch = title.includes(term) || overview.includes(term) || category.includes(term);

    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    return true;
  });

  const categories = [
    'all',
    'Phishing Link',
    'Fake Job Offer',
    'Lottery / Prize Fraud',
    'Crypto Giveaway Scam',
    'Impersonation',
    'Tech Support Scam'
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>{t.libraryTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.librarySubtitle}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchLibraryPlaceholder}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
            }`}
          >
            {cat === 'all' ? (language === 'ur-roman' ? 'Tamam Categories' : 'All Categories') : cat}
          </button>
        ))}
      </div>

      {/* Threat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const isCritical = item.riskLevel === 'Critical';

          return (
            <div
              key={item.id}
              className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
                      {item.category}
                    </span>
                    <h4 className="text-base font-bold text-white tracking-tight">
                      {language === 'ur-roman' ? item.titleUr : item.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                    isCritical ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.riskLevel}
                  </span>
                </div>

                {/* Overview */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'ur-roman' ? item.overviewUr : item.overview}
                </p>

                {/* Real-World Signature Example */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-sans font-semibold">
                    {t.realWorldExampleLabel}
                  </span>
                  <p className="text-slate-200 italic font-sans text-xs">
                    {item.realWorldExample}
                  </p>
                </div>

                {/* Attack Tactics */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    {t.tacticsLabel}
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {(language === 'ur-roman' ? item.tacticsUr : item.tactics).map((tactic, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention Tips */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 block font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.preventionAdviceLabel}
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {(language === 'ur-roman' ? item.defenseTipsUr : item.defenseTips).map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button: Test in Scanner */}
              <div className="pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onTestScamPattern(item.realWorldExample)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition shadow-md shadow-cyan-400/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {language === 'ur-roman' ? 'Is Scam Ko Scanner Mein Test Karein' : 'Simulate & Verify In Live Scanner'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
