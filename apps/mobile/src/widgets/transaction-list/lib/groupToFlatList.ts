import type {Transaction} from '@entities/transaction'
import {convertDateToLocalISOString} from '@shared/lib/dates'

export const groupTransactionsByDate = (transactions: Transaction[]): SectionItem[] => {
  const sorted = transactions.sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  )

  const flat: SectionItem[] = []
  for (const tx of sorted) {
    const date = convertDateToLocalISOString(tx.datetime, {skipTime: true})
    const last = flat[flat.length - 1]
    const lastDate =
      last && 'datetime' in last
        ? convertDateToLocalISOString(last.datetime, {skipTime: true})
        : null

    if (lastDate !== date) {
      const totalForDate = sorted
        .filter((t) => convertDateToLocalISOString(t.datetime, {skipTime: true}) === date)
        .reduce((sum, t) => sum + t.amount, 0)

      flat.push({
        date,
        total: totalForDate,
        accountId: tx.accountId,
        amount: Number(tx.amount),
      })
    }

    flat.push(tx)
  }

  return flat
}

// TYPES

export type TSectionHeader = {
  date: string
  total: number
  accountId: string
}

type SectionItem = Transaction | TSectionHeader
