// Shared State for Currency and Theme
export const useAppSettings = () => {
  const currency = useState('app_currency', () => 'IDR') // 'IDR', 'USD', 'EUR', 'SGD'
  const isDark = useState('app_theme_is_dark', () => true) // true = dark mode, false = light mode

  // Exchange Rates (Base Currency: IDR)
  // USD = Rp 17.700 -> 1/17700 ≈ 0.000056497
  // EUR = Rp 20.700 -> 1/20700 ≈ 0.000048309
  // SGD = Rp 13.900 -> 1/13900 ≈ 0.000071942
  const currencyRates: Record<string, { symbol: string; rate: number; position: string; decimals: number }> = {
    IDR: { symbol: 'Rp', rate: 1, position: 'prefix', decimals: 0 },
    USD: { symbol: '$', rate: 0.000056497, position: 'prefix', decimals: 2 },
    EUR: { symbol: '€', rate: 0.000048309, position: 'prefix', decimals: 2 },
    SGD: { symbol: 'S$', rate: 0.000071942, position: 'prefix', decimals: 2 }
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
