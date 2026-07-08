import {Q} from '@nozbe/watermelondb'
import type {PartialBackupTables, TableName, BaseRow} from './validate'
import type {Database, Collection, Model} from '@nozbe/watermelondb'

const ORDER: TableName[] = ['accounts', 'categories', 'currencies', 'budgets', 'transactions']

export async function importFullBackupJSON(
  db: Database,
  tables: PartialBackupTables
): Promise<void> {
  const opsAll: Model[] = []

  for (const name of ORDER) {
    const rows = tables[name]
    if (!rows || rows.length === 0) continue
    const ops = await prepareUpserts(db.get(name), rows)
    if (ops.length) opsAll.push(...ops)
  }

  if (opsAll.length === 0) return

  await db.write(async () => {
    await db.batch(...opsAll)
  })
}

// PARTS

async function prepareUpserts(collection: Collection<Model>, rows: BaseRow[]): Promise<Model[]> {
  const ids = rows.map((r) => r.id)
  const existing = ids.length ? await collection.query(Q.where('id', Q.oneOf(ids))).fetch() : []

  const getModelId = (m: Model): string => (m as unknown as {id: string}).id
  const byId = new Map<string, Model>(existing.map((m) => [getModelId(m), m]))

  const ops: Model[] = []

  for (const row of rows) {
    const found = byId.get(row.id)
    if (found) {
      ops.push(
        found.prepareUpdate((rec: Model) => {
          assignFields(rec, row)
        })
      )
    } else {
      ops.push(
        collection.prepareCreate((rec: Model) => {
          setRawId(rec, row.id)
          assignFields(rec, row)
        })
      )
    }
  }

  return ops
}

function assignFields(rec: Model, row: BaseRow): void {
  const target = rec as unknown as Record<string, unknown>
  for (const [k, v] of Object.entries(row)) {
    if (k === 'id' || k === '_status' || k === '_changed') continue
    target[k] = v
  }
}

function setRawId(rec: Model, id: string): void {
  const rawHolder = rec as unknown as {_raw?: {id?: string}}
  if (!rawHolder._raw) rawHolder._raw = {}
  rawHolder._raw.id = id
}
