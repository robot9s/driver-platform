import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {IconPlus} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import type {CategoryType, ExpenseCategory, IncomeCategory} from '@entities/category'
import {CategoryCheckboxCard, useCategoriesOnce} from '@entities/category'
import {useUserEntitlements} from '@entities/subscription'
import {ENTITLEMENT_LIMIT} from '@shared/config/appLimits'
import {useTranslation} from '@shared/i18n'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import type {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types'

export const CategorySheet = ({
  type,
  onSelect,
  closeSheetModal,
  value,
  multiple = false,
}: CategorySheetProps) => {
  const {t} = useTranslation('CategoryPicker')
  const router = useRouter()
  const {data: expenseCategories} = useCategoriesOnce('expense')
  const {data: incomeCategories} = useCategoriesOnce('income')
  const {entitlement} = useUserEntitlements()
  const {bottom} = useSafeAreaInsets()

  const isExceeded =
    ENTITLEMENT_LIMIT[entitlement]?.maxExpenseCategories <=
    (Object.keys(expenseCategories).length ?? 0)

  const categories = type === 'income' ? incomeCategories : expenseCategories
  const categoryIds = String(value)
    .split(',')
    .map((item) => item.trim())

  const selectedCategories = Object.values(categories).filter((category) => {
    if (Array.isArray(categoryIds)) {
      return categoryIds.some((id) => id === category.id)
    } else {
      return category.id === value
    }
  })

  return (
    <BottomSheetFlatList
      data={Object.values(categories)}
      numColumns={3}
      keyExtractor={(i: IncomeCategory | ExpenseCategory) => i.id}
      columnWrapperClassName="flex-wrap"
      contentContainerClassName="px-4"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListHeaderComponent={
        <View className="flex-row justify-between items-center pb-5 px-2">
          <Text className="text-lg">{t('title')}</Text>
          <Button
            className="rounded-full"
            size="icon"
            variant="ghost"
            onPress={() => {
              closeSheetModal?.()
              router.push(!isExceeded ? '/categories/create' : '/paywall?highlight=categories')
            }}
          >
            <IconPlus className="size-6 text-foreground" />
          </Button>
        </View>
      }
      contentContainerStyle={{paddingBottom: bottom + 16}}
      renderItem={({item: category}: {item: IncomeCategory | ExpenseCategory}) => {
        return (
          <CategoryCheckboxCard
            key={category.id}
            category={category}
            checked={selectedCategories.some((c) => c.id === category.id)}
            onClick={() => {
              if (multiple) {
                if (value?.includes(category.id) && Array.isArray(value)) {
                  const index = value.indexOf(category.id)
                  value.splice(index, 1)
                  onSelect(value)
                } else {
                  onSelect([category.id, ...(value as string[])])
                }
              } else {
                onSelect(category.id)
                closeSheetModal?.()
              }
            }}
          />
        )
      }}
      ListFooterComponent={
        multiple ? (
          <Button onPress={() => closeSheetModal?.()} className="mt-5 mx-2">
            <Text>{t('save')}</Text>
          </Button>
        ) : null
      }
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center">
          <Text className="mt-6 text-center text-muted-foreground">{t('notFound.title')}</Text>
          <Text className="text-center text-muted-foreground">{t('notFound.body')}</Text>
        </View>
      }
    />
  )
}

// TYPES

interface CategorySheetProps {
  type: CategoryType
  onSelect: (id: string | string[]) => void
  closeSheetModal?: BottomSheetMethods['close']
  value?: string | string[] | null
  multiple?: boolean
}
