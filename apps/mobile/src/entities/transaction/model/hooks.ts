import {logEvent} from '@react-native-firebase/analytics'
import {useCallback, useEffect, useRef, useState} from 'react'
import uuid from 'react-native-uuid'
import {firebaseAnalytics} from '@shared/config/firebase'
import {eventBus} from '@shared/lib/eventBus'
import {TransactionsRepo} from './repository.watermelon'
import type {
  CreateTransaction,
  UpdateTransaction,
  Transaction,
  TransactionFilters,
  TransactionID,
} from './models'

export function useTransactionsObserved(
  filters?: TransactionFilters,
  limit?: number,
  refreshKey: number = 0
) {
  const [data, setData] = useState<Transaction[] | null>(null)

  useEffect(() => {
    const sub = TransactionsRepo.observeList(filters, limit).subscribe((rows) => {
      setData(rows)
    })
    return () => sub.unsubscribe()
  }, [JSON.stringify(filters), limit, refreshKey])

  const isLoading = data === null
  return {transactions: data ?? [], isLoading}
}

export function useTransactionsOnce(filters?: TransactionFilters) {
  const [data, setData] = useState<Transaction[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await TransactionsRepo.fetchListOnce(filters)
        if (alive) setData(res)
      } catch (e: unknown) {
        if (e instanceof Error && alive) {
          setError(e)
        } else if (alive) {
          setError(new Error(String(e)))
        }
      }
    })()
    return () => {
      alive = false
    }
  }, [JSON.stringify(filters)])

  return {
    transactions: data ?? [],
    isLoading: data === null && !error,
    error,
  }
}

export function useTransactionsInfinite(filters?: TransactionFilters, pageSize = 50) {
  const [limit, setLimit] = useState(pageSize)
  const [endReached, setEndReached] = useState(false)
  const isPagingRef = useRef(false)
  const [isPaging, setIsPaging] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const {transactions, isLoading} = useTransactionsObserved(filters, limit, refreshKey)

  useEffect(() => {
    if (transactions.length < limit) setEndReached(true)
    else setEndReached(false)
  }, [transactions.length, limit])

  useEffect(() => {
    const rerender = () => setRefreshKey((k) => k + 1)
    eventBus.on('transactions:refresh', rerender)

    return () => {
      eventBus.off('transactions:refresh', rerender)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (isPagingRef.current || endReached) return
    isPagingRef.current = true
    setIsPaging(true)
    setLimit((prev) => prev + pageSize)

    queueMicrotask(() => {
      isPagingRef.current = false
      setIsPaging(false)
    })
  }, [pageSize, endReached])

  const refresh = useCallback(() => {
    setLimit(pageSize)
    setRefreshKey((k) => k + 1)
  }, [pageSize])

  return {
    transactions,
    loading: isLoading || isPaging,
    isHeadLoading: isLoading,
    isPaging,
    endReached,
    loadMore,
    refresh,
  }
}

export function useTransactionOnce(id?: TransactionID) {
  const [tx, setTx] = useState<Transaction | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!id) return
      const res = await TransactionsRepo.getById(id)
      if (alive) setTx(res)
    })()
    return () => {
      alive = false
    }
  }, [id])

  return tx
}

export function useCreateTransaction() {
  return useCallback(async (data: CreateTransaction) => {
    const id = String(uuid.v4())
    const createdAt = data.datetime

    await TransactionsRepo.create({id, createdAt, ...data})

    void logEvent(firebaseAnalytics, 'transaction_created', {
      transaction_id: id,
      transaction_amount: data.amount,
      transaction_category_id: data.categoryId,
      transaction_category_type: data.type,
      transaction_accountId: data.accountId,
      transaction_date: data.datetime,
      transaction_description: data.description,
    })
  }, [])
}

export function useUpdateTransaction() {
  return useCallback(async (id: TransactionID, patch: UpdateTransaction) => {
    await TransactionsRepo.update(id, patch)

    void logEvent(firebaseAnalytics, 'transaction_updated', {
      transaction_id: id,
      transaction_amount: patch.amount,
      transaction_category_id: patch.categoryId,
      transaction_category_type: patch.type,
      transaction_accountId: patch.accountId,
      transaction_date: new Date().toISOString(),
      transaction_description: patch.description,
      transaction_wallet_account_id: patch.accountId,
    })
  }, [])
}

export function useDeleteTransaction() {
  return useCallback(async (id: TransactionID) => {
    await TransactionsRepo.remove(id)

    void logEvent(firebaseAnalytics, 'transaction_deleted', {
      transaction_id: id,
    })
  }, [])
}

export function useDeleteTransactionsByAccount() {
  return useCallback(async (accountId: string) => {
    await TransactionsRepo.removeByAccount(accountId)
  }, [])
}

export function useDeleteTransactionsByExpenseCategories() {
  return useCallback(async (categoryIds: string[]) => {
    await TransactionsRepo.removeByExpenseCategories(categoryIds)
  }, [])
}
