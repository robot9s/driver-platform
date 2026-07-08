import type {TColor} from '@shared/config/colors'
import type {TDateISO} from '@shared/lib/dates'

export type CurrencyID = string

export const CurrencySymbolPositionConst = {
  left: 'left',
  right: 'right',
} as const
export type CurrencySymbolPosition =
  (typeof CurrencySymbolPositionConst)[keyof typeof CurrencySymbolPositionConst]

export interface CreateCurrency {
  currency: string
  name: string
  symbol: string
  symbolPosition: CurrencySymbolPosition
  color: TColor
}

export type UpdateCurrency = CreateCurrency

export interface Currency extends CreateCurrency {
  id: CurrencyID
  createdAt: TDateISO
}

export interface DeleteCurrencyDTO {
  id: CurrencyID
}

export type CurrenciesMap = Record<CurrencyID, Currency>

export interface Currencies {
  order: CurrencyID[]
  currencies: CurrenciesMap
}
