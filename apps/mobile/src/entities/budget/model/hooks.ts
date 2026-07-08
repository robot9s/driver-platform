import {logEvent} from '@react-native-firebase/analytics'
import {useCallback, useEffect, useState} from 'react'
import uuid from 'react-native-uuid'
import {firebaseAnalytics} from '@shared/config/firebase'
import {BudgetsRepo, type BudgetFilters} from './repository.watermelon'
import type {BudgetRecord, BudgetRecordID, CreateBudgetRecord, UpdateBudgetRecord} from './models'

export function useBudgetsObserved(filters?: BudgetFilters) {
  const [list, setList] = useState<BudgetRecord[]>([])
  useEffect(() => {
    const sub = BudgetsRepo.observeList(filters).subscribe(setList)
    return () => sub.unsubscribe()
  }, [JSON.stringify(filters)])
  return list
}

export function useBudgetsOnce(filters?: BudgetFilters) {
  const [data, setData] = useState<BudgetRecord[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await BudgetsRepo.fetchListOnce(filters)
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
  return {data: data ?? [], isLoading: data === null && !error, error}
}

export function useBudgetOnce(id?: BudgetRecordID) {
  const [rec, setRec] = useState<BudgetRecord | null>(null)
  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!id) return
      const res = await BudgetsRepo.getById(id)
      if (alive) setRec(res)
    })()
    return () => {
      alive = false
    }
  }, [id])
  return rec
}

export function useCreateBudget() {
  return useCallback(async (data: CreateBudgetRecord) => {
    const id = String(uuid.v4())
    const createdAt = new Date().toISOString()
    await BudgetsRepo.createBudget({id, createdAt, ...data})

    void logEvent(firebaseAnalytics, 'budget_created', {
      budget_id: id,
      budget_name: data.name,
      budget_accountId: data.accountId,
      budget_period_amount: data.amountLimit,
      budget_period_type: data.period,
    })
  }, [])
}

export function useUpdateBudget() {
  return useCallback(async (id: BudgetRecordID, patch: UpdateBudgetRecord) => {
    await BudgetsRepo.updateBudget(id, patch)

    void logEvent(firebaseAnalytics, 'budget_updated', {
      budget_id: id,
      budget_name: patch.name,
      budget_accountId: patch.accountId,
      budget_period_amount: patch.amountLimit,
      budget_period_type: patch.period,
    })
  }, [])
}

export function useDeleteBudget() {
  return useCallback(async (id: BudgetRecordID) => {
    await BudgetsRepo.deleteBudget(id)

    void logEvent(firebaseAnalytics, 'budget_deleted', {
      budget_id: id,
    })
  }, [])
}

export function useDeleteBudgetsByAccount() {
  return useCallback(async (accountId: string) => {
    await BudgetsRepo.deleteBudgetsByAccount(accountId)
  }, [])
}

export function useDeleteBudgetsByCategory() {
  return useCallback(async (categoryId: string) => {
    await BudgetsRepo.deleteBudgetsByCategory(categoryId)
  }, [])
}
