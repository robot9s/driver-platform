import {Platform} from 'react-native'
import {CloudStorage} from 'react-native-cloud-storage'
import {database} from '@shared/database'
import {eventBus} from '@shared/lib/eventBus'
import {exportFullBackupJSON} from './export-json'
import {importFullBackupJSON} from './import'
import type {PartialBackupTables} from './validate'

const DIR = 'Documents/Backups'

export async function listBackups(): Promise<Item[]> {
  await ensureCloudDir()
  const names = await CloudStorage.readdir(DIR)
  const items: Item[] = []
  for (const name of names.filter((n) => n.endsWith('.json'))) {
    const p = join(DIR, name)
    try {
      await CloudStorage.triggerSync(p)
    } catch {
      console.log('[backup] list failed')
    }
    const st = await CloudStorage.stat(p)
    items.push({name, size: st.size, mtime: st.mtime ? st.mtime.getTime() : undefined})
  }
  return items.sort((a, b) => (b.mtime ?? 0) - (a.mtime ?? 0))
}

export async function createBackup() {
  await ensureCloudDir()

  const localUri = await exportFullBackupJSON(database)
  const name = localUri.split('/').pop()!
  const remotePath = join(DIR, name)

  const localPath = normalizeLocalPath(localUri)

  if (await CloudStorage.exists(remotePath)) {
    await CloudStorage.unlink(remotePath)
  }
  await CloudStorage.uploadFile(remotePath, localPath, {mimeType: 'application/json'})
  return {name}
}

export async function restoreFromItem(item: Item) {
  try {
    eventBus.emit('db:reset:start', undefined)
    // a small tick so that subscribers have time to unsubscribe
    await new Promise((r) => setTimeout(r, 50))
    const p = join(DIR, item.name)
    try {
      await CloudStorage.triggerSync(p)
    } catch {
      console.log('[backup] restore failed')
    }
    const json = await CloudStorage.readFile(p)
    const data = JSON.parse(json) as Payload
    await database.write(async () => {
      await database.unsafeResetDatabase()
    })
    await importFullBackupJSON(database, data.tables)
  } finally {
    eventBus.emit('db:reset:done', undefined)
    eventBus.emit('transactions:refresh')
  }
}

export async function deleteItem(item: Item) {
  const p = join(DIR, item.name)
  if (await CloudStorage.exists(p)) {
    await CloudStorage.unlink(p)
  }
}

// PARTS

function normalizeLocalPath(uri: string) {
  // iOS: RN-натив ждёт обычный путь без file://
  // Android: библиотеке чаще подходит content:// или обычный путь; для expo — вернём file:// как есть
  return Platform.OS === 'ios' ? uri.replace(/^file:\/\//, '') : uri
}

async function ensureCloudDir() {
  if (!(await CloudStorage.exists(DIR))) {
    await CloudStorage.mkdir(DIR)
  }
}

function join(...parts: string[]) {
  return parts.filter(Boolean).join('/')
}

// TYPES

type Item = {name: string; size?: number; mtime?: number}

type Payload = {version: number; exportedAt: string; tables: PartialBackupTables}
