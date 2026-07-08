import {useEffect, useState} from 'react'
import type {TransactionFilters} from '@entities/transaction'
import {useTransactionsObserved} from '@entities/transaction'

export const useAmountByMonth = (filters: TransactionFilters = {}) => {
  const {fromDateTimeRange, toDateTimeRange, type, accountId} = filters
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const {transactions, isLoading} = useTransactionsObserved(filters)

  useEffect(() => {
    const getAmountByMonth = async () => {
      try {
        const totalAmount = transactions.reduce((sum, transaction) => {
          return sum + transaction.amount
        }, 0)

        setAmount(totalAmount)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!isLoading) {
      getAmountByMonth()
    }
  }, [fromDateTimeRange, toDateTimeRange, type, accountId, transactions, isLoading])

  return {amount, loading}
}
