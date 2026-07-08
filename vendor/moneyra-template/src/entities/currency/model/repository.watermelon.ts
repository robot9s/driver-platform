import {Q} from '@nozbe/watermelondb'
import type {CurrencyModel} from '@shared/database'
import {database} from '@shared/database'
import type {TDateISO} from '@shared/lib/dates'
import {eventBus} from '@shared/lib/eventBus'
import type {Currency, CurrencyID, CreateCurrency, UpdateCurrency} from '../model/models'

export interface ICurrenciesRepo {
  observeList(): {
    subscribe(next: (v: Currency[]) => void): {unsubscribe: () => void}
  }
  fetchListOnce(): Promise<Currency[]>
  getCurrency(id: CurrencyID): Promise<Currency | null>
  createCurrency(data: CreateCurrency & {id: CurrencyID; createdAt: TDateISO}): Promise<Currency>
  updateCurrency(id: CurrencyID, patch: UpdateCurrency): Promise<void>
  deleteCurrency(id: CurrencyID): Promise<void>
  deleteCurrencies(ids: CurrencyID[]): Promise<void>
}

export const CurrenciesRepo: ICurrenciesRepo = {
  observeList() {
    return {
      subscribe(next: (v: Currency[]) => void) {
        const makeSource = () => buildQuery().observe()

        let sub = makeSource().subscribe((rows: CurrencyModel[]) => {
          const list = rows.map(mapModel).sort((a, b) => a.name.localeCompare(b.name))
          next(list)
        })

        const onStart = () => {
          sub.unsubscribe()
          next([])
        }
        const onDone = () => {
          sub = makeSource().subscribe((rows: CurrencyModel[]) => {
            const list = rows.map(mapModel).sort((a, b) => a.name.localeCompare(b.name))
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

  async fetchListOnce() {
    const rows = await buildQuery().fetch()
    return rows.map(mapModel).sort((a, b) => a.name.localeCompare(b.name))
  },

  async getCurrency(id) {
    try {
      const r = await currenciesCol().find(String(id))
      return mapModel(r)
    } catch {
      return null
    }
  },

  async createCurrency(data) {
    let created

    await database.write(async () => {
      created = await currenciesCol().create((c) => {
        c._raw.id = String(data.id)
        c.currency = data.currency
        c.name = data.name
        c.symbol = data.symbol
        c.symbolPosition = data.symbolPosition
        c.color = data.color
        c.createdAt = data.createdAt
        // c.sortOrder = data.sortOrder ?? 0
      })
    })

    return mapModel(created!)
  },

  async updateCurrency(id, patch) {
    const rec = await currenciesCol().find(String(id))
    await database.write(async () => {
      await rec.update((c) => {
        if (patch.currency !== undefined) c.currency = patch.currency
        if (patch.name !== undefined) c.name = patch.name
        if (patch.symbol !== undefined) c.symbol = patch.symbol
        if (patch.symbolPosition !== undefined) c.symbolPosition = patch.symbolPosition
        if (patch.color !== undefined) c.color = patch.color
        // if ((patch as any).sortOrder !== undefined) c.sortOrder = (patch as any).sortOrder
      })
    })
  },

  async deleteCurrency(id) {
    const rec = await currenciesCol().find(String(id))
    await database.write(async () => {
      await rec.destroyPermanently()
    })
  },

  async deleteCurrencies(ids) {
    if (!ids.length) return
    const rows = await currenciesCol()
      .query(Q.where('id', Q.oneOf(ids.map(String))))
      .fetch()
    if (!rows.length) return
    await database.write(async () => {
      await database.batch(...rows.map((r) => r.prepareDestroyPermanently()))
    })
  },
}

// PARTS

const currenciesCol = () => database.get<CurrencyModel>('currencies')

const mapModel = (r: CurrencyModel): Currency => ({
  id: r.id,
  currency: r.currency,
  name: r.name,
  symbol: r.symbol,
  symbolPosition: r.symbolPosition,
  color: r.color,
  createdAt: r.createdAt,
})

function buildQuery() {
  // при необходимости можно добавить where/ordering
  return currenciesCol().query()
}
