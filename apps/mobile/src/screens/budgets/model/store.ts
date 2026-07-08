import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import type {AccountID} from '@entities/account'
import type {TransactionType} from '@entities/transaction'
import type {TDateISO} from '@shared/lib/dates'
import {endOfMonth, startOfMonth} from '@shared/lib/dates'

interface BudgetsFiltersStoreState {
  filters: BudgetsFilters
  setBudgetsFilters(filters: BudgetsFilters): void
}

interface BudgetsFilters {
  type: TransactionType
  accountId?: AccountID | AccountID[]
  fromDateTimeRange?: TDateISO
  toDateTimeRange?: TDateISO
}

export const useBudgetsFiltersStore = create<BudgetsFiltersStoreState>()(
  devtools((set) => ({
    filters: {
      type: 'expense',
      fromDateTimeRange: startOfMonth.toISOString(),
      toDateTimeRange: endOfMonth.toISOString(),
    },
    setBudgetsFilters(filters) {
      set({filters})
    },
  }))
)
