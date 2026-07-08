import {Q} from '@nozbe/watermelondb'
import type {TransactionModel} from '@shared/database'
import {database} from '@shared/database'
import type {TDateISO} from '@shared/lib/dates'
import {eventBus} from '@shared/lib/eventBus'
import type {
  CreateTransaction,
  UpdateTransaction,
  Transaction,
  TransactionID,
  TransactionFilters,
  TransactionType,
} from './models'

interface ITransactionsRepo {
  observeList: (
    filters?: TransactionFilters,
    limit?: number
  ) => {subscribe: (next: (v: Transaction[]) => void) => {unsubscribe: () => void}}
  fetchPage: (opts?: PageOpts) => Promise<{rows: Transaction[]; nextCursor: PageCursor | null}>
  fetchListOnce: (filters?: TransactionFilters) => Promise<Transaction[]>
  getById: (id: TransactionID) => Promise<Transaction | null>
  create: (data: CreateTransaction & {id: TransactionID; createdAt: TDateISO}) => Promise<void>
  update: (id: TransactionID, patch: UpdateTransaction) => Promise<void>
  remove: (id: TransactionID) => Promise<void>
  removeByAccount: (accountId: string) => Promise<void>
  removeByExpenseCategories: (categoryIds: string[]) => Promise<void>
}

export const TransactionsRepo: ITransactionsRepo = {
  observeList(filters, limit) {
    const watched = [
      'type',
      'amount',
      'categoryId',
      'accountId',
      'datetime',
      'description',
      'createdAt',
    ] as const satisfies (keyof Transaction)[]

    return {
      subscribe(next: (v: Transaction[]) => void) {
        const makeSource = () => {
          let query = baseQuery(filters).extend(Q.sortBy('datetime', Q.desc))
          if (limit != null) query = query.extend(Q.take(limit))
          return query.observeWithColumns(watched)
        }

        let sub = makeSource().subscribe((rows: TransactionModel[]) => {
          next(rows.map(mapModel))
        })

        const onStart = () => {
          sub.unsubscribe()
          next([])
        }
        const onDone = () => {
          sub = makeSource().subscribe((rows: TransactionModel[]) => next(rows.map(mapModel)))
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

  async fetchPage(opts) {
    const {limit = 150, beforeTs, ...filters} = opts ?? {}
    let query = baseQuery(filters).extend(Q.sortBy('datetime', Q.desc))

    if (beforeTs) {
      query = query.extend(Q.where('datetime', Q.lt(beforeTs)))
    }

    query = query.extend(Q.take(limit))
    const rows = await query.fetch()
    const mapped = rows.map(mapModel)

    const nextCursor: PageCursor | null =
      mapped.length > 0 ? {beforeTs: mapped[mapped.length - 1].datetime} : null
    return {rows: mapped, nextCursor}
  },

  async fetchListOnce(filters) {
    const rows = await baseQuery(filters).extend(Q.sortBy('datetime', Q.desc)).fetch()
    return rows.map(mapModel)
  },

  async getById(id) {
    try {
      const r = await col().find(String(id))
      return mapModel(r)
    } catch {
      return null
    }
  },

  async create(data) {
    await database.write(async () => {
      await col().create((t) => {
        t._raw.id = String(data.id)
        t.createdAt = data.createdAt
        t.datetime = data.datetime
        t.amount = data.amount
        t.type = data.type // 'expense' | 'income'
        t.description = data.description
        t.categoryId = data.categoryId
        t.accountId = data.accountId
      })
    })
  },

  async update(id, patch) {
    const rec = await col().find(String(id))
    await database.write(async () => {
      await rec.update((t) => {
        if (patch.type !== undefined) t.type = patch.type
        if (patch.amount !== undefined) t.amount = patch.amount
        if (patch.categoryId !== undefined) t.categoryId = patch.categoryId
        if (patch.accountId !== undefined) t.accountId = patch.accountId
        if (patch.datetime !== undefined) t.datetime = patch.datetime
        if (patch.description !== undefined) t.description = patch.description
        // if (patch.groupDatetime !== undefined) t.groupDatetime = patch.groupDatetime
      })
    })
  },

  async remove(id) {
    const rec = await col().find(String(id))
    await database.write(async () => {
      await rec.destroyPermanently() // или markAsDeleted под синк
    })
  },

  async removeByAccount(accountId) {
    const rows = await col().query(Q.where('accountId', accountId)).fetch()
    if (!rows.length) return
    await database.write(async () => {
      await database.batch(...rows.map((r) => r.prepareDestroyPermanently()))
    })
  },

  async removeByExpenseCategories(categoryIds) {
    const rows = await col()
      .query(Q.where('type', 'expense'), Q.where('categoryId', Q.oneOf(categoryIds)))
      .fetch()
    if (!rows.length) return
    await database.write(async () => {
      await database.batch(...rows.map((r) => r.prepareDestroyPermanently()))
    })
  },
}

// PARTS

const col = () => database.get<TransactionModel>('transactions')

function mapModel(r: TransactionModel): Transaction {
  return {
    id: r.id,
    createdAt: r.createdAt,
    datetime: r.datetime,
    amount: r.amount,
    type: r.type, // 'expense' | 'income'
    description: r.description,
    categoryId: r.categoryId,
    accountId: r.accountId,
  }
}

function baseQuery(filters?: TransactionFilters) {
  let query = col().query()

  if (!filters) return query

  if (filters.fromDateTimeRange) {
    query = query.extend(Q.where('datetime', Q.gte(filters.fromDateTimeRange)))
  }
  if (filters.toDateTimeRange) {
    query = query.extend(Q.where('datetime', Q.lte(filters.toDateTimeRange)))
  }

  if (filters.type) {
    query = Array.isArray(filters.type)
      ? query.extend(Q.where('type', Q.oneOf(filters.type as TransactionType[])))
      : query.extend(Q.where('type', filters.type))
  }

  if (filters.accountId) {
    query = Array.isArray(filters.accountId)
      ? query.extend(Q.where('accountId', Q.oneOf(filters.accountId)))
      : query.extend(Q.where('accountId', filters.accountId))
  }

  if (filters.expenseCategoryIds?.length) {
    query = query.extend(
      Q.and(Q.where('type', 'expense'), Q.where('categoryId', Q.oneOf(filters.expenseCategoryIds)))
    )
  }

  if (filters.incomeCategoryId) {
    query = query.extend(
      Q.and(Q.where('type', 'income'), Q.where('categoryId', filters.incomeCategoryId))
    )
  }

  return query
}

// TYPES

type PageCursor = {beforeTs?: TDateISO}
type PageOpts = TransactionFilters & PageCursor & {limit?: number}
