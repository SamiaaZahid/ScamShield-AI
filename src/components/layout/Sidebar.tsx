import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  ScanEye, 
  History, 
  BookOpen, 
  Settings, 
  ShieldCheck, 
  Zap, 
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import type { Language } from '../../utils/i18n';
import { translations } from '../../utils/i18n';

export type ActiveTab = 'dashboard' | 'scan-message' | 'screenshot' | 'history' | 'library' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  privacyEnabled: boolean;
  hasCloudKey: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  language,
  privacyEnabled,
  hasCloudKey
}) => {
  const t = translations[language];

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: t.navDashboard,
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'scan-message' as ActiveTab,
      label: t.navScanMessage,
      icon: MessageSquareCode,
      badge: 'Live'
    },
    {
      id: 'screenshot' as ActiveTab,
      label: t.navScreenshot,
      icon: ScanEye,
      badge: 'Vision'
    },
    {
      id: 'history' as ActiveTab,
      label: t.navHistory,
      icon: History,
      badge: null
    },
    {
      id: 'library' as ActiveTab,
      label: t.navLibrary,
      icon: BookOpen,
      badge: 'Intel'
    },
    {
      id: 'settings' as ActiveTab,
      label: t.navSettings,
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col justify-between border-r border-slate-800/80 bg-[#0B1020]/95 backdrop-blur-xl z-20 select-none">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B1020] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">
                SCAMSHIELD
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-tight">
              CYBER DEFENSE OS
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            {language === 'ur-roman' ? 'Markazi Menu' : 'Threat Intelligence'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/15 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/5 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
                )}
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive
                        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry & Status Panel */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Engine Status indicator */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-mono flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400" />
              {language === 'ur-roman' ? 'Inference Engine' : 'Inference Tier'}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
              hasCloudKey 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
            }`}>
              {hasCloudKey ? 'Cloud AI' : 'Local Shield'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-mono">
              {language === 'ur-roman' ? 'Razdari Filter' : 'PII Scrubber'}
            </span>
            <span className={`text-[10px] font-mono font-semibold ${
              privacyEnabled ? 'text-teal-400' : 'text-slate-500'
            }`}>
              {privacyEnabled ? 'Active' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Security Assurance footer */}
        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-slate-500">
          <span>Zero-Trust Architecture</span>
          <span className="text-teal-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Protected
          </span>
        </div>
      </div>
    </aside>
  );
};
