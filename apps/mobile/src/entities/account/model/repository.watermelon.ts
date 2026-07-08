import {Q} from '@nozbe/watermelondb'
import type {AccountModel} from '@shared/database'
import {database} from '@shared/database'
import type {TDateISO} from '@shared/lib/dates'
import {eventBus} from '@shared/lib/eventBus'
import type {Account, AccountID, CreateAccount, UpdateAccount} from './models'

export interface IAccountsRepo {
  observeList(): {
    subscribe: (next: (v: Account[]) => void) => {unsubscribe: () => void}
  }
  fetchListOnce(): Promise<Account[]>
  getAccount(id: AccountID): Promise<Account | null>
  createAccount(data: CreateAccount & {id: AccountID; createdAt: TDateISO}): Promise<Account>
  updateAccount(id: AccountID, patch: UpdateAccount): Promise<void>
  deleteAccount(id: AccountID): Promise<void>
  deleteAccountsByCurrency(currencyId: string): Promise<string[]>
}

export const AccountsRepo: IAccountsRepo = {
  observeList() {
    const watched = [
      'id',
      'title',
      'icon',
      'currencyId',
      'initialBalance',
      'createdAt',
    ] as const satisfies (keyof Account)[]

    return {
      subscribe(next: (v: Account[]) => void) {
        const makeSource = () => buildQuery().observeWithColumns(watched)

        let sub = makeSource().subscribe((rows: AccountModel[]) => {
          next(rows.map(mapModel))
        })

        const onStart = () => {
          sub.unsubscribe()
          next([])
        }
        const onDone = () => {
          sub = makeSource().subscribe((rows: AccountModel[]) => next(rows.map(mapModel)))
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

  async fetchListOnce() {
    const rows = await buildQuery().fetch()
    return rows.map(mapModel)
  },

  async getAccount(id) {
    try {
      const r = await collection().find(String(id))
      return mapModel(r)
    } catch {
      return null
    }
  },

  async createAccount(data) {
    return database.write(async () => {
      const created = await collection().create((a) => {
        a._raw.id = String(data.id)
        a.title = data.title
        a.icon = data.icon
        a.currencyId = data.currencyId
        a.initialBalance = data.initialBalance
        a.createdAt = data.createdAt
      })
      return created
    })
  },

  async updateAccount(id, patch) {
    const rec = await collection().find(String(id))
    await database.write(async () => {
      await rec.update((a) => {
        if (patch.title !== undefined) a.title = patch.title
        if (patch.icon !== undefined) a.icon = patch.icon
        if (patch.currencyId !== undefined) a.currencyId = patch.currencyId
        if (patch.initialBalance !== undefined) a.initialBalance = patch.initialBalance
      })
    })
  },

  async deleteAccount(id) {
    const rec = await collection().find(String(id))
    await database.write(async () => {
      await rec.destroyPermanently()
    })
  },

  async deleteAccountsByCurrency(currencyId) {
    const rows = await collection().query(Q.where('currencyId', currencyId)).fetch()
    if (!rows.length) return []

    const ids = rows.map((r) => r.id)

    await database.write(async () => {
      await database.batch(...rows.map((r) => r.prepareDestroyPermanently()))
    })

    return ids
  },
}

// PARTS

const collection = () => database.get<AccountModel>('accounts')

const mapModel = (r: AccountModel): Account => ({
  id: r.id,
  title: r.title,
  icon: r.icon,
  currencyId: r.currencyId,
  initialBalance: r.initialBalance,
  createdAt: r.createdAt,
})

function buildQuery() {
  return collection().query()
}
