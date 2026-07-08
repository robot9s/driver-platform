import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import type {TransactionFilters} from '@entities/transaction'
import {TransactionTypeConst} from '@entities/transaction'
import {endOfMonth, startOfMonth} from '@shared/lib/dates'
import {globalStorage, STORAGE_CONSTANT_LAST_ACCOUNT_ID} from '@shared/storage/global-storage'

interface StatisticsFiltersStoreState {
  filters: TransactionFilters
  setStatisticsFilters(filters: TransactionFilters): void
}

export const useStatisticsFiltersStore = create<StatisticsFiltersStoreState>()(
  devtools<StatisticsFiltersStoreState>((set) => ({
    filters: {
      type: TransactionTypeConst.expense,
      fromDateTimeRange: startOfMonth.toISOString(),
      toDateTimeRange: endOfMonth.toISOString(),
      accountId: globalStorage.getItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID) as string,
    },
    setStatisticsFilters(filters) {
      set({filters})
    },
  }))
)
