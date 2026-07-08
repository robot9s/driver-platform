import {CategoryList, useCategoriesObserved} from '@entities/category'

export const ExpenseCategoriesTabPanel = () => {
  const {categories: expenseCategories, isLoading} = useCategoriesObserved('expense')
  const rootCategories = Object.values(expenseCategories)

  return <CategoryList categories={rootCategories} type="expense" loading={isLoading} />
}
