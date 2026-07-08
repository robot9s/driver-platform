import {z} from 'zod'
import {TransactionTypeConst} from '@entities/transaction'

export const createTransactionFormSchema = z.object({
  type: z.nativeEnum(TransactionTypeConst),
  amount: z
    .union([
      z.number().positive('Amount must be greater than 0'),
      z
        .string()
        .regex(/^\d+(\.\d{0,2})?$/, 'Invalid amount')
        .transform((val) => parseFloat(val))
        .refine((val) => val > 0, 'Amount must be greater than 0'),
    ])
    .transform((val) => (typeof val === 'string' ? parseFloat(val) : val)),
  categoryId: z.string(),
  accountId: z.string(),
  datetime: z.string().datetime(),
  description: z.string().max(32).optional(),
})

type CreateTransactionFormData = z.infer<typeof createTransactionFormSchema>

export type {CreateTransactionFormData}
