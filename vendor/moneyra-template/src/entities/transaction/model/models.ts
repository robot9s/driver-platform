import type {TDateISO} from '@shared/lib/dates'

// Incomes
export type IncomeID = string

export type CreateIncome = {
  type: 'income'
  amount: number
  categoryId: string
  accountId: string
  datetime: TDateISO
  description?: string
  groupDatetime?: string
}

export type UpdateIncome = CreateIncome

export type Income = CreateIncome & {
  id: IncomeID
  createdAt: TDateISO
}

export type Incomes = Record<IncomeID, Income>

export type TypedIncome = Income & {
  type: 'income'
}

// Expenses
export type ExpenseID = string

export type CreateExpense = {
  type: 'expense'
  amount: number
  categoryId: string
  accountId: string
  datetime: TDateISO
  description?: string
  groupDatetime?: string
}

export type UpdateExpense = CreateExpense

export type Expense = CreateExpense & {
  id: ExpenseID
  createdAt: TDateISO
}

export type Expenses = Record<ExpenseID, Expense>

export type TypedExpense = Expense & {
  type: 'expense'
}

// transactions
export type TransactionID = IncomeID | ExpenseID

export const TransactionTypeConst = {
  expense: 'expense',
  income: 'income',
} as const
export type TransactionType = (typeof TransactionTypeConst)[keyof typeof TransactionTypeConst]

export type Transaction = TypedIncome | TypedExpense

export type Transactions = Record<TransactionID, Expense | Income>

export type CreateTransaction = CreateExpense | CreateIncome

export type UpdateTransaction = CreateTransaction

export interface TransactionFilters {
  type?: TransactionType | TransactionType[]
  accountId?: string | string[]
  currencyId?: string | string[]
  expenseCategoryIds?: string[]
  incomeCategoryId?: string
  fromDateTimeRange?: TDateISO
  toDateTimeRange?: TDateISO
}
