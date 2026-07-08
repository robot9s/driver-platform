import {z} from 'zod'
import {TransactionTypeConst} from '@entities/transaction'
import type {TColor} from '@shared/config/colors'
import {colorsPrimary} from '@shared/config/colors'
import {categoryIcons} from '@shared/config/icons'

export const createCategoryFormSchema = z.object({
  title: z.string().nonempty().max(30),
  icon: z.enum(categoryIcons),
  color: z.enum(Object.keys(colorsPrimary) as [TColor, ...TColor[]]),
  type: z.nativeEnum(TransactionTypeConst),
})

type CreateCategoryFormData = z.infer<typeof createCategoryFormSchema>

export type {CreateCategoryFormData}
