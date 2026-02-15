const CURRENCY_DISPLAY: Record<string, { symbol: string; locale: string }> = {
  USD: { symbol: '$', locale: 'en-US' },
  IDR: { symbol: 'Rp', locale: 'id-ID' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  JPY: { symbol: '¥', locale: 'ja-JP' },
};

export function formatCurrency(amount: number, currency: string): string {
  const config = CURRENCY_DISPLAY[currency] ?? {
    symbol: currency + ' ',
    locale: 'en-US',
  };
  const formatted = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return config.symbol + formatted;
}

export const CURRENCIES = Object.keys(CURRENCY_DISPLAY);
