import { useEffect, useMemo, useState } from 'react'
import {
  CurrencyCode,
  DEFAULT_CURRENCY,
  getBrowserTimeZone,
  getCurrencyForTimeZone,
  getCurrencySymbol
} from '../utils/timezone'

const STORAGE_KEY = 'app.currency.code'

export function useCurrency() {
  const [timeZone, setTimeZone] = useState<string>('UTC')
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY)

  // Detect timezone on mount
  useEffect(() => {
    const tz = getBrowserTimeZone()
    setTimeZone(tz)
  }, [])

  // Load saved currency or derive from timezone
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) || '') as CurrencyCode
    if (saved) {
      setCurrency(saved)
    } else {
      setCurrency(getCurrencyForTimeZone(timeZone))
    }
  }, [timeZone])

  const symbol = useMemo(() => getCurrencySymbol(currency), [currency])

  const updateCurrency = (code: CurrencyCode) => {
    setCurrency(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch {}
  }

  return { currency, setCurrency: updateCurrency, symbol, timeZone }
}

export default useCurrency
