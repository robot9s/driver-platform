import type {TWalletIcon} from '@shared/config/icons'
import type {TDateISO} from '@shared/lib/dates'

export type AccountID = string

export interface CreateAccount {
  title: string
  icon: TWalletIcon
  currencyId: string
  initialBalance?: number
}

export type UpdateAccount = CreateAccount

export interface Account extends CreateAccount {
  id: AccountID
  createdAt: TDateISO
}

export type AccountsMap = Record<AccountID, Account>

export interface Accounts {
  order: AccountID[]
  accounts: AccountsMap
}
