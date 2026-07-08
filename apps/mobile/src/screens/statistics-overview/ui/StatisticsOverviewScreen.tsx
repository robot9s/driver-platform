import {IconCategory} from '@tabler/icons-react-native'
import {useLocalSearchParams} from 'expo-router'
import {useState} from 'react'
import {View} from 'react-native'
import {TransactionListGroup} from '@widgets/transaction-list'
import {useCategoriesStatistics} from '@features/statistics'
import {useAccountsObserved} from '@entities/account'
import {useCategoriesObserved} from '@entities/category'
import {useCurrenciesObserved} from '@entities/currency'
import {useTransactionsOnce} from '@entities/transaction'
import {colorsPrimary, colorsSecondary} from '@shared/config/colors'
import {useTranslation} from '@shared/i18n'
import type {TDateISO} from '@shared/lib/dates'
import {useMoneyFormatter} from '@shared/lib/format'
import {useColorPalette} from '@shared/lib/palette'
import {useColorScheme} from '@shared/lib/theme'
import {Text} from '@shared/ui/text'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import {MonthYearPicker} from '@shared/ui-primitives/MonthYearPicker'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {useStatisticsFiltersStore} from '../../statistics/model/store'
import ChartExpenseByMonths from './ChartExpenseByMonths'

export default function StatisticsOverviewScreen() {
  const {t} = useTranslation('StatisticsOverviewScreen')
  const {id: categoryId} = useLocalSearchParams<{id: string}>()
  const id = String(categoryId)

  if (typeof id === 'undefined') {
    throw new Error('Impossible category id')
  }
  const {colorScheme} = useColorScheme()
  const {getColor} = useColorPalette()
  const formatMoney = useMoneyFormatter()
  const filters = useStatisticsFiltersStore((state) => state.filters)
  const {fromDateTimeRange, toDateTimeRange, type, accountId} = filters

  const currencies = useCurrenciesObserved()
  const accounts = useAccountsObserved()
  const {categories: expenseCategories} = useCategoriesObserved('expense')
  const {categories: incomeCategories} = useCategoriesObserved('income')

  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: fromDateTimeRange!,
    to: toDateTimeRange!,
  })
  const selectedAccountId = accountId ?? accounts[0]?.id
  const account = accounts.find((account) => account.id === selectedAccountId)
  const currency = currencies.find((currency) => currency.id === account?.currencyId)

  const statistics = useCategoriesStatistics({
    fromDateTimeRange: timeRange.from,
    toDateTimeRange: timeRange.to,
    type,
    accountId: selectedAccountId,
  })

  const {income, expense} = statistics ?? {}
  const categories = type === 'expense' ? expense.categories : income.categories
  const stat = categories?.find((s) => s.categoryId === categoryId)

  const handleSetTimeRange = (timeRange: TimeRange) => {
    setTimeRange({
      from: timeRange.from,
      to: timeRange.to,
    })
  }

  const category =
    filters.type === 'expense'
      ? expenseCategories.find((category) => category.id === categoryId)
      : incomeCategories.find((category) => category.id === categoryId)

  const {transactions, isLoading} = useTransactionsOnce({
    expenseCategoryIds: [categoryId],
    fromDateTimeRange: timeRange.from,
    toDateTimeRange: timeRange.to,
    accountId: selectedAccountId,
  })

  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <View className="flex-1 gap-4">
        <MonthYearPicker
          timeRange={{
            from: timeRange.from!,
            to: timeRange.to!,
          }}
          onChange={handleSetTimeRange}
        />
        <View className="flex-row items-center justify-center gap-3 mx-6">
          <View
            className="h-10 w-10 items-center justify-center rounded-lg"
            style={{
              backgroundColor: category?.color
                ? colorsSecondary[category.color][colorScheme]
                : getColor('--secondary'),
            }}
          >
            {category?.icon ? (
              <GenericIcon
                name={category.icon}
                className="size-8 text-secondary-foreground"
                color={colorsPrimary[category.color][colorScheme]}
              />
            ) : (
              <IconCategory className="size-8 text-secondary-foreground text-wrap" />
            )}
          </View>
          <View className="max-w-[95%]">
            <Text className="font-semibold text-4xl mt-1.5">
              {category?.title ?? 'Uncategorized'}
            </Text>
          </View>
        </View>
        <View className="items-center gap-1 mb-3 px-4">
          <Text className="text-md text-muted-foreground uppercase">{t('spend')}</Text>
          <View className="flex-row gap-2 items-end">
            <Text className="text-4xl text-amount-negative font-semibold" adjustsFontSizeToFit>
              {formatMoney(stat?.amount ?? 0, currency?.currency)}
            </Text>
            <View className="bg-muted rounded-full px-2 mb-2 -mr-10">
              <Text className="text-md">{stat?.percentage ?? 0}%</Text>
            </View>
          </View>
        </View>
        <ChartExpenseByMonths
          categoryId={categoryId}
          from={timeRange.from}
          to={timeRange.to}
          accountId={selectedAccountId}
          currency={currency}
          onChange={handleSetTimeRange}
        />
        <View className="flex-1">
          <TransactionListGroup
            transactions={transactions}
            loading={isLoading}
            showEmptyState
            onBack={true}
          />
        </View>
      </View>
    </ScreenContent>
  )
}

type TimeRange = {
  from: TDateISO
  to: TDateISO
}
