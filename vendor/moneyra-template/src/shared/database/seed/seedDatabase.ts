import {Q} from '@nozbe/watermelondb'
import uuid from 'react-native-uuid'
import {database} from '../database'
import {
  DEFAULT_CURRENCIES,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from './seed.defaults'
import type {CategoryModel} from '../models/CategoryModel'
import type {CurrencyModel} from '../models/CurrencyModel'
import type {MetaModel} from '../models/MetaModel'

const SEED_KEY = 'seed_version'
const SEED_VERSION = '1'

export async function seedDatabaseIfNeeded() {
  const metaCol = database.get<MetaModel>('meta')
  const already = await metaCol
    .query(Q.where('key', SEED_KEY), Q.where('value', SEED_VERSION))
    .fetch()
  if (already.length) return

  const now = new Date().toISOString()

  await database.write(async () => {
    const currenciesCol = database.get<CurrencyModel>('currencies')
    for (const cur of DEFAULT_CURRENCIES) {
      const exist = await currenciesCol.query(Q.where('currency', cur.currency)).fetch()
      if (!exist.length) {
        await currenciesCol.create((c) => {
          c._raw.id = String(uuid.v4())
          c.currency = cur.currency
          c.name = cur.name
          c.symbol = cur.symbol
          c.symbolPosition = cur.symbolPosition
          c.color = cur.color
          c.createdAt = now
        })
      }
    }

    const categoriesCol = database.get<CategoryModel>('categories')
    for (const cat of DEFAULT_EXPENSE_CATEGORIES) {
      const exist = await categoriesCol
        .query(Q.where('title', cat.title), Q.where('type', 'expense'))
        .fetch()
      if (!exist.length) {
        await categoriesCol.create((c) => {
          c._raw.id = String(uuid.v4())
          c.title = cat.title
          c.icon = cat.icon
          c.color = cat.color
          c.type = 'expense'
          c.parentId = null
          c.createdAt = now
        })
      }
    }

    for (const cat of DEFAULT_INCOME_CATEGORIES) {
      const exist = await categoriesCol
        .query(Q.where('title', cat.title), Q.where('type', 'income'))
        .fetch()
      if (!exist.length) {
        await categoriesCol.create((c) => {
          c._raw.id = String(uuid.v4())
          c.title = cat.title
          c.icon = cat.icon
          c.color = cat.color
          c.type = 'income'
          c.parentId = null
          c.createdAt = now
        })
      }
    }

    await metaCol.create((m) => {
      m._raw.id = String(uuid.v4())
      m.key = SEED_KEY
      m.value = SEED_VERSION
    })
  })

  const currencies = await database.get<CurrencyModel>('currencies').query().fetch()
  return {currencies}
}
