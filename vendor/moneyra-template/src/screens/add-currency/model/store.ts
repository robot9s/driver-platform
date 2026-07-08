import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import type {TransactionFilters} from '@entities/transaction'

interface CurrencyFiltersStoreState {
  filters: TransactionFilters
  searchTerm: string
  setSearchTerm(searchTerm: string): void
}

export const useCurrencyFiltersStore = create<CurrencyFiltersStoreState>()(
  devtools((set) => ({
    filters: {},
    searchTerm: '',
    setSearchTerm(searchTerm) {
      set({searchTerm})
    },
  }))
)
