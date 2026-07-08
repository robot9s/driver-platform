import {useEffect, useState} from 'react'
import type {ExpenseCategory, IncomeCategory} from '@entities/category'
import {useCategoriesObserved} from '@entities/category'
import type {TransactionFilters} from '@entities/transaction'
import {useTransactionsObserved} from '@entities/transaction'

export const useCategoriesStatistics = (filters: TransactionFilters) => {
  const {fromDateTimeRange, toDateTimeRange, accountId} = filters

  const [statistics, setStatistics] = useState<{
    income: TStatistics
    expense: TStatistics
  }>({
    income: {totalAmount: 0, categories: [], transactionCount: 0},
    expense: {totalAmount: 0, categories: [], transactionCount: 0},
  })

  const {categories: expenseCategories} = useCategoriesObserved('expense')
  const {categories: incomeCategories} = useCategoriesObserved('income')
  const {transactions} = useTransactionsObserved(filters)

  useEffect(() => {
    const getCategoriesStatistics = async () => {
      try {
        const result = {
          income: {
            totalAmount: 0,
            categories: {} as Record<string, TCategoryStatistics>,
            transactionCount: 0,
          },
          expense: {
            totalAmount: 0,
            categories: {} as Record<string, TCategoryStatistics>,
            transactionCount: 0,
          },
        }

        transactions.forEach((t) => {
          const {type, categoryId, amount} = t
          const categoryMap = type === 'income' ? incomeCategories : expenseCategories
          const target = result[type]

          target.totalAmount += amount
          target.transactionCount += 1

          if (!target.categories[categoryId]) {
            target.categories[categoryId] = {
              categoryId,
              amount: 0,
              percentage: 0,
              category: categoryMap.find((category) => category.id === categoryId)!,
            }
          }

          target.categories[categoryId].amount += amount
        })

        const formatStats = (data: typeof result.income): TStatistics => {
          const categoriesArray = Object.values(data.categories).map((cat) => ({
            ...cat,
            percentage: parseFloat(((cat.amount / data.totalAmount) * 100).toFixed(2)),
          }))
          return {
            totalAmount: data.totalAmount,
            transactionCount: data.transactionCount,
            categories: categoriesArray.sort((a, b) => b.amount - a.amount),
          }
        }

        setStatistics({
          income: formatStats(result.income),
          expense: formatStats(result.expense),
        })
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }

    getCategoriesStatistics()
  }, [transactions, fromDateTimeRange, toDateTimeRange, accountId])

  return statistics
}

// TYPES

type TStatistics = {
  totalAmount: number
  categories: TCategoryStatistics[]
  transactionCount: number
}

type TCategoryStatistics = {
  categoryId: string
  category: IncomeCategory | ExpenseCategory
  amount: number
  percentage: number
}

export type {TCategoryStatistics}
