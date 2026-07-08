import * as FileSystem from 'expo-file-system/legacy'
import type {Database} from '@nozbe/watermelondb'

export async function exportTransactionsCSV(
  database: Database,
  opts?: {includeHeaders?: boolean}
): Promise<string> {
  const includeHeaders = opts?.includeHeaders ?? true
  const rows = await database.get('transactions').query().fetch()

  const lines: string[] = []
  if (includeHeaders) lines.push(CSV_COLUMNS.join(','))

  for (const model of rows) {
    const raw = model._raw as Record<string, unknown>
    const record: Record<CsvColumn, unknown> = {
      id: raw.id,
      date: raw.date,
      account_id: raw.account_id,
      amount: raw.amount,
      currency: raw.currency,
      category: raw.category ?? '',
      counterparty: raw.counterparty ?? '',
      transfer_account_id: raw.transfer_account_id ?? '',
      transfer_amount: raw.transfer_amount ?? '',
      transfer_currency: raw.transfer_currency ?? '',
      tags: tagsToText(raw.tags),
      location: raw.location ?? '',
      note: raw.note ?? '',
    }
    lines.push(CSV_COLUMNS.map((c) => csvEscape(record[c])).join(','))
  }

  const filename = `transactions_${new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)}.csv`
  const uri = FileSystem.cacheDirectory! + filename
  await FileSystem.writeAsStringAsync(uri, lines.join('\n'), {
    encoding: FileSystem.EncodingType.UTF8,
  })
  return uri
}

// PARTS

const CSV_COLUMNS = [
  'id',
  'date',
  'account_id',
  'amount',
  'currency',
  'category',
  'counterparty',
  'transfer_account_id',
  'transfer_amount',
  'transfer_currency',
  'tags',
  'location',
  'note',
] as const

const csvEscape = (val: unknown): string => {
  if (val == null) return ''
  const s = String(val)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const tagsToText = (v: unknown): string =>
  Array.isArray(v) ? v.join('|') : v != null ? String(v) : ''

// TYPES

type CsvColumn = (typeof CSV_COLUMNS)[number]
