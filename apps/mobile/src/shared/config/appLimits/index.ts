export type Entitlement = 'trial' | 'pro'

export const ENTITLEMENT_LIMIT: Record<Entitlement, TAppLimit> = {
  trial: {
    maxExpenseCategories: 8,
    maxIncomeCategories: 5,
    maxWallets: 1,
    minWallets: 1,
    minCurrencies: 1,
    maxCurrencies: 2,
    maxTransactionsByMonth: Infinity,
    maxTransactionsByDay: Infinity,
    maxBudgets: 1,
  },
  pro: {
    maxExpenseCategories: Infinity,
    maxIncomeCategories: Infinity,
    maxWallets: Infinity,
    minWallets: 1,
    minCurrencies: 1,
    maxCurrencies: Infinity,
    maxTransactionsByMonth: Infinity,
    maxTransactionsByDay: Infinity,
    maxBudgets: Infinity,
  },
}

// TYPES

type TAppLimit = {
  maxExpenseCategories: number
  maxIncomeCategories: number
  maxWallets: number
  minWallets: number
  minCurrencies: number
  maxCurrencies: number
  maxTransactionsByMonth: number
  maxTransactionsByDay: number
  maxBudgets: number
}
