import {z} from 'zod'
import {CurrencySymbolPositionConst} from '@entities/currency'
import type {TColor} from '@shared/config/colors'
import {colorsPrimary} from '@shared/config/colors'

export const createCurrencyFormFieldsetSchema = z.object({
  currency: z.string(),
  name: z.string().nonempty(),
  symbol: z.string().nonempty(),
  symbolPosition: z.nativeEnum(CurrencySymbolPositionConst),
  color: z.enum(Object.keys(colorsPrimary) as [TColor, ...TColor[]]),
})
export type CreateCurrencyFormFieldsetSchema = z.infer<typeof createCurrencyFormFieldsetSchema>
