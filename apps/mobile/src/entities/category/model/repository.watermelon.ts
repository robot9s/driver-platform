import {Q} from '@nozbe/watermelondb'
import type {CategoryModel} from '@shared/database'
import {database} from '@shared/database'
import type {TDateISO} from '@shared/lib/dates'
import {eventBus} from '@shared/lib/eventBus'
import type {
  CategoryType,
  IncomeCategory,
  ExpenseCategory,
  CreateIncomeCategory,
  CreateExpenseCategory,
  UpdateIncomeCategory,
  UpdateExpenseCategory,
  IncomeCategoryID,
  ExpenseCategoryID,
} from './models'

export interface ICategoriesRepo {
  observeList: (type?: CategoryType) => {
    subscribe: (next: (v: (IncomeCategory | ExpenseCategory)[]) => void) => {
      unsubscribe: () => void
    }
  }
  fetchListOnce: (type?: CategoryType) => Promise<(IncomeCategory | ExpenseCategory)[]>
  getById: (id: string) => Promise<IncomeCategory | ExpenseCategory | null>
  createIncomeCategory: (
    data: CreateIncomeCategory & {id: IncomeCategoryID; createdAt: TDateISO}
  ) => Promise<void>
  createExpenseCategory: (
    data: CreateExpenseCategory & {id: ExpenseCategoryID; createdAt: TDateISO}
  ) => Promise<void>
  updateIncomeCategory: (id: IncomeCategoryID, patch: UpdateIncomeCategory) => Promise<void>
  updateExpenseCategory: (id: ExpenseCategoryID, patch: UpdateExpenseCategory) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

export const CategoriesRepo: ICategoriesRepo = {
  observeList(type) {
    const watched = [
      'title',
      'color',
      'icon',
      'createdAt',
    ] as const satisfies (keyof ExpenseCategory)[]
    return {
      subscribe(next: (v: (IncomeCategory | ExpenseCategory)[]) => void) {
        const makeSource = () => {
          let q = categoriesCol().query()
          if (type) q = q.extend(Q.where('type', type))
          return q.observeWithColumns(watched)
        }

        let sub = makeSource().subscribe((rows) => next(rows.map(mapModel)))

        const onStart = () => {
          sub.unsubscribe()
          next([])
        }
        const onDone = () => {
          sub = makeSource().subscribe((rows) => next(rows.map(mapModel)))
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

  async fetchListOnce(type) {
    let query = categoriesCol().query()
    if (type) query = query.extend(Q.where('type', type))
    const rows = await query.fetch()
    return rows.map(mapModel)
  },

  async getById(id) {
    try {
      const rec = await categoriesCol().find(id)
      return mapModel(rec)
    } catch {
      return null
    }
  },

  async createIncomeCategory(data) {
    await database.write(async () => {
      await categoriesCol().create((c) => {
        c._raw.id = String(data.id)
        c.title = data.title
        c.color = data.color
        c.icon = data.icon
        c.parentId = data.parentId ?? null
        c.type = 'income'
        c.createdAt = data.createdAt
      })
    })
  },

  async createExpenseCategory(data) {
    await database.write(async () => {
      await categoriesCol().create((c) => {
        c._raw.id = String(data.id)
        c.title = data.title
        c.color = data.color
        c.icon = data.icon
        c.parentId = data.parentId ?? null
        c.type = 'expense'
        c.createdAt = data.createdAt
      })
    })
  },

  async updateIncomeCategory(id, patch) {
    const rec = await categoriesCol().find(String(id))
    await database.write(async () => {
      await rec.update((c) => {
        if (patch.title !== undefined) c.title = patch.title
        if (patch.color !== undefined) c.color = patch.color
        if (patch.icon !== undefined) c.icon = patch.icon
        if (patch.parentId !== undefined) c.parentId = patch.parentId
      })
    })
  },

  async updateExpenseCategory(id, patch) {
    const rec = await categoriesCol().find(String(id))
    await database.write(async () => {
      await rec.update((c) => {
        if (patch.title !== undefined) c.title = patch.title
        if (patch.color !== undefined) c.color = patch.color
        if (patch.icon !== undefined) c.icon = patch.icon
        if (patch.parentId !== undefined) c.parentId = patch.parentId
      })
    })
  },

  async deleteCategory(id) {
    const rec = await categoriesCol().find(String(id))
    await database.write(async () => {
      await rec.destroyPermanently()
    })
  },
}

// PARTS

const categoriesCol = () => database.get<CategoryModel>('categories')

function mapModel(r: CategoryModel): IncomeCategory | ExpenseCategory {
  return {
    id: r.id,
    title: r.title,
    color: r.color,
    icon: r.icon,
    parentId: r.parentId,
    type: r.type,
    createdAt: r.createdAt,
  } as IncomeCategory | ExpenseCategory
}
