import Fuse from 'fuse.js'

export const searchCurrenciesByTitle = <T extends SearchCurrency>(
  transactions: T[],
  searchTerm?: string
): T[] => {
  searchTerm = searchTerm?.trim()
  if (!searchTerm) {
    return transactions
  }

  const fuse = new Fuse(transactions, {
    keys: ['name'] as (keyof SearchCurrency)[],
    ignoreLocation: true,
    threshold: 0.3,
  })
  const result = fuse.search(searchTerm)
  return result.map((i) => i.item)
}

// TYPES

interface SearchCurrency {
  name: string
}
