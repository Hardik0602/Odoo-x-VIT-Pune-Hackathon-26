/** Country options with company currency (signup) — value: country|CODE|symbol */
export const countryCurrencyOptions = [
  { value: 'India|INR|₹', label: 'India', flag: '🇮🇳' },
  { value: 'United States|USD|$', label: 'United States', flag: '🇺🇸' },
  { value: 'United Kingdom|GBP|£', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'Germany|EUR|€', label: 'Germany', flag: '🇩🇪' },
  { value: 'Japan|JPY|¥', label: 'Japan', flag: '🇯🇵' },
  { value: 'Singapore|SGD|S$', label: 'Singapore', flag: '🇸🇬' },
  { value: 'UAE|AED|د.إ', label: 'UAE', flag: '🇦🇪' }
]

export function parseCountryCurrency (value) {
  const [country, currencyCode, currencySymbol] = value.split('|')
  return { country, currencyCode, currencySymbol }
}
