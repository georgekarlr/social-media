// Utility functions for timezone and currency detection/formatting

export type CurrencyCode =
  | 'PHP' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'SGD' | 'AUD' | 'CAD' | 'INR' | 'CNY' | 'HKD' | 'KRW' | 'CHF';

export const DEFAULT_CURRENCY: CurrencyCode = 'PHP';

// Safely get the browser's IANA timezone, fallback to 'UTC'
export function getBrowserTimeZone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || 'UTC';
  } catch {
    return 'UTC';
  }
}

// Very lightweight mapping from common IANA timezones (or regions) to currency
// Falls back to using the locale region when possible, then DEFAULT_CURRENCY
export function getCurrencyForTimeZone(timeZone?: string): CurrencyCode {
  const tz = (timeZone || getBrowserTimeZone()).toLowerCase();

  // Direct TZ → currency hints (non-exhaustive but practical)
  const tzMap: Record<string, CurrencyCode> = {
    'asia/manila': 'PHP',
    'asia/singapore': 'SGD',
    'asia/tokyo': 'JPY',
    'asia/hong_kong': 'HKD',
    'asia/seoul': 'KRW',
    'australia/sydney': 'AUD',
    'america/new_york': 'USD',
    'america/los_angeles': 'USD',
    'america/chicago': 'USD',
    'europe/london': 'GBP',
    'europe/paris': 'EUR',
    'europe/berlin': 'EUR',
    'europe/madrid': 'EUR',
    'europe/rome': 'EUR',
    'europe/zurich': 'CHF',
    'canada/eastern': 'CAD',
  };

  if (tzMap[tz]) return tzMap[tz];

  // Try by locale region (e.g., en-US → US)
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
    const regionMatch = locale.match(/[-_]([A-Z]{2})\b/);
    const region = regionMatch?.[1];
    if (region) {
      const byRegion: Record<string, CurrencyCode> = {
        PH: 'PHP', US: 'USD', GB: 'GBP', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', IE: 'EUR', PT: 'EUR',
        SG: 'SGD', JP: 'JPY', AU: 'AUD', CA: 'CAD', IN: 'INR', CN: 'CNY', HK: 'HKD', KR: 'KRW', CH: 'CHF',
      };
      return byRegion[region] || DEFAULT_CURRENCY;
    }
  } catch {}

  return DEFAULT_CURRENCY;
}

// Get a currency symbol for a currency code using Intl, with fallback
export function getCurrencySymbol(code: CurrencyCode): string {
  try {
    const f = new Intl.NumberFormat(undefined, { style: 'currency', currency: code, currencyDisplay: 'narrowSymbol' });
    // Format a 0 value and try to extract first non-digit symbol
    const parts = f.formatToParts(0);
    const sym = parts.find(p => p.type === 'currency')?.value;
    return sym || code;
  } catch {
    return code;
  }
}

export function formatCurrency(amount: number, code: CurrencyCode): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: code, currencyDisplay: 'symbol' }).format(amount);
  } catch {
    // Fallback basic formatting
    return `${code} ${amount.toFixed(2)}`;
  }
}
