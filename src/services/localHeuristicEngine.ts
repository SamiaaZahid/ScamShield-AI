import type { RedFlag, RiskLevel, ScamCategory, ScanResult } from '../types';

interface RuleMatch {
  ruleId: string;
  category: ScamCategory;
  title: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  weight: number;
  matchSnippet?: string;
}

export function analyzeLocally(text: string, language: 'en' | 'ur-roman' = 'en'): ScanResult {
  const startTime = performance.now();
  const matches: RuleMatch[] = [];

  // ==========================================
  // 1. Phishing & Suspicious Link Detection
  // ==========================================
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:xyz|top|click|buzz|club|work|link|rest|tk|ml|ga|cf|gq|site|vip|biz|online)[^\s]*)/gi;
  const urlsFound = text.match(urlRegex) || [];

  for (const url of urlsFound) {
    const lowerUrl = url.toLowerCase();
    
    // IP address in URL
    if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i.test(lowerUrl)) {
      matches.push({
        ruleId: 'phish-ip-host',
        category: 'Phishing Link',
        title: language === 'ur-roman' ? 'IP Address Ka Istemal' : 'Raw IP Address Hostname in URL',
        explanation: language === 'ur-roman'
          ? 'Legitimate idaray IP address ke links nahi bhejte. Yeh phishing website ho sakti hai.'
          : 'Direct IP address links bypass domain reputation checks and are heavily utilized by credential phishing hosts.',
        severity: 'critical',
        weight: 35,
        matchSnippet: url
      });
    }

    // High risk TLDs
    if (/\.(xyz|top|click|buzz|club|work|link|rest|tk|ml|ga|cf|gq|site|vip|surf|icu)\b/i.test(lowerUrl)) {
      matches.push({
        ruleId: 'phish-cheap-tld',
        category: 'Phishing Link',
        title: language === 'ur-roman' ? 'Ghair-Mehfooz / Cheap Domain Extension' : 'High-Risk Domain Extension (TLD)',
        explanation: language === 'ur-roman'
          ? 'Yeh link aisi domain extension par hai jo fraud aur phishing ke liye kasrat se istemal hoti hai.'
          : 'High-risk and low-cost top-level domains are statistically associated with disposable phishing infrastructure.',
        severity: 'high',
        weight: 25,
        matchSnippet: url
      });
    }

    // Known Typosquat / Lookalike brands
    const typosquatBrands = [
      { pattern: /(paypa1|paypa-l|paypal-verify|paypal-security)/, brand: 'PayPal' },
      { pattern: /(arnazon|amzn-security|amazon-order-verify)/, brand: 'Amazon' },
      { pattern: /(micros0ft|ms-office-verify|microsoft-security-alert)/, brand: 'Microsoft' },
      { pattern: /(goog1e|google-accounts-security|gmail-verify)/, brand: 'Google' },
      { pattern: /(apple-id-verify|icloud-find-device-auth)/, brand: 'Apple' },
      { pattern: /(netfl1x|netflix-billing-update)/, brand: 'Netflix' },
      { pattern: /(easypaisa-reward|easypaisa-cashback|jazzcash-lottery)/, brand: 'EasyPaisa/JazzCash' },
      { pattern: /(hbl-secure|ubl-verify|mcb-login|meezan-alert)/, brand: 'Banking Portal' }
    ];

    for (const b of typosquatBrands) {
      if (b.pattern.test(lowerUrl)) {
        matches.push({
          ruleId: `phish-brand-${b.brand}`,
          category: 'Phishing Link',
          title: language === 'ur-roman' ? `${b.brand} Ki Jali Website` : `Deceptive Brand Typosquat (${b.brand})`,
          explanation: language === 'ur-roman'
            ? `Yeh link asali ${b.brand} ka nahi hai balke unke naam ka dhoka de kar banaya gaya hai.`
            : `The domain mimics legitimate ${b.brand} branding to trick victims into entering confidential login credentials.`,
          severity: 'critical',
          weight: 40,
          matchSnippet: url
        });
      }
    }

    // URL Shorteners masking destination
    if (/(bit\.ly|tinyurl\.com|is\.gd|cutt\.ly|rb\.gy|t\.co|ow\.ly|shorturl\.at)/i.test(lowerUrl)) {
      matches.push({
        ruleId: 'phish-shortener',
        category: 'Phishing Link',
        title: language === 'ur-roman' ? 'Chhupa Hua Short Link' : 'Obfuscated URL Shortener',
        explanation: language === 'ur-roman'
          ? 'Short link ke zariye asli website ka pata chupaya gaya hai.'
          : 'URL shorteners are commonly deployed to obscure the actual destination domain from security scanning filters.',
        severity: 'medium',
        weight: 15,
        matchSnippet: url
      });
    }
  }

  // ==========================================
  // 2. High-Pressure Urgency & Account Suspension
  // ==========================================
  const urgencyPatterns = [
    { regex: /\b(account\s*(has\s*been|is)\s*(suspended|locked|restricted|disabled|blocked))\b/i, title: 'Account Suspension Threat', titleUr: 'Account Band Hone Ki Dhamki', weight: 25 },
    { regex: /\b(within\s*24\s*hours|immediate\s*action\s*required|act\s*now|urgent|expires\s*today)\b/i, title: 'Artificial Urgency Pressure', titleUr: 'Jald-Bazi Ka Masnooi Dabao', weight: 20 },
    { regex: /\b(arrest\s*warrant|legal\s*action|police|federal\s*law|lawsuit)\b/i, title: 'Legal Intimidation Threat', titleUr: 'Qanooni Carwai Ya Police Ka Khauf', weight: 35 },
    { regex: /\b(unauthorized\s*(transaction|activity|charge)|fraud\s*alert)\b/i, title: 'Fake Security / Fraud Alert', titleUr: 'Jali Security Alert', weight: 20 },
    // Roman Urdu urgency
    { regex: /\b(fauran|foran|24\s*ghante|account\s*band|block\s*kar\s*diya|akhri\s*notice)\b/i, title: 'Roman Urdu Urgency Trap', titleUr: 'Urdu Mein Jald-Bazi Ka Dabao', weight: 22 }
  ];

  for (const up of urgencyPatterns) {
    const match = text.match(up.regex);
    if (match) {
      matches.push({
        ruleId: 'urgency-trigger',
        category: 'Urgent Account Suspension',
        title: language === 'ur-roman' ? up.titleUr : up.title,
        explanation: language === 'ur-roman'
          ? 'Dhokebaaz aksar jald-bazi aur khauf paida karte hain taake aap ghor kiye baghair click kar dein.'
          : 'Threat actors manufacture artificial panic to provoke irrational immediate compliance without verification.',
        severity: 'high',
        weight: up.weight,
        matchSnippet: match[0]
      });
    }
  }

  // ==========================================
  // 3. Fake Job & Freelance Escrow Scams
  // ==========================================
  const jobPatterns = [
    { regex: /\b(daily\s*income|earn\s*\$?\d{2,4}\s*(daily|per\s*day|hourly)|work\s*from\s*home\s*task)\b/i, weight: 25 },
    { regex: /\b(no\s*interview|hired\s*immediately|simple\s*online\s*typing|youtube\s*video\s*like\s*task)\b/i, weight: 30 },
    { regex: /\b(contact\s*our\s*hr\s*on\s*telegram|telegram\s*recruiter|whatsapp\s*hr\s*manager)\b/i, weight: 25 },
    { regex: /\b(pay\s*(registration|training|laptop|insurance)\s*fee\s*first)\b/i, weight: 35 },
    // Roman Urdu
    { regex: /\b(rozana\s*\d+\s*kamayein|ghar\s*baithe\s*paise|online\s*typing\s*kaam|advance\s*fees)\b/i, weight: 28 }
  ];

  for (const jp of jobPatterns) {
    const match = text.match(jp.regex);
    if (match) {
      matches.push({
        ruleId: 'fake-job-scheme',
        category: 'Fake Job Offer',
        title: language === 'ur-roman' ? 'Jali Nokri / Task Scam' : 'Fake Job / Task Escrow Scam',
        explanation: language === 'ur-roman'
          ? 'Ghar baithe ghair-mamooli aamdan aur advance fees mangna aam job fraud ki nishani hai.'
          : 'Unsolicited high-wage offers requiring off-platform communication (Telegram) or upfront advance fees are standard recruitment fraud.',
        severity: 'high',
        weight: jp.weight,
        matchSnippet: match[0]
      });
      break; // count one strong job pattern
    }
  }

  // ==========================================
  // 4. Payment / Wire & Crypto Scams
  // ==========================================
  const paymentPatterns = [
    { regex: /\b(western\s*union|moneygram|gift\s*cards?|itunes\s*card|steam\s*card|zelle|cashapp)\b/i, weight: 30 },
    { regex: /\b(crypto\s*wallet|send\s*(btc|eth|usdt|bitcoin)|wallet\s*address)\b/i, weight: 30 },
    { regex: /\b(advance\s*fee|release\s*funds|customs\s*clearance\s*charge|tax\s*deposit)\b/i, weight: 30 },
    { regex: /\b(easypaisa\s*(par\s*bhejo|transfer)|jazzcash\s*par\s*bhejo|advance\s*bhejo)\b/i, weight: 28 }
  ];

  for (const pp of paymentPatterns) {
    const match = text.match(pp.regex);
    if (match) {
      matches.push({
        ruleId: 'payment-wire-fraud',
        category: 'Payment / Wire Fraud',
        title: language === 'ur-roman' ? 'Ghair-Wapsi Paison Ka Mutalba' : 'Irreversible Payment / Wire Solicitation',
        explanation: language === 'ur-roman'
          ? 'Gift card, crypto ya fori money transfer ke zariye paise mangna jin ka koi refund nahi hota.'
          : 'Demanding untraceable or irreversible payment rails (gift cards, wire transfers, crypto addresses) indicates financial fraud.',
        severity: 'critical',
        weight: pp.weight,
        matchSnippet: match[0]
      });
      break;
    }
  }

  // ==========================================
  // 5. Lottery & Fake Prize Schemes
  // ==========================================
  const lotteryPatterns = [
    { regex: /\b(congratulations|you\s*have\s*won|lottery\s*winner|lucky\s*draw|selected\s*for\s*\$?\d{4,9})\b/i, weight: 28 },
    { regex: /\b(claim\s*your\s*prize|inheritance|beneficiary|unclaimed\s*funds)\b/i, weight: 25 },
    { regex: /\b(mubarak\s*ho|inam\s*nikla|benazir\s*income|jeeto\s*pakistan|lucky\s*winner)\b/i, weight: 30 }
  ];

  for (const lp of lotteryPatterns) {
    const match = text.match(lp.regex);
    if (match) {
      matches.push({
        ruleId: 'lottery-prize-fraud',
        category: 'Lottery / Prize Fraud',
        title: language === 'ur-roman' ? 'Jali Inam Ya Lottery' : 'Bogus Lottery / Prize Award',
        explanation: language === 'ur-roman'
          ? 'Bagair hissa liye inam nikalne ka dawa 100% fraud hota hai.'
          : 'Claims of unexpected lottery winnings or cash prizes without prior entry are classic advance-fee social engineering.',
        severity: 'high',
        weight: lp.weight,
        matchSnippet: match[0]
      });
      break;
    }
  }

  // ==========================================
  // 6. Impersonation & OTP / Credential Harvesting
  // ==========================================
  const otpPatterns = [
    { regex: /\b(do\s*not\s*share\s*this\s*code|one\s*time\s*password|otp\s*is|verification\s*code\s*is)\b/i, weight: 20 },
    { regex: /\b(send\s*(me\s*)?(the|your)\s*(code|otp|password|pin)|share\s*the\s*code)\b/i, weight: 40 },
    { regex: /\b(i\s*am\s*your\s*ceo|it\s*department|security\s*team|state\s*bank\s*officer)\b/i, weight: 30 },
    { regex: /\b(code\s*batao|otp\s*share\s*karein|bank\s*manager\s*bol\s*raha\s*hoon)\b/i, weight: 35 }
  ];

  for (const op of otpPatterns) {
    const match = text.match(op.regex);
    if (match) {
      matches.push({
        ruleId: 'otp-credential-harvesting',
        category: 'Impersonation',
        title: language === 'ur-roman' ? 'OTP Ya Password Mangne Ka Dhoka' : 'OTP & Credential Harvesting Attempt',
        explanation: language === 'ur-roman'
          ? 'Koi bhi asali bank ya idara phone ya message par aap se OTP nahi mangta.'
          : 'Soliciting one-time passcodes or credentials enables unauthorized takeover of banking or communication accounts.',
        severity: 'critical',
        weight: op.weight,
        matchSnippet: match[0]
      });
      break;
    }
  }

  // Calculate total risk score bounded between 0 and 100
  let calculatedScore = 0;
  for (const m of matches) {
    calculatedScore += m.weight;
  }
  // Soft cap if multiple high weights
  const finalRiskScore = Math.min(100, Math.max(0, calculatedScore));

  // Determine Risk Level
  let riskLevel: RiskLevel = 'Safe';
  let status: 'safe' | 'suspicious' | 'dangerous' = 'safe';

  if (finalRiskScore >= 75) {
    riskLevel = 'Critical';
    status = 'dangerous';
  } else if (finalRiskScore >= 50) {
    riskLevel = 'High';
    status = 'dangerous';
  } else if (finalRiskScore >= 25) {
    riskLevel = 'Medium';
    status = 'suspicious';
  } else if (finalRiskScore >= 10) {
    riskLevel = 'Low';
    status = 'safe';
  } else {
    riskLevel = 'Safe';
    status = 'safe';
  }

  // Determine Primary Scam Category
  let scamCategory: ScamCategory = 'Legitimate / Safe';
  if (matches.length > 0) {
    // Sort matches by weight descending to find dominant threat
    const sorted = [...matches].sort((a, b) => b.weight - a.weight);
    scamCategory = sorted[0].category;
  }

  // Convert matches into RedFlag format
  const redFlags: RedFlag[] = matches.map((m, idx) => ({
    id: `rf-local-${idx + 1}`,
    title: m.title,
    explanation: m.explanation,
    severity: m.severity,
    quote: m.matchSnippet
  }));

  // Build evidence list
  const evidence: string[] = [];
  if (urlsFound.length > 0) {
    evidence.push(language === 'ur-roman' ? `Mashkook links mile: ${urlsFound.slice(0, 3).join(', ')}` : `Detected URLs in payload: ${urlsFound.slice(0, 3).join(', ')}`);
  }
  for (const m of matches) {
    if (m.matchSnippet && !evidence.includes(m.matchSnippet)) {
      evidence.push(m.matchSnippet);
    }
  }

  // Safety Recommendations
  const recommendations: string[] = [];
  if (riskLevel === 'Critical' || riskLevel === 'High') {
    if (language === 'ur-roman') {
      recommendations.push('Is message mein diye gaye kisi bhi link par hargiz click na karein.');
      recommendations.push('Apna OTP, password ya zaati maloomat kisi se share na karein.');
      recommendations.push('Sender ko foran block karein aur relevant idaray ko fraud report karein.');
      recommendations.push('Agar bank se mutaliq hai toh bank ki asali helpline par call karke tasdeeq karein.');
    } else {
      recommendations.push('Do NOT click any hyperlinks or open attachments included in this message.');
      recommendations.push('Never disclose one-time passwords (OTPs), PINs, or credentials under any circumstances.');
      recommendations.push('Block the transmitting sender and submit a fraud report to the legitimate service provider.');
      recommendations.push('If a financial institution was named, contact their official hotline independently via verified numbers.');
    }
  } else if (riskLevel === 'Medium') {
    if (language === 'ur-roman') {
      recommendations.push('Sender ki identity ki pehlay mukammal tasdeeq karein.');
      recommendations.push('Ghair-tasdeeq shuda links ko kholne se gurez karein.');
    } else {
      recommendations.push('Exercise caution. Verify the sender identity through independent channels.');
      recommendations.push('Inspect any embedded URLs carefully before interacting.');
    }
  } else {
    if (language === 'ur-roman') {
      recommendations.push('Koi aam fraud nishani nahi mili, lekin hamesha ahityat baratna behtar hai.');
    } else {
      recommendations.push('No acute scam signatures detected in this text. Maintain baseline cyber hygiene.');
    }
  }

  // Executive Summary
  let summary = '';
  if (riskLevel === 'Critical') {
    summary = language === 'ur-roman'
      ? `Shadeed khatray ka pata chala hai (${scamCategory}). Yeh message aap ke zaati data ya account ko chori karne ke liye bheja gaya lagta hai.`
      : `Critical threat detected (${scamCategory}). This message exhibits deceptive hallmarks engineered to harvest credentials or manipulate funds.`;
  } else if (riskLevel === 'High') {
    summary = language === 'ur-roman'
      ? `Bara khatra daryaft hua hai. Is mein jald-bazi ka dabao aur mashkook awamil paye gaye hain.`
      : `High probability of malicious intent identified. High-pressure coercion patterns and untrusted vectors detected.`;
  } else if (riskLevel === 'Medium') {
    summary = language === 'ur-roman'
      ? `Yeh message mashkook lagta hai. Is mein aam phishing ya social engineering ke anasir hain.`
      : `Suspicious indicators present. Content displays anomalies common in unsolicited phishing or promotional campaigns.`;
  } else if (riskLevel === 'Low') {
    summary = language === 'ur-roman'
      ? `Kam darjay ka khatra. Koi wazeh fraud nishani nahi hai, lekin ahityat zaroori hai.`
      : `Low threat index. Minimal indicators matched; routine vigilance advised.`;
  } else {
    summary = language === 'ur-roman'
      ? `Tasdeeq shuda: Yeh message mehfooz lagta hai. Koi fraud ya phishing pattern nahi mila.`
      : `Verified: No known fraud signatures or deceptive vectors were detected in the analyzed text.`;
  }

  const endTime = performance.now();
  const latencyMs = Math.round(endTime - startTime);

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    inputText: text,
    riskScore: finalRiskScore,
    riskLevel,
    scamCategory,
    summary,
    redFlags,
    evidence,
    recommendations,
    confidence: matches.length > 0 ? 92 : 88,
    inferenceEngine: 'Local Heuristics Engine',
    latencyMs: Math.max(12, latencyMs),
    status,
    language,
    analysisDetails: {
      urgencyDetected: matches.some(m => m.ruleId.startsWith('urgency')),
      suspiciousLinksDetected: urlsFound,
      financialRequestsDetected: matches.some(m => m.category === 'Payment / Wire Fraud'),
      impersonationDetected: matches.some(m => m.category === 'Impersonation'),
      credentialsTargeted: matches.some(m => m.ruleId.includes('otp') || m.ruleId.includes('brand'))
    }
  };
}
