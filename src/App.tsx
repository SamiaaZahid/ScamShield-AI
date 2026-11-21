import React, { useState, useEffect, useCallback } from 'react';
import type { ScanResult, SettingsConfig } from './types';
import type { Language } from './utils/i18n';
import { translations } from './utils/i18n';
import { Sidebar } from './components/layout/Sidebar';
import type { ActiveTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { ScanMessageView } from './components/views/ScanMessageView';
import { ScreenshotView } from './components/views/ScreenshotView';
import { HistoryView } from './components/views/HistoryView';
import { LibraryView } from './components/views/LibraryView';
import { SettingsView } from './components/views/SettingsView';
import { 
  loadSettings, 
  saveSettings, 
  loadHistory, 
  saveScanToHistory, 
  deleteScanFromHistory, 
  clearHistory 
} from './services/storage';
import { coordinateScan } from './services/inferenceCoordinator';

export function App() {
  const [settings, setSettings] = useState<SettingsConfig>(() => loadSettings());
  const [history, setHistory] = useState<ScanResult[]>(() => loadHistory());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [quickScanText, setQuickScanText] = useState<string>('');
  const [selectedInspectScan, setSelectedInspectScan] = useState<ScanResult | null>(null);

  const language = settings.language || 'en';
  const t = translations[language];

  // Mouse follow glow tracker
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const handleUpdateLanguage = (newLang: Language) => {
    const updated = { ...settings, language: newLang };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleUpdateSettings = (newSettings: SettingsConfig) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleScanMessage = async (text: string): Promise<ScanResult> => {
    const { result } = await coordinateScan({
      text,
      settings
    });
    const updatedHistory = saveScanToHistory(result);
    setHistory(updatedHistory);
    return result;
  };

  const handleScanImage = async (
    imageDataUrl: string,
    imageName: string,
    contextText: string
  ): Promise<ScanResult> => {
    const { result } = await coordinateScan({
      text: contextText,
      imageDataUrl,
      imageName,
      settings
    });
    const updatedHistory = saveScanToHistory(result);
    setHistory(updatedHistory);
    return result;
  };

  const handleDeleteScan = (id: string) => {
    const updated = deleteScanFromHistory(id);
    setHistory(updated);
  };

  const handleClearAllHistory = () => {
    clearHistory();
    setHistory([]);
    setSelectedInspectScan(null);
  };

  const handleQuickScan = (text: string) => {
    setQuickScanText(text);
    setActiveTab('scan-message');
  };

  const handleInspectResult = (scan: ScanResult) => {
    setSelectedInspectScan(scan);
    setActiveTab('history');
  };

  const handleTestScamPattern = (sampleText: string) => {
    setQuickScanText(sampleText);
    setActiveTab('scan-message');
  };

  // Get active tab title & subtitle
  let pageTitle = t.navDashboard;
  let pageSubtitle = t.appSubtitle;
  if (activeTab === 'scan-message') {
    pageTitle = t.navScanMessage;
    pageSubtitle = t.scanMessageSubtitle;
  } else if (activeTab === 'screenshot') {
    pageTitle = t.navScreenshot;
    pageSubtitle = t.screenshotSubtitle;
  } else if (activeTab === 'history') {
    pageTitle = t.navHistory;
    pageSubtitle = t.historySubtitle;
  } else if (activeTab === 'library') {
    pageTitle = t.navLibrary;
    pageSubtitle = t.librarySubtitle;
  } else if (activeTab === 'settings') {
    pageTitle = t.navSettings;
    pageSubtitle = t.settingsSubtitle;
  }

  const hasCloudKey = !!(settings.geminiApiKey?.trim() || settings.firebaseApiKey?.trim());

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#0B1020] text-slate-100 flex relative selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* Interactive mouse spotlight glow */}
      <div className="mouse-spotlight" />

      {/* Cyber background grid */}
      <div className="fixed inset-0 bg-cyber-grid pointer-events-none z-0 opacity-80" />

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        privacyEnabled={settings.privacyPreMasking}
        hasCloudKey={hasCloudKey}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header
          title={pageTitle}
          subtitle={pageSubtitle}
          language={language}
          setLanguage={handleUpdateLanguage}
          privacyEnabled={settings.privacyPreMasking}
          hasCloudKey={hasCloudKey}
        />

        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              history={history}
              settings={settings}
              language={language}
              setActiveTab={setActiveTab}
              onQuickScan={handleQuickScan}
              onInspectResult={handleInspectResult}
            />
          )}

          {activeTab === 'scan-message' && (
            <ScanMessageView
              settings={settings}
              language={language}
              onScan={handleScanMessage}
              initialText={quickScanText}
              onResetInitialText={() => setQuickScanText('')}
              onNavigateToSettings={() => setActiveTab('settings')}
            />
          )}

          {activeTab === 'screenshot' && (
            <ScreenshotView
              settings={settings}
              language={language}
              onScanImage={handleScanImage}
              onNavigateToSettings={() => setActiveTab('settings')}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              history={history}
              language={language}
              onDeleteScan={handleDeleteScan}
              onClearHistory={handleClearAllHistory}
              selectedInspectScan={selectedInspectScan}
              onClearInspectScan={() => setSelectedInspectScan(null)}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              language={language}
              onTestScamPattern={handleTestScamPattern}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              language={language}
              onUpdateSettings={handleUpdateSettings}
              onClearHistory={handleClearAllHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
