import {useCallback, useEffect, useState} from 'react'
import uuid from 'react-native-uuid'
import {CurrenciesRepo} from './repository.watermelon'
import type {Currency, CurrencyID, CreateCurrency, UpdateCurrency} from './models'

export function useCurrenciesObserved() {
  const [list, setList] = useState<Currency[]>([])

  useEffect(() => {
    const sub = CurrenciesRepo.observeList().subscribe(setList)
    return () => sub.unsubscribe()
  }, [])

  return list
}

export function useCurrenciesOnce() {
  const [data, setData] = useState<Currency[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await CurrenciesRepo.fetchListOnce()
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
  }, [])

  return {data: data ?? [], isLoading: data === null && !error, error}
}

export function useCurrencyOnce(id?: CurrencyID) {
  const [cur, setCur] = useState<Currency | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!id) return
      const res = await CurrenciesRepo.getCurrency(id)
      if (alive) setCur(res)
    })()
    return () => {
      alive = false
    }
  }, [id])

  return cur
}

export function useCreateCurrency() {
  return useCallback(async (data: CreateCurrency): Promise<Currency> => {
    const id = String(uuid.v4())
    const createdAt = new Date().toISOString()

    const created = await CurrenciesRepo.createCurrency({id, createdAt, ...data})
    return created
  }, [])
}

export function useUpdateCurrency() {
  return useCallback(async (id: CurrencyID, patch: UpdateCurrency) => {
    await CurrenciesRepo.updateCurrency(id, patch)
  }, [])
}

export function useDeleteCurrency() {
  return useCallback(async (id: CurrencyID) => {
    await CurrenciesRepo.deleteCurrency(id)
  }, [])
}
