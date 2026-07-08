import type {Transaction} from '@entities/transaction'
import type {TDateISO} from '@shared/lib/dates'

export function getMonthlySums({transactions, toDateISOString, locale}: TProps) {
  const toDate = new Date(toDateISOString)
  const monthlyMap = new Map<
    string,
    {month: string; monthIndex: number; year: number; label: string; sum: number}
  >()

  const months: {key: string; month: string; year: number; label: string}[] = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(toDate.getFullYear(), toDate.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    const month = date.toLocaleString(locale, {month: 'short'})
    const monthIndex = date.getMonth()
    const year = date.getFullYear()
    const label = `${month} ${year}`
    months.push({key, month, year, label})
    monthlyMap.set(key, {month, monthIndex, year, label, sum: 0})
  }

  for (const tx of transactions) {
    const date = new Date(tx.datetime)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (monthlyMap.has(key)) {
      monthlyMap.get(key)!.sum += tx.amount
    }
  }

  return months.map(({key}) => monthlyMap.get(key)!)
}

// TYPES

type TProps = {
  transactions: Transaction[]
  toDateISOString: TDateISO
  locale: string
}
