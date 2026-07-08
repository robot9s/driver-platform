import {CategoryList, useCategoriesObserved} from '@entities/category'

export const IncomeCategoriesTabPanel = () => {
  const {categories: incomeCategories, isLoading} = useCategoriesObserved('income')
  const rootCategories = Object.values(incomeCategories)

  return <CategoryList categories={rootCategories} type="income" loading={isLoading} />
}
