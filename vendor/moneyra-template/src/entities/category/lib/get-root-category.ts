interface Category {
  id: string
  parentId?: string | null
}

type Categories<T extends Category> = Record<string, T>

export function getRootCategory<T extends Category>(
  categories: Categories<T>,
  categoryId: string
): T {
  let category = categories[categoryId]
  while (category?.parentId) {
    category = categories[category.parentId]
  }
  return category ?? uncategorized
}

const uncategorized = {
  id: 'root',
  title: 'uncategorized',
}
