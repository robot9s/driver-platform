import {logEvent} from '@react-native-firebase/analytics'
import {useCallback, useEffect, useState} from 'react'
import uuid from 'react-native-uuid'
import {firebaseAnalytics} from '@shared/config/firebase'
import {CategoriesRepo} from './repository.watermelon'
import type {
  IncomeCategory,
  ExpenseCategory,
  CreateIncomeCategory,
  CreateExpenseCategory,
  UpdateIncomeCategory,
  UpdateExpenseCategory,
  IncomeCategoryID,
  ExpenseCategoryID,
  CategoryType,
} from './models'

export function useCategoriesObserved(type?: CategoryType) {
  const [list, setList] = useState<(IncomeCategory | ExpenseCategory)[] | null>(null)

  useEffect(() => {
    const sub = CategoriesRepo.observeList(type).subscribe(setList)
    return () => sub.unsubscribe()
  }, [type])

  const isLoading = list === null
  return {categories: list ?? [], isLoading}
}

export function useCategoriesOnce(type?: CategoryType) {
  const [data, setData] = useState<(IncomeCategory | ExpenseCategory)[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await CategoriesRepo.fetchListOnce(type)
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
  }, [type])

  return {data: data ?? [], isLoading: data === null && !error, error}
}

export function useCategoryOnce(id?: string) {
  const [cat, setCat] = useState<IncomeCategory | ExpenseCategory | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!id) return
      const res = await CategoriesRepo.getById(id)
      if (alive) setCat(res)
    })()
    return () => {
      alive = false
    }
  }, [id])

  return cat
}

export function useCreateIncomeCategory() {
  return useCallback(async (data: CreateIncomeCategory) => {
    const id = String(uuid.v4())
    const createdAt = new Date().toISOString()

    await CategoriesRepo.createIncomeCategory({id, createdAt, ...data})

    void logEvent(firebaseAnalytics, 'category_created', {
      category_id: id,
      category_name: data.title,
      category_type: 'expense',
      category_color: data.color,
      category_icon: data.icon,
    })
  }, [])
}

export function useCreateExpenseCategory() {
  return useCallback(async (data: CreateExpenseCategory) => {
    const id = String(uuid.v4())
    const createdAt = new Date().toISOString()

    await CategoriesRepo.createExpenseCategory({id, createdAt, ...data})

    void logEvent(firebaseAnalytics, 'category_created', {
      category_id: id,
      category_name: data.title,
      category_type: 'expense',
      category_color: data.color,
      category_icon: data.icon,
    })
  }, [])
}

export function useUpdateIncomeCategory() {
  return useCallback(async (id: IncomeCategoryID, patch: UpdateIncomeCategory) => {
    await CategoriesRepo.updateIncomeCategory(id, patch)

    void logEvent(firebaseAnalytics, 'category_updated', {
      category_id: id,
      category_name: patch.title,
      category_type: 'expense',
      category_color: patch.color,
      category_icon: patch.icon,
    })
  }, [])
}

export function useUpdateExpenseCategory() {
  return useCallback(async (id: ExpenseCategoryID, patch: UpdateExpenseCategory) => {
    await CategoriesRepo.updateExpenseCategory(id, patch)

    void logEvent(firebaseAnalytics, 'category_updated', {
      category_id: id,
      category_name: patch.title,
      category_type: 'expense',
      category_color: patch.color,
      category_icon: patch.icon,
    })
  }, [])
}

export function useDeleteCategory() {
  return useCallback(async (id: string) => {
    await CategoriesRepo.deleteCategory(id)

    void logEvent(firebaseAnalytics, 'category_deleted', {
      category_id: id,
    })
  }, [])
}
