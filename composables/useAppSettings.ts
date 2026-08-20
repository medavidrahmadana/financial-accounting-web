// Shared State for Currency and Theme
export const useAppSettings = () => {
  const currency = useState('app_currency', () => 'IDR') // 'IDR', 'USD', 'EUR', 'SGD'
  const isDark = useState('app_theme_is_dark', () => true) // true = dark mode, false = light mode

  const currencyRates: Record<string, { symbol: string; rate: number; position: string; decimals: number }> = {
    IDR: { symbol: 'Rp', rate: 1, position: 'prefix', decimals: 0 },
    USD: { symbol: '$', rate: 0.000063, position: 'prefix', decimals: 2 },
    EUR: { symbol: '€', rate: 0.000058, position: 'prefix', decimals: 2 },
    SGD: { symbol: 'S$', rate: 0.000085, position: 'prefix', decimals: 2 }
  }

  const formatAmount = (valIDR: number) => {
    if (!valIDR || valIDR === 0) return '-'
    const curr = currencyRates[currency.value] || currencyRates.IDR
    const converted = valIDR * curr.rate
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: curr.decimals,
      maximumFractionDigits: curr.decimals
    }).format(converted)
  }

  const getCurrencySymbol = () => {
    return currencyRates[currency.value]?.symbol || 'Rp'
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  return {
    currency,
    isDark,
    currencyRates,
    formatAmount,
    getCurrencySymbol,
    toggleTheme
  }
}
