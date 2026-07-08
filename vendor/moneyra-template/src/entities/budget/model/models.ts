import type {TColor} from '@shared/config/colors'
import type {TCategoryIcon} from '@shared/config/icons'
import type {TDateISO} from '@shared/lib/dates'

export type BudgetRecordID = string

export type CreateBudgetRecord = {
  name: string
  period: 'monthly' | 'yearly'
  amountLimit: number
  icon: TCategoryIcon
  color: TColor
  categoryIds: string[]
  accountId: string
  //datetime: TDateISO
}

export type UpdateBudgetRecord = CreateBudgetRecord

export type BudgetRecord = CreateBudgetRecord & {
  id: BudgetRecordID
  createdAt: TDateISO
}

export type BudgetRecords = Record<BudgetRecordID, BudgetRecord>
