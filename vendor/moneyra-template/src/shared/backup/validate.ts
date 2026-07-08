const KNOWN: TableName[] = ['accounts', 'categories', 'currencies', 'budgets', 'transactions']

const MAX_TOTAL_ROWS = 100_000

export function validateBackupShape(input: unknown): ValidBackup {
  if (!input || typeof input !== 'object') {
    throw new Error('ImportScreen.errors.bad_shape')
  }

  const obj = input as Record<string, unknown>
  const version = obj.version as number | string | undefined
  const exportedAt = obj.exportedAt as string | undefined
  const tables = obj.tables

  if (!tables || typeof tables !== 'object' || Array.isArray(tables)) {
    throw new Error('ImportScreen.errors.no_tables')
  }
  const tblObj = tables as Record<string, unknown>

  const result: BackupTables = {
    accounts: [],
    categories: [],
    currencies: [],
    budgets: [],
    transactions: [],
  }

  let total = 0

  for (const name of KNOWN) {
    const maybe = tblObj[name]
    if (maybe == null) continue
    if (!Array.isArray(maybe)) {
      throw new Error(`ImportScreen.errors.table_not_array:${name}`)
    }

    const seen = new Set<string>()
    const dedup: BaseRow[] = []
    for (let i = maybe.length - 1; i >= 0; i--) {
      const rUnknown = maybe[i] as unknown
      if (!rUnknown || typeof rUnknown !== 'object') {
        throw new Error(`ImportScreen.errors.row_missing_id:${name}`)
      }
      const r = rUnknown as Record<string, unknown>
      const id = r.id
      if (id == null || (typeof id !== 'string' && typeof id !== 'number')) {
        throw new Error(`ImportScreen.errors.row_missing_id:${name}`)
      }
      const key = String(id)
      if (!seen.has(key)) {
        seen.add(key)
        dedup.push({id: key, ...r})
      }
    }

    dedup.reverse()
    ;(result as unknown as Record<TableName, BaseRow[]>)[name] = dedup
    total += dedup.length
  }

  if (total === 0) {
    throw new Error('ImportScreen.errors.empty_backup')
  }
  if (total > MAX_TOTAL_ROWS) {
    throw new Error('ImportScreen.errors.too_large')
  }

  if (exportedAt != null) {
    const d = new Date(String(exportedAt))
    if (Number.isNaN(d.getTime())) {
      throw new Error('ImportScreen.errors.bad_exported_at')
    }
  }

  return {version, exportedAt, tables: result}
}

// TYPES

type TableName = 'accounts' | 'categories' | 'currencies' | 'budgets' | 'transactions'

type BaseRow = {id: string} & Record<string, unknown>

type AccountsRow = BaseRow
type CategoriesRow = BaseRow
type CurrenciesRow = BaseRow
type BudgetsRow = BaseRow
type TransactionsRow = BaseRow

type BackupTables = {
  accounts: AccountsRow[]
  categories: CategoriesRow[]
  currencies: CurrenciesRow[]
  budgets: BudgetsRow[]
  transactions: TransactionsRow[]
}

type PartialBackupTables = Partial<BackupTables>

type ValidBackup = {
  version?: number | string
  exportedAt?: string
  tables: BackupTables
}

export type {TableName, BaseRow, PartialBackupTables, ValidBackup}
