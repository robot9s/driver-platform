import * as FileSystem from 'expo-file-system/legacy'
import type {TableName} from './validate'
import type {Database} from '@nozbe/watermelondb'

export async function exportFullBackupJSON(database: Database): Promise<string> {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tables: {
      accounts: await fetchAll(database, 'accounts'),
      categories: await fetchAll(database, 'categories'),
      currencies: await fetchAll(database, 'currencies'),
      budgets: await fetchAll(database, 'budgets'),
      transactions: await fetchAll(database, 'transactions'),
    },
  }

  const filename = `backup_${payload.exportedAt.replace(/[:.]/g, '')}.json`
  const uri = FileSystem.cacheDirectory! + filename
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload), {
    encoding: FileSystem.EncodingType.UTF8,
  })
  return uri
}

// PARTS

function cleanRaw<T extends object>(raw: T): Omit<T, '_status' | '_changed'> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error,

  const {_status, _changed, ...rest} = raw
  return rest
}

async function fetchAll(database: Database, table: TableName) {
  const rows = await database.get(table).query().fetch()
  return rows.map((m) => cleanRaw(m._raw))
}
