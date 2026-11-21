export type Language = 'en' | 'ur-roman';

export interface TranslationMap {
  appName: string;
  appSubtitle: string;
  privacyBadge: string;
  activeEngine: string;
  
  // Navigation
  navDashboard: string;
  navScanMessage: string;
  navScreenshot: string;
  navHistory: string;
  navLibrary: string;
  navSettings: string;
  
  // Dashboard
  systemStatusTitle: string;
  systemOperational: string;
  protectionActive: string;
  metricScansPerformed: string;
  metricThreatsBlocked: string;
  metricAvgConfidence: string;
  metricActiveEngine: string;
  threatFeedTitle: string;
  threatFeedSubtitle: string;
  quickScanTitle: string;
  quickScanDesc: string;
  quickScanPlaceholder: string;
  quickScanBtn: string;
  threatDistributionTitle: string;
  
  // Scanner
  scanMessageTitle: string;
  scanMessageSubtitle: string;
  enterMessagePlaceholder: string;
  pasteFromClipboard: string;
  sampleScamsLabel: string;
  sampleBankOtp: string;
  sampleWhatsAppPrize: string;
  sampleFakeJob: string;
  sampleCeoFraud: string;
  analyzeNowBtn: string;
  analyzingState: string;
  analyzingSubtext: string;
  clearBtn: string;
  
  // Scan Results
  riskAssessmentTitle: string;
  riskScore: string;
  confidenceScore: string;
  inferenceLatency: string;
  redFlagsCount: string;
  redFlagsTitle: string;
  evidenceTitle: string;
  safetyRecommendationsTitle: string;
  technicalTelemetry: string;
  copyAdvisoryBtn: string;
  copiedNotice: string;
  newScanBtn: string;
  
  // Screenshot
  screenshotTitle: string;
  screenshotSubtitle: string;
  dropImageHere: string;
  supportedFormats: string;
  scrubPiiBeforeUpload: string;
  scrubPiiNotice: string;
  analyzeScreenshotBtn: string;
  analyzingImageState: string;
  noImageUploaded: string;
  removeImage: string;
  
  // History
  historyTitle: string;
  historySubtitle: string;
  filterAll: string;
  filterSafe: string;
  filterSuspicious: string;
  filterDangerous: string;
  searchHistoryPlaceholder: string;
  exportJson: string;
  exportAuditText: string;
  clearHistory: string;
  noHistoryYet: string;
  viewDetails: string;
  deleteItem: string;
  
  // Scam Library
  libraryTitle: string;
  librarySubtitle: string;
  searchLibraryPlaceholder: string;
  scamTactics: string[];
  tacticsLabel: string;
  realWorldExampleLabel: string;
  preventionAdviceLabel: string;
  
  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  languageSelectLabel: string;
  languageSelectDesc: string;
  engineConfigLabel: string;
  engineConfigDesc: string;
  firebaseApiKeyLabel: string;
  firebaseProjectIdLabel: string;
  firebaseAppIdLabel: string;
  geminiApiKeyLabel: string;
  geminiApiKeyDesc: string;
  saveSettingsBtn: string;
  settingsSavedNotice: string;
  testConnectionBtn: string;
  connectionTesting: string;
  connectionSuccess: string;
  connectionFailed: string;
  privacySectionTitle: string;
  privacyPreMaskingLabel: string;
  privacyPreMaskingDesc: string;
  clearAllDataBtn: string;
  clearDataConfirm: string;
  
  // Risk Levels
  riskLevelSafe: string;
  riskLevelLow: string;
  riskLevelMedium: string;
  riskLevelHigh: string;
  riskLevelCritical: string;
}

export const translations: Record<Language, TranslationMap> = {
  en: {
    appName: "ScamShield AI",
    appSubtitle: "Autonomous Cyber Fraud Detection System",
    privacyBadge: "Privacy-First Architecture",
    activeEngine: "Inference Engine",
    
    // Navigation
    navDashboard: "Dashboard",
    navScanMessage: "Scan Message",
    navScreenshot: "Screenshot Analysis",
    navHistory: "Scan History",
    navLibrary: "Scam Library",
    navSettings: "Settings",
    
    // Dashboard
    systemStatusTitle: "Defense Telemetry",
    systemOperational: "Threat Defense Operational",
    protectionActive: "Real-time Heuristics and Multi-modal Shield Active",
    metricScansPerformed: "Total Scans Verified",
    metricThreatsBlocked: "High Risk Flags Isolated",
    metricAvgConfidence: "Mean AI Confidence",
    metricActiveEngine: "Inference Pipeline",
    threatFeedTitle: "Recent Threat Activity",
    threatFeedSubtitle: "Live audit trail of evaluated vectors and payloads",
    quickScanTitle: "Rapid Message Triage",
    quickScanDesc: "Paste suspicious SMS, Telegram, WhatsApp, or email excerpts for instant zero-trust verification.",
    quickScanPlaceholder: "Paste suspicious text, link, or transaction alert here...",
    quickScanBtn: "Verify Message",
    threatDistributionTitle: "Threat Vector Distribution",
    
    // Scanner
    scanMessageTitle: "Threat Vector Text Scanner",
    scanMessageSubtitle: "Deep multi-layer heuristic and generative inspection for fraud, phishing, and social engineering.",
    enterMessagePlaceholder: "Paste the complete message, SMS text, payment prompt, or suspicious link...",
    pasteFromClipboard: "Paste from Clipboard",
    sampleScamsLabel: "Or select a real-world scenario to test:",
    sampleBankOtp: "Bank OTP Phish",
    sampleWhatsAppPrize: "WhatsApp Lottery",
    sampleFakeJob: "High Pay Remote Job",
    sampleCeoFraud: "CEO Impersonation",
    analyzeNowBtn: "Execute Deep Analysis",
    analyzingState: "Running Security Heuristics...",
    analyzingSubtext: "Evaluating linguistic urgency, domain reputation, and social engineering patterns",
    clearBtn: "Clear Input",
    
    // Scan Results
    riskAssessmentTitle: "Threat Intelligence Report",
    riskScore: "Risk Threat Index",
    confidenceScore: "Confidence Level",
    inferenceLatency: "Inference Latency",
    redFlagsCount: "Red Flags Identified",
    redFlagsTitle: "Identified Threat Indicators",
    evidenceTitle: "Extracted Forensic Evidence",
    safetyRecommendationsTitle: "Actionable Safety Protocols",
    technicalTelemetry: "Engine Telemetry & Metadata",
    copyAdvisoryBtn: "Copy Safety Advisory",
    copiedNotice: "Advisory copied to clipboard",
    newScanBtn: "Perform Another Scan",
    
    // Screenshot
    screenshotTitle: "Multi-Modal Screenshot Forensics",
    screenshotSubtitle: "Upload suspicious screenshots from WhatsApp, SMS, payment gateways, or fake job portals for visual fraud detection.",
    dropImageHere: "Drag and drop screenshot here, or click to browse files",
    supportedFormats: "Supports PNG, JPG, JPEG, and WebP (Up to 10MB)",
    scrubPiiBeforeUpload: "Client-side PII Pre-Scrubbing",
    scrubPiiNotice: "When enabled, phone numbers and email addresses are masked locally before processing.",
    analyzeScreenshotBtn: "Analyze Screenshot",
    analyzingImageState: "Scanning Image via Multi-Modal Vision...",
    noImageUploaded: "No screenshot selected",
    removeImage: "Remove Image",
    
    // History
    historyTitle: "Verified Scan Registry",
    historySubtitle: "Cryptographically indexed local log of all analyzed messages and image forensics.",
    filterAll: "All Logs",
    filterSafe: "Verified Safe",
    filterSuspicious: "Suspicious",
    filterDangerous: "Critical & High Risk",
    searchHistoryPlaceholder: "Search by keyword, domain, or threat category...",
    exportJson: "Export JSON",
    exportAuditText: "Export Audit Report",
    clearHistory: "Clear Log Registry",
    noHistoryYet: "No scan records registered in the local repository.",
    viewDetails: "Inspect Report",
    deleteItem: "Delete Record",
    
    // Scam Library
    libraryTitle: "Cyber Fraud Intelligence Knowledgebase",
    librarySubtitle: "Detailed taxonomies, evasion techniques, and prevention protocols for modern digital scams.",
    searchLibraryPlaceholder: "Search threats (e.g., OTP spoofing, fake task escrow, crypto drainer)...",
    scamTactics: ["Social Engineering", "Urgency Traps", "Spoofed Domains", "Payment Gateways", "Credential Phishing"],
    tacticsLabel: "Observed Attack Tactics",
    realWorldExampleLabel: "Real-World Attack Signature",
    preventionAdviceLabel: "Recommended Defensive Protocol",
    
    // Settings
    settingsTitle: "Engine Architecture & Preferences",
    settingsSubtitle: "Configure Firebase AI Logic credentials, hybrid inference routing, and localization.",
    languageSelectLabel: "Interface Language",
    languageSelectDesc: "Toggle between English and Roman Urdu for full accessibility across all screens.",
    engineConfigLabel: "Inference Execution Mode",
    engineConfigDesc: "Select whether the system prioritizes local on-device heuristics, cloud AI, or hybrid auto-routing.",
    firebaseApiKeyLabel: "Firebase / Gemini API Key",
    firebaseProjectIdLabel: "Firebase Project ID",
    firebaseAppIdLabel: "Firebase Web App ID",
    geminiApiKeyLabel: "Direct Gemini / Firebase AI Logic Key",
    geminiApiKeyDesc: "Enables genuine Gemini 2.0 / 1.5 multi-modal inference. Stored client-side in secure local storage.",
    saveSettingsBtn: "Save Configurations",
    settingsSavedNotice: "Configurations updated successfully",
    testConnectionBtn: "Test Firebase / AI Ping",
    connectionTesting: "Pinging Firebase AI Endpoint...",
    connectionSuccess: "Firebase AI Logic endpoint verified and operational",
    connectionFailed: "Failed to connect to Firebase AI Logic endpoint",
    privacySectionTitle: "Privacy & Data Confidentiality",
    privacyPreMaskingLabel: "Enforce Client-Side PII Masking",
    privacyPreMaskingDesc: "Automatically masks phone numbers, credit card sequences, and emails before sending to external inference.",
    clearAllDataBtn: "Wipe Local History & Cache",
    clearDataConfirm: "Are you sure you want to purge all local scan history?",
    
    // Risk Levels
    riskLevelSafe: "Safe / Verified",
    riskLevelLow: "Low Risk",
    riskLevelMedium: "Suspicious",
    riskLevelHigh: "High Risk",
    riskLevelCritical: "Critical Threat"
  },
  'ur-roman': {
    appName: "ScamShield AI",
    appSubtitle: "Khud-Kaar Cyber Dhoka Dahi Pehchan System",
    privacyBadge: "Razdari-Pehle Saakht",
    activeEngine: "Inference Engine",
    
    // Navigation
    navDashboard: "Dashboard",
    navScanMessage: "Message Ki Jaanch",
    navScreenshot: "Screenshot Ka Tajziya",
    navHistory: "Jaanch Ka Record",
    navLibrary: "Scam Maloomat",
    navSettings: "Settings",
    
    // Dashboard
    systemStatusTitle: "Difaai Telemetry",
    systemOperational: "Difaai Nizam Fa'al Hai",
    protectionActive: "Heuristics aur Multi-modal Difa Mukammal Taur Par Active Hai",
    metricScansPerformed: "Kul Jaanch Shuda Messages",
    metricThreatsBlocked: "Khatarnaak Pehchanain",
    metricAvgConfidence: "Ausat AI Bharosa",
    metricActiveEngine: "Inference Pipeline",
    threatFeedTitle: "Taza Tareen Khatrat Ka Khulasa",
    threatFeedSubtitle: "Hal hi mein jaanch kiye gaye fraud tareeqay aur alerts",
    quickScanTitle: "Tez Raftaar Message Jaanch",
    quickScanDesc: "Koi bhi mashkook SMS, WhatsApp, Telegram ya email text fori jaanch ke liye yahan darj karein.",
    quickScanPlaceholder: "Mashkook paigham ya link yahan paste karein...",
    quickScanBtn: "Tasdeeq Karein",
    threatDistributionTitle: "Khatray Ki Iqsam Ka Phelao",
    
    // Scanner
    scanMessageTitle: "Text Scam Detection Scanner",
    scanMessageSubtitle: "Dhoka dahi, phishing aur social engineering ki gehari AI jaanch.",
    enterMessagePlaceholder: "Mukammal message, bank alert, inaami paigham ya mashkook link yahan paste karein...",
    pasteFromClipboard: "Clipboard Se Paste Karein",
    sampleScamsLabel: "Ya aam fraud misalein muntakhib karein:",
    sampleBankOtp: "Bank OTP Dhoka",
    sampleWhatsAppPrize: "WhatsApp Lottery Inam",
    sampleFakeJob: "Ghar Baithe Nokri",
    sampleCeoFraud: "Afser Ban Kar Dhoka",
    analyzeNowBtn: "Gehari Jaanch Shuru Karein",
    analyzingState: "Security Jaanch Jaari Hai...",
    analyzingSubtext: "Zubani dabao, links ki asaliat aur fraud nishaniyon ka tajziya ho raha hai",
    clearBtn: "Saaf Karein",
    
    // Scan Results
    riskAssessmentTitle: "Khatray Ki Khufia Report",
    riskScore: "Khatray Ka Score",
    confidenceScore: "Bharosa Darja",
    inferenceLatency: "Raftaar / Waqt",
    redFlagsCount: "Mashkook Nishaniyan",
    redFlagsTitle: "Daryaft Shuda Khatarnaak Nishaniyan",
    evidenceTitle: "Pakri Gayi Sabooti Ibarat",
    safetyRecommendationsTitle: "Hifazati Hidayat Aur Mashwaray",
    technicalTelemetry: "Engine Ki Maloomat",
    copyAdvisoryBtn: "Hifazati Hidayat Copy Karein",
    copiedNotice: "Hidayat clipboard par copy ho chuki hai",
    newScanBtn: "Nayi Jaanch Karein",
    
    // Screenshot
    screenshotTitle: "Screenshot Ka Visual Tajziya",
    screenshotSubtitle: "WhatsApp, SMS, EasyPaisa, JazzCash ya bank app ke mashkook screenshot upload karein.",
    dropImageHere: "Screenshot yahan drag karein ya browse karne ke liye click karein",
    supportedFormats: "PNG, JPG, JPEG aur WebP dastiyab hain (10MB tak)",
    scrubPiiBeforeUpload: "Zaati Maloomat Ko Chhupayein",
    scrubPiiNotice: "Is se phone number aur emails jaanch se pehle chhupa diye jatay hain.",
    analyzeScreenshotBtn: "Screenshot Ki Jaanch Karein",
    analyzingImageState: "Tasveer Ki AI Jaanch Jaari Hai...",
    noImageUploaded: "Koi screenshot muntakhib nahi hua",
    removeImage: "Tasveer Hatayein",
    
    // History
    historyTitle: "Jaanch Ki Tareekh",
    historySubtitle: "Aap ke tamam scan kiye gaye messages aur tasaveer ka mehfooz record.",
    filterAll: "Tamam Records",
    filterSafe: "Mehfooz",
    filterSuspicious: "Mashkook",
    filterDangerous: "Shadeed Khatra",
    searchHistoryPlaceholder: "Talaash karein (lafz, link ya category)...",
    exportJson: "JSON Export Karein",
    exportAuditText: "Text Report Export Karein",
    clearHistory: "Tareekh Saaf Karein",
    noHistoryYet: "Abhi tak koi jaanch record mojood nahi hai.",
    viewDetails: "Tafseelat Dekhein",
    deleteItem: "Record Khatam Karein",
    
    // Scam Library
    libraryTitle: "Cyber Dhokay Ki Maloomati Kitab",
    librarySubtitle: "Jadeed digital dhokon ki wazahat, bachao ke tareeqay aur hidayat.",
    searchLibraryPlaceholder: "Dhokay ki qisam talaash karein (maslan OTP, inami lottery, crypto)...",
    scamTactics: ["Social Engineering", "Jald-bazi Ka Dabao", "Jali Websites", "Payment Fraud", "Password Chori"],
    tacticsLabel: "Hamlawaar Ke Tareeqay",
    realWorldExampleLabel: "Haqeeqi Dhokay Ki Misaal",
    preventionAdviceLabel: "Bachao Ka Difaai Tareeqa",
    
    // Settings
    settingsTitle: "Engine Aur Tarjeehat",
    settingsSubtitle: "Firebase AI Logic credentials, inference mode aur zuban ki tarteeb.",
    languageSelectLabel: "Interface Ki Zuban",
    languageSelectDesc: "English aur Roman Urdu ke darmiyan kisi bhi waqt tabdeel karein.",
    engineConfigLabel: "Inference Engine Ka Intikhab",
    engineConfigDesc: "Chunein ke system local heuristics use kare ya cloud AI.",
    firebaseApiKeyLabel: "Firebase / Gemini API Key",
    firebaseProjectIdLabel: "Firebase Project ID",
    firebaseAppIdLabel: "Firebase Web App ID",
    geminiApiKeyLabel: "Direct Gemini / Firebase AI Logic Key",
    geminiApiKeyDesc: "Gemini 2.0 / 1.5 multi-modal AI ke liye API key. Sirf aap ke browser mein mehfooz rehti hai.",
    saveSettingsBtn: "Tarteeb Mehfooz Karein",
    settingsSavedNotice: "Tarteeb kamyabi se mehfooz ho gayi",
    testConnectionBtn: "Firebase / AI Connection Check Karein",
    connectionTesting: "AI Endpoint Ka Jaiza Liya Ja Raha Hai...",
    connectionSuccess: "Firebase AI Logic kamyabi se rabta kar raha hai",
    connectionFailed: "Firebase AI Logic se rabta na ho saka",
    privacySectionTitle: "Razdari Aur Data Hifazat",
    privacyPreMaskingLabel: "Zaati Maloomat Ka Parda (PII Masking)",
    privacyPreMaskingDesc: "Phone number, card number aur email ko bahar bhejne se pehle chupayein.",
    clearAllDataBtn: "Tamam Data Saaf Karein",
    clearDataConfirm: "Kya aap waqai tamam scan history khatam karna chahte hain?",
    
    // Risk Levels
    riskLevelSafe: "Mehfooz / Verified",
    riskLevelLow: "Kam Khatra",
    riskLevelMedium: "Mashkook",
    riskLevelHigh: "Bara Khatra",
    riskLevelCritical: "Shadeed Khatra"
  }
};
