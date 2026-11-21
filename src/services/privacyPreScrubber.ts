/**
 * Privacy Pre-Scrubber Service
 * Enforces client-side redacting of sensitive personally identifiable information (PII)
 * such as phone numbers, emails, credit card sequences, and one-time passwords
 * before any data leaves the local client.
 */

export interface ScrubResult {
  scrubbedText: string;
  itemsRedactedCount: number;
  redactedTypes: string[];
}

export function scrubPii(text: string): ScrubResult {
  if (!text) {
    return { scrubbedText: '', itemsRedactedCount: 0, redactedTypes: [] };
  }

  let scrubbed = text;
  const typesFound = new Set<string>();
  let totalCount = 0;

  // 1. Redact Emails
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatches = scrubbed.match(emailRegex);
  if (emailMatches && emailMatches.length > 0) {
    typesFound.add('Email Address');
    totalCount += emailMatches.length;
    scrubbed = scrubbed.replace(emailRegex, '[REDACTED_EMAIL]');
  }

  // 2. Redact Phone Numbers (international and local formats including Pakistan, US, UK, etc.)
  const phoneRegex = /(\+?[0-9]{1,4}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}\b/g;
  // Match only sequences with at least 8 digits to avoid replacing normal small numbers
  scrubbed = scrubbed.replace(phoneRegex, (match) => {
    const digitCount = (match.match(/\d/g) || []).length;
    if (digitCount >= 9 && digitCount <= 15) {
      typesFound.add('Phone Number');
      totalCount++;
      return '[REDACTED_PHONE]';
    }
    return match;
  });

  // 3. Redact Credit Card / Debit Card sequences (13 to 19 digits, possibly with dashes/spaces)
  const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  scrubbed = scrubbed.replace(cardRegex, (match) => {
    const digitCount = (match.match(/\d/g) || []).length;
    if (digitCount >= 13 && digitCount <= 19) {
      typesFound.add('Payment Card / Account');
      totalCount++;
      return '[REDACTED_CARD_NUMBER]';
    }
    return match;
  });

  // 4. Redact OTP / PIN codes (4 to 6 digits preceded or followed by OTP/code/verification)
  const otpContextRegex = /\b(otp|code|pin|verification\s*code|password)[:\s]+(\d{4,8})\b/gi;
  scrubbed = scrubbed.replace(otpContextRegex, (_match, prefix) => {
    typesFound.add('Security Code / OTP');
    totalCount++;
    return `${prefix}: [REDACTED_SECURITY_CODE]`;
  });

  return {
    scrubbedText: scrubbed,
    itemsRedactedCount: totalCount,
    redactedTypes: Array.from(typesFound)
  };
}
