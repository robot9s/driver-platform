import {z} from 'zod'
import {WALLET_ICONS} from '@shared/config/icons'

export const createAccountFormSchema = z.object({
  title: z.string().nonempty().max(30),
  currencyId: z.string().min(1, 'Please enter a valid value'),
  icon: z.enum(WALLET_ICONS),
  initialBalance: z.coerce
    .string()
    .transform((val) => `${val}`.replace(',', '.'))
    .pipe(z.coerce.number())
    .optional(),
})

type CreateAccountFormData = z.infer<typeof createAccountFormSchema>

export type {CreateAccountFormData}
