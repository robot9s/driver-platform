import type {TColor} from '@shared/config/colors'
import type {TCategoryIcon} from '@shared/config/icons'
import type {TDateISO} from '@shared/lib/dates'

// Incomes
export type IncomeCategoryID = string

export interface CreateIncomeCategory {
  title: string
  color: TColor
  icon: TCategoryIcon
  parentId?: IncomeCategoryID | null
}

export type UpdateIncomeCategory = CreateIncomeCategory

export interface IncomeCategory extends CreateIncomeCategory {
  id: IncomeCategoryID
  createdAt: TDateISO
}

export type IncomeCategories = Record<string, IncomeCategory>

// Expenses
export type ExpenseCategoryID = string

export interface CreateExpenseCategory {
  title: string
  color: TColor
  icon: TCategoryIcon
  parentId?: ExpenseCategoryID | null
}

export type UpdateExpenseCategory = CreateExpenseCategory

export interface ExpenseCategory extends CreateExpenseCategory {
  id: ExpenseCategoryID
  createdAt: TDateISO
}

export type ExpenseCategories = Record<string, ExpenseCategory>

export const CategoryTypeConst = {expense: 'expense', income: 'income'} as const
export type CategoryType = (typeof CategoryTypeConst)[keyof typeof CategoryTypeConst]
