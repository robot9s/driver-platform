import type {ExpenseCategoryID, IncomeCategoryID, ExpenseCategory} from '@entities/category'

export interface CategoryStatistics {
  categoryId: ExpenseCategoryID | IncomeCategoryID
  amount: number
  percentage: number
}

export interface CategoriesStatistics {
  totalAmount: number
  categories: CategoryStatistics[]
}

export interface CurrencyStatistics {
  incomeAmount: number
  expenseAmount: number
  expenseRootCategories: CategoriesStatistics
  incomeRootCategories: CategoriesStatistics
}

export interface StatisticsRecord {
  id: string
  amount: number
  percentage: number
  category: ExpenseCategory
}
