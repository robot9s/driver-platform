import {useEffect, useState} from 'react'
import {useAccountsObserved} from '@entities/account'
import {useCurrenciesObserved} from '@entities/currency'
import {TransactionTypeConst, useTransactionsObserved} from '@entities/transaction'
import {useMoneyFormatter} from '@shared/lib/format'
import {minus, plus} from '@shared/lib/number'

export const useBalanceAccount = (accountId: string) => {
  const formatMoney = useMoneyFormatter()
  const [balanceAccount, setBalanceAccount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const {transactions, isLoading} = useTransactionsObserved({accountId})
  const accounts = useAccountsObserved()
  const currencies = useCurrenciesObserved()

  const account = accounts.find((account) => account.id === accountId)
  const currency = currencies.find((currency) => currency.id === account?.currencyId)
  let balance = account?.initialBalance ?? 0

  useEffect(() => {
    const getBalanceAccount = async () => {
      try {
        for (const transaction of transactions) {
          switch (transaction.type) {
            case TransactionTypeConst.expense: {
              balance = minus(balance, transaction.amount)
              break
            }
            case TransactionTypeConst.income: {
              balance = plus(balance, transaction.amount)
              break
            }

            default:
              throw new Error('Impossible transaction type')
          }
        }

        setBalanceAccount(balance)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(false)
      }
    }
    if (!isLoading) {
      getBalanceAccount()
    }
  }, [accountId, transactions, isLoading])

  return {loading, balance: formatMoney(Number(balanceAccount), currency?.currency ?? '')}
}
