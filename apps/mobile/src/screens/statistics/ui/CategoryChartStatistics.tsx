import {router} from 'expo-router'
import {View, Text, Pressable, FlatList} from 'react-native'
import {useCategoriesStatistics} from '@features/statistics'
import {useAccountsObserved} from '@entities/account'
import {useCurrenciesObserved} from '@entities/currency'
import {useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {useUserSettingsStore} from '@shared/stores/user-settings'
import {useStatisticsFiltersStore} from '../model/store'
import {CategoryStatisticsCard} from './CategoryStatisticsCard'
import {PieChartByCategory} from './PieChartByCategory'

const CategoryChartStatistics = () => {
  const {t} = useTranslation('StatisticsScreen')
  const filters = useStatisticsFiltersStore((state) => state.filters)
  const {fromDateTimeRange, toDateTimeRange, accountId, type} = filters

  const accounts = useAccountsObserved()
  const currencies = useCurrenciesObserved()

  const showStatisticsDiagram = useUserSettingsStore((state) => state.showStatisticsDiagram)

  const selectedAccountId = accountId ?? accounts[0]?.id
  const account = accounts?.find((account) => account.id === selectedAccountId)
  const currency = currencies?.find((currency) => currency.id === account?.currencyId)

  const statistics = useCategoriesStatistics({
    fromDateTimeRange,
    toDateTimeRange,
    accountId: selectedAccountId,
  })

  const {income, expense} = statistics ?? {}
  const categories = type === 'expense' ? expense.categories : income.categories
  const totalAmount = type === 'expense' ? expense.totalAmount : income.totalAmount
  const maxPercentage = Math.max(...(categories?.map((c) => c.percentage) ?? [1]))

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshing={false}
      contentContainerClassName={cn('gap-1 pb-[160px]', !showStatisticsDiagram && 'pt-2')}
      automaticallyAdjustContentInsets={true}
      data={categories}
      keyExtractor={(item) => item?.categoryId}
      ListHeaderComponent={
        showStatisticsDiagram ? (
          <PieChartByCategory
            categories={categories ?? []}
            total={totalAmount ?? 0}
            currency={currency}
          />
        ) : null
      }
      renderItem={({item, index}) => (
        <Pressable
          className="gap-4 my-1 active:bg-muted/30"
          onPress={() => {
            router.push({
              pathname: `/statistics/[id]`,
              params: {id: item.categoryId},
            })
          }}
        >
          <CategoryStatisticsCard
            statistics={item}
            currency={currency}
            index={index}
            type={type}
            maxPercentage={maxPercentage}
            isSingleCategory={categories.length === 1}
          />
        </Pressable>
      )}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center">
          <Text className="mt-6 text-center text-muted-foreground">{t('notFound.title')}</Text>
          <Text className="text-center text-muted-foreground">{t('notFound.body')}</Text>
        </View>
      }
    />
  )
}

export default CategoryChartStatistics
