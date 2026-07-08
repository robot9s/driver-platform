import {Q} from '@nozbe/watermelondb'
import type {BudgetModel} from '@shared/database'
import {database} from '@shared/database'
import type {TDateISO} from '@shared/lib/dates'
import {eventBus} from '@shared/lib/eventBus'
import type {BudgetRecord, BudgetRecordID, CreateBudgetRecord, UpdateBudgetRecord} from './models'

export interface IBudgetsRepo {
  observeList: (filters?: BudgetFilters) => {
    subscribe: (next: (v: BudgetRecord[]) => void) => {unsubscribe: () => void}
  }
  fetchListOnce: (filters?: BudgetFilters) => Promise<BudgetRecord[]>
  getById: (id: BudgetRecordID) => Promise<BudgetRecord | null>
  createBudget: (
    data: CreateBudgetRecord & {id: BudgetRecordID; createdAt: TDateISO}
  ) => Promise<void>
  updateBudget: (id: BudgetRecordID, patch: UpdateBudgetRecord) => Promise<void>
  deleteBudget: (id: BudgetRecordID) => Promise<void>
  deleteBudgetsByAccount: (accountId: string) => Promise<void>
  deleteBudgetsByCategory: (categoryId: string) => Promise<void>
}

export const BudgetsRepo: IBudgetsRepo = {
  observeList(filters) {
    const watched = [
      'id',
      'icon',
      'amountLimit',
      'accountId',
      'name',
    ] as const satisfies (keyof BudgetRecord)[]

    return {
      subscribe(next: (v: BudgetRecord[]) => void) {
        const makeSource = () => buildQuery(filters).observeWithColumns(watched)

        let sub = makeSource().subscribe((rows: BudgetModel[]) => {
          let list = rows.map(mapModel)
          if (filters?.categoryId) {
            list = list.filter((b) => b.categoryIds.includes(filters.categoryId!))
          }
          list = list.sort((a, b) => a.name.localeCompare(b.name))
          next(list)
        })

        const onStart = () => {
          sub.unsubscribe()
          next([])
        }
        const onDone = () => {
          sub = makeSource().subscribe((rows: BudgetModel[]) => {
            let list = rows.map(mapModel)
            if (filters?.categoryId)
              list = list.filter((b) => b.categoryIds.includes(filters.categoryId!))
            list = list.sort((a, b) => a.name.localeCompare(b.name))
            next(list)
          })
        }

        eventBus.on('db:reset:start', onStart)
        eventBus.on('db:reset:done', onDone)

        return {
          unsubscribe() {
            sub.unsubscribe()
            eventBus.off('db:reset:start', onStart)
            eventBus.off('db:reset:done', onDone)
          },
        }
      },
    }
  },

  async fetchListOnce(filters) {
    const rows = await buildQuery(filters).fetch()
    let list = rows.map(mapModel)
    if (filters?.categoryId) {
      list = list.filter((b) => b.categoryIds.includes(filters.categoryId!))
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  },

  async getById(id) {
    try {
      const r = await budgetsCol().find(String(id))
      return mapModel(r)
    } catch {
      return null
    }
  },

  async createBudget(data) {
    await database.write(async () => {
      await budgetsCol().create((b) => {
        b._raw.id = String(data.id)
        b.name = data.name
        b.period = data.period
        b.amountLimit = data.amountLimit
        b.icon = data.icon
        b.color = data.color
        b.categoryIds = stringifyCategories(data.categoryIds)
        b.accountId = data.accountId
        b.createdAt = data.createdAt
      })
    })
  },

  async updateBudget(id, patch) {
    const rec = await budgetsCol().find(String(id))
    await database.write(async () => {
      await rec.update((b) => {
        if (patch.name !== undefined) b.name = patch.name
        if (patch.period !== undefined) b.period = patch.period
        if (patch.amountLimit !== undefined) b.amountLimit = patch.amountLimit
        if (patch.icon !== undefined) b.icon = patch.icon
        if (patch.color !== undefined) b.color = patch.color
        if (patch.categoryIds !== undefined) b.categoryIds = stringifyCategories(patch.categoryIds)
        if (patch.accountId !== undefined) b.accountId = patch.accountId
      })
    })
  },

  async deleteBudget(id) {
    const rec = await budgetsCol().find(String(id))
    await database.write(async () => {
      await rec.destroyPermanently()
    })
  },

  async deleteBudgetsByAccount(accountId) {
    const rows = await budgetsCol().query(Q.where('accountId', accountId)).fetch()
    if (!rows.length) return
    await database.write(async () => {
      await database.batch(...rows.map((r) => r.prepareDestroyPermanently()))
    })
  },

  async deleteBudgetsByCategory(categoryId) {
    const rows = await budgetsCol().query().fetch()
    const toDelete = rows.filter((r) => parseCategories(r.categoryIds).includes(categoryId))
    if (!toDelete.length) return
    await database.write(async () => {
      await database.batch(...toDelete.map((r) => r.prepareDestroyPermanently()))
    })
  },
}

// PARTS

const budgetsCol = () => database.get<BudgetModel>('budgets')

const parseCategories = (s: string | null | undefined): string[] => {
  if (!s) return []
  try {
    return JSON.parse(s) as string[]
  } catch {
    return []
  }
}
const stringifyCategories = (a: string[] | null | undefined): string => JSON.stringify(a ?? [])

const mapModel = (r: BudgetModel): BudgetRecord => ({
  id: r.id,
  name: r.name,
  period: r.period,
  amountLimit: r.amountLimit,
  icon: r.icon,
  color: r.color,
  categoryIds: parseCategories(r.categoryIds),
  accountId: r.accountId,
  createdAt: r.createdAt,
})

export type BudgetFilters = {
  accountId?: string
  period?: 'monthly' | 'yearly'
  categoryId?: string
}

function buildQuery(filters?: BudgetFilters) {
  let query = budgetsCol().query()
  if (!filters) return query

  if (filters.accountId) {
    query = query.extend(Q.where('accountId', filters.accountId))
  }
  if (filters.period) {
    query = query.extend(Q.where('period', filters.period))
  }
  // categoryId — отфильтруем после fetch/observe (т.к. поле хранится как JSON-строка)
  return query
}
