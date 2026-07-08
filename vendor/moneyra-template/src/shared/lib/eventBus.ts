type EventMap = {
  'transactions:refresh': void
  'accounts:changed': void
  'categories:changed': void
  'db:reset:start': void
  'db:reset:done': void
}

type EventKey = keyof EventMap
type Listener<K extends EventKey> = (payload: EventMap[K]) => void

class EventBus {
  private store = new Map<EventKey, Set<Listener<never>>>()

  on<K extends EventKey>(event: K, listener: Listener<K>) {
    if (!this.store.has(event)) {
      this.store.set(event, new Set())
    }
    ;(this.store.get(event) as Set<Listener<K>>).add(listener)
  }

  off<K extends EventKey>(event: K, listener: Listener<K>) {
    this.store.get(event)?.delete(listener)
  }

  emit<K extends EventKey>(event: K, payload?: EventMap[K]) {
    this.store.get(event)?.forEach((listener) => {
      ;(listener as Listener<K>)(payload)
    })
  }
}

export const eventBus = new EventBus()
