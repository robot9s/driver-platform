import type {Currency} from '@shared/config/currencies'
import {currencyCodes} from '@shared/config/currencies'

export function getSupportedCurrencies({locale}: {locale: string}): CurrencyInfo[] {
  return currencyCodes.map((currency) => {
    const name = getCurrencyName(currency, locale)
    const symbol = getCurrencySymbol(currency, locale)

    return {currency, name, symbol}
  })
}

export function getCurrencyName(currency: string, locale: string): string {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'name',
  }).format(0)

  return (formatted.match(/(?<= ).+/) || [''])[0].trim()
}

export function getCurrencySymbol(currency: string, locale: string): string {
  return (
    new Intl.NumberFormat(locale, {style: 'currency', currency: currency})
      .formatToParts(1)
      .find((part) => part.type === 'currency')?.value || ''
  )
}

// TYPES

type CurrencyInfo = {
  currency: Currency
  name: string
  symbol: string
}
