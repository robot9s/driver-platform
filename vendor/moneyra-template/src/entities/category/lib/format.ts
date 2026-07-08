import type {IncomeCategories, IncomeCategoryID} from '../model/models'

export const createCategoryString = (
  categories: IncomeCategories,
  categoryId: IncomeCategoryID,
  delimiter = ' / '
): string => {
  const category = categories[categoryId]
  const titles: string[] = [category.title]

  let parentId = category.parentId
  while (parentId) {
    const parentCategory = categories[parentId]
    titles.push(parentCategory.title)
    parentId = parentCategory.parentId
  }

  return titles.reverse().join(delimiter)
}
