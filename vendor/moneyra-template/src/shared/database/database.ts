import {Database} from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import * as FileSystem from 'expo-file-system/legacy'
import {migrations} from './migrations'
import {AccountModel} from './models/AccountModel'
import {BudgetModel} from './models/BudgetModel'
import {CategoryModel} from './models/CategoryModel'
import {CurrencyModel} from './models/CurrencyModel'
import {MetaModel} from './models/MetaModel'
import {TransactionModel} from './models/TransactionModel'
import {schema} from './schema'

/**
 * Keep filename stable across builds/runs.
 * IMPORTANT: If you change Expo slug/owner or bundle identifiers,
 * the sandbox (and therefore the DB location) also changes.
 */
const DB_FILE = 'moneyra'

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true,
  dbName: DB_FILE,
  onSetUpError: (e) => {
    console.log('Watermelon setup error:', e)
  },
})

export const database = new Database({
  adapter,
  modelClasses: [
    TransactionModel,
    AccountModel,
    CurrencyModel,
    CategoryModel,
    BudgetModel,
    MetaModel,
  ],
})

/**
 * DEBUG ONLY:
 * WatermelonDB stores the file under: <documentDirectory>/<dbName>
 * This probe helps verify that the SAME file is reused between app restarts
 * and lets you locate it if you want to copy it out and inspect it with
 * “DB Browser for SQLite”.
 *
 * Do NOT rely on this in production code.
 */
const dbPath = `${FileSystem.documentDirectory}${DB_FILE}.db`

async function probeDb() {
  const info = await FileSystem.getInfoAsync(dbPath)
  if (!info.exists) {
    console.log('DB path:', dbPath, 'exists: false')
    return
  }

  // When exists = true, result can still be a directory. Narrow it:
  if (info.isDirectory) {
    console.log('DB path is a directory:', dbPath)
    return
  }

  // Now TS knows it's a file-like result.
  // size / modificationTime may still be undefined on some platforms.
  console.log(
    `DB path: ${dbPath}, 
    exists: ${info.exists}, 
    size: ${info.size ?? 'unknown'}, 
    mtime: ${info.modificationTime ?? 'unknown'}`
  )
}

if (__DEV__) {
  probeDb()
}
