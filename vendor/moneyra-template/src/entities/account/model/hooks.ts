import {logEvent} from '@react-native-firebase/analytics'
import {useCallback, useEffect, useState} from 'react'
import uuid from 'react-native-uuid'
import {firebaseAnalytics} from '@shared/config/firebase'
import {eventBus} from '@shared/lib/eventBus'
import {AccountsRepo} from './repository.watermelon'
import type {Account, AccountID, CreateAccount, UpdateAccount} from './models'

export function useAccountsObserved() {
  const [list, setList] = useState<Account[]>([])

  useEffect(() => {
    const sub = AccountsRepo.observeList().subscribe(setList)
    return () => sub.unsubscribe()
  }, [])

  return list
}

export function useAccountsOnce() {
  const [data, setData] = useState<Account[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await AccountsRepo.fetchListOnce()
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

export function useAccountOnce(id?: AccountID) {
  const [acc, setAcc] = useState<Account | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!id) return
      const res = await AccountsRepo.getAccount(id)
      if (alive) setAcc(res)
    })()
    return () => {
      alive = false
    }
  }, [id])

  return acc
}

export function useCreateAccount() {
  return useCallback(async (data: CreateAccount) => {
    const id = String(uuid.v4())
    const createdAt = new Date().toISOString()

    const account = await AccountsRepo.createAccount({id, createdAt, ...data})

    void logEvent(firebaseAnalytics, 'wallet_created', {
      wallet_id: account.id,
      wallet_name: account.title,
      wallet_date: account.createdAt,
      wallet_currencyId: account.currencyId,
      wallet_balance: account.initialBalance,
      wallet_icon: account.icon,
    })
    return account
  }, [])
}

export function useUpdateAccount() {
  return useCallback(async (id: AccountID, patch: UpdateAccount) => {
    await AccountsRepo.updateAccount(id, patch)
    eventBus.emit('transactions:refresh')
    void logEvent(firebaseAnalytics, 'wallet_updated', {
      wallet_id: id,
      wallet_name: patch.title,
      wallet_date: patch,
      wallet_currencyId: patch.currencyId,
      wallet_balance: patch.initialBalance,
      wallet_icon: patch.icon,
    })
  }, [])
}

export function useDeleteAccount() {
  return useCallback(async (id: AccountID) => {
    await AccountsRepo.deleteAccount(id)
    void logEvent(firebaseAnalytics, 'wallet_deleted', {
      wallet_id: id,
    })
  }, [])
}

export function useDeleteAccountsByCurrency() {
  return useCallback(async (currencyId: string) => {
    const accountIds = await AccountsRepo.deleteAccountsByCurrency(currencyId)
    return accountIds
  }, [])
}
