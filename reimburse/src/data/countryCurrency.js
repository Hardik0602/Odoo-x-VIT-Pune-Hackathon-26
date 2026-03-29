/** Country options with company currency (signup) — value: country|CODE|symbol */
export const countryCurrencyOptions = [
  { value: 'India|INR|₹', label: 'India', flag: '🇮🇳' },
  { value: 'United States|USD|$', label: 'United States', flag: '🇺🇸' },
  { value: 'United Kingdom|GBP|£', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'Germany|EUR|€', label: 'Germany', flag: '🇩🇪' },
  { value: 'France|EUR|€', label: 'France', flag: '🇫🇷' },
  { value: 'Italy|EUR|€', label: 'Italy', flag: '🇮🇹' },
  { value: 'Spain|EUR|€', label: 'Spain', flag: '🇪🇸' },
  { value: 'Netherlands|EUR|€', label: 'Netherlands', flag: '🇳🇱' },

  { value: 'Japan|JPY|¥', label: 'Japan', flag: '🇯🇵' },
  { value: 'China|CNY|¥', label: 'China', flag: '🇨🇳' },
  { value: 'South Korea|KRW|₩', label: 'South Korea', flag: '🇰🇷' },

  { value: 'Singapore|SGD|S$', label: 'Singapore', flag: '🇸🇬' },
  { value: 'Australia|AUD|A$', label: 'Australia', flag: '🇦🇺' },
  { value: 'Canada|CAD|C$', label: 'Canada', flag: '🇨🇦' },
  { value: 'New Zealand|NZD|NZ$', label: 'New Zealand', flag: '🇳🇿' },

  { value: 'UAE|AED|د.إ', label: 'UAE', flag: '🇦🇪' },
  { value: 'Saudi Arabia|SAR|﷼', label: 'Saudi Arabia', flag: '🇸🇦' },
  { value: 'Qatar|QAR|﷼', label: 'Qatar', flag: '🇶🇦' },

  { value: 'Switzerland|CHF|CHF', label: 'Switzerland', flag: '🇨🇭' },
  { value: 'Sweden|SEK|kr', label: 'Sweden', flag: '🇸🇪' },
  { value: 'Norway|NOK|kr', label: 'Norway', flag: '🇳🇴' },
  { value: 'Denmark|DKK|kr', label: 'Denmark', flag: '🇩🇰' },

  { value: 'Brazil|BRL|R$', label: 'Brazil', flag: '🇧🇷' },
  { value: 'Mexico|MXN|$', label: 'Mexico', flag: '🇲🇽' },
  { value: 'South Africa|ZAR|R', label: 'South Africa', flag: '🇿🇦' }
]

export function parseCountryCurrency(value) {
  const [country, currencyCode, currencySymbol] = value.split('|')
  return { country, currencyCode, currencySymbol }
}