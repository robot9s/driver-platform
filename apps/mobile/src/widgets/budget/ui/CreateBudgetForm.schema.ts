import {z} from 'zod'
import type {TColor} from '@shared/config/colors'
import {colorsPrimary} from '@shared/config/colors'
import {categoryIcons} from '@shared/config/icons'

export const createBudgetFormSchema = z.object({
  name: z.string().min(3, 'Please enter a valid value').max(30),
  amountLimit: z.coerce
    .string()
    .transform((val) => Number(`${val}`.replace(',', '.')))
    .pipe(z.number().min(1)),
  period: z.union([z.literal('monthly'), z.literal('yearly')]),
  icon: z.enum(categoryIcons),
  color: z.enum(Object.keys(colorsPrimary) as [TColor, ...TColor[]]),
  categoryIds: z.array(z.string()).min(1),
  accountId: z.string().min(4, 'Please enter a valid value'),
})

type CreateBudgetFormData = z.infer<typeof createBudgetFormSchema>
export type {CreateBudgetFormData}
