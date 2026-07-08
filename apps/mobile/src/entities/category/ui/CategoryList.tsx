import {ActivityIndicator, FlatList, View} from 'react-native'
import {CategoriesEmptyIllustration} from '@shared/assets/illustrations'
import {useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'
import {CategoryCard} from './CategoryCard'
import type {CategoryCardCategory} from './CategoryCard'
import type {CategoryType} from '../model/models'

export const CategoryList = ({categories, type, loading}: ExpenseCategoryCardListProps) => {
  const {t} = useTranslation('CategoryList')

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshing={false}
      contentContainerClassName={cn('pt-4 gap-3 pb-10', categories.length <= 0 && 'flex-1')}
      automaticallyAdjustContentInsets={true}
      data={categories}
      renderItem={({item}) => (
        <CategoryCard
          key={item.id}
          category={item}
          type={type}
          className="bg-muted-foreground/10 p-1 rounded-lg active:bg-muted-foreground/5"
        />
      )}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center">
          <CategoriesEmptyIllustration className="h-[180px] w-[180px] text-muted-foreground" />
          <Text className="mt-6 text-center text-muted-foreground">{t('notFound.title')}</Text>
          <Text className="text-center text-muted-foreground">{t('notFound.body')}</Text>
        </View>
      }
    />
  )
}

// TYPES

interface ExpenseCategoryCardListProps {
  categories: CategoryCardCategory[]
  type: CategoryType
  loading?: boolean
}
