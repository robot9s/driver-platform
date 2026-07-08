import {Q} from '@nozbe/watermelondb'
import {database} from './database'
import type {MetaModel} from './models/MetaModel'

const metaCol = () => database.get<MetaModel>('meta')

export async function getMeta(key: string): Promise<string | null> {
  const rows = await metaCol().query(Q.where('key', key)).fetch()
  return rows[0]?.value ?? null
}

export async function setMeta(key: string, value: string) {
  const rows = await metaCol().query(Q.where('key', key)).fetch()
  await database.write(async () => {
    if (rows.length) {
      await rows[0].update((m) => {
        m.value = value
      })
    } else {
      await metaCol().create((m) => {
        m._raw.id = `${key}:${Date.now()}`
        m.key = key
        m.value = value
      })
    }
  })
}
