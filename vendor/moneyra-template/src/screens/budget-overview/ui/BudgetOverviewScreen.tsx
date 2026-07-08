import {IconPencil, IconExclamationCircle, IconCategory} from '@tabler/icons-react-native'
import {useLocalSearchParams, useRouter} from 'expo-router'
import {useState} from 'react'
import {ActivityIndicator, View} from 'react-native'
import {TransactionListGroup} from '@widgets/transaction-list'
import {useCategoriesStatistics} from '@features/statistics'
import {useAccountsObserved} from '@entities/account'
import {useBudgetsObserved} from '@entities/budget'
import {useCategoriesObserved} from '@entities/category'
import {useCurrenciesObserved} from '@entities/currency'
import {useTransactionsOnce} from '@entities/transaction'
import {colorsSecondary} from '@shared/config/colors'
import {useTranslation} from '@shared/i18n'
import type {TDateISO} from '@shared/lib/dates'
import {daysUntilEndOfMonth} from '@shared/lib/dates'
import {useMoneyFormatter} from '@shared/lib/format'
import {percentageOf} from '@shared/lib/number'
import {useColorPalette} from '@shared/lib/palette'
import {cn, useColorScheme} from '@shared/lib/theme'
import {globalStorage, STORAGE_CONSTANT_LAST_ACCOUNT_ID} from '@shared/storage/global-storage'
import {Badge} from '@shared/ui/badge'
import {Button} from '@shared/ui/button'
import {Progress} from '@shared/ui/progress'
import {Text} from '@shared/ui/text'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import {MonthYearPicker} from '@shared/ui-primitives/MonthYearPicker'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {useBudgetsFiltersStore} from '../../budgets/model/store'

export default function BudgetOverviewScreen() {
  const {t} = useTranslation('BudgetOverviewScreen')
  const {id: budgetId} = useLocalSearchParams<{id: string}>()
  const id = String(budgetId)

  if (typeof id === 'undefined') {
    throw new Error('Impossible budget id')
  }

  const {colorScheme} = useColorScheme()
  const {getColor} = useColorPalette()
  const formatMoney = useMoneyFormatter()
  const router = useRouter()

  const filters = useBudgetsFiltersStore((state) => state.filters)
  const {fromDateTimeRange, toDateTimeRange, type, accountId} = filters

  const accounts = useAccountsObserved()
  const currencies = useCurrenciesObserved()
  const budgetRecords = useBudgetsObserved()
  const {categories: expenseCategories} = useCategoriesObserved('expense')

  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: fromDateTimeRange!,
    to: toDateTimeRange!,
  })
  const budget = Object.values(budgetRecords).find((r) => r.id === id)
  const {name, categoryIds: catIds, amountLimit = 0} = budget ?? {}

  const selectedAccountId =
    accountId ?? globalStorage.getItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID) ?? accounts[0]?.id

  const account = accounts.find((account) => account.id === selectedAccountId)
  const currency = currencies.find((currency) => currency.id === account?.currencyId)

  const statistics = useCategoriesStatistics({
    type,
    accountId: selectedAccountId,
    fromDateTimeRange: timeRange.from,
    toDateTimeRange: timeRange.to,
  })
  const {income, expense} = statistics ?? {}
  const categories = type === 'expense' ? expense.categories : income.categories

  const categoryIds = String(catIds)
    .split(',')
    .map((item) => item.trim())

  let amountUsed = 0
  categories?.forEach((categorystatistics) => {
    if (categoryIds.includes(categorystatistics.categoryId)) {
      amountUsed = amountUsed + categorystatistics.amount
    }
  })

  const {transactions, isLoading} = useTransactionsOnce({
    expenseCategoryIds: categoryIds,
    fromDateTimeRange: timeRange.from,
    toDateTimeRange: timeRange.to,
    accountId: selectedAccountId,
  })

  const handleSetTimeRange = (timeRange: TimeRange) => {
    setTimeRange({
      from: timeRange.from,
      to: timeRange.to,
    })
  }

  if (!budget) {
    return (
      <View className="flex-1 items-center justify-center bg-muted">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScreenContent
      excludeEdges={['top', 'bottom']}
      navigationOptions={{
        headerTitleStyle: {
          color: getColor('--muted-foreground'),
        },
        headerRight: () => (
          <Button
            className="rounded-full"
            size="icon"
            variant="ghost"
            onPress={() => router.push(`/budget/${budgetId}/edit`)}
          >
            <IconPencil className="size-7 text-foreground" />
          </Button>
        ),
      }}
    >
      <MonthYearPicker
        timeRange={{
          from: timeRange.from!,
          to: timeRange.to!,
        }}
        onChange={handleSetTimeRange}
      />
      <View className="flex-1 gap-8 mt-3">
        <View className="gap-2">
          <Text className="px-4 text-center font-semibold text-3xl mt-2">{name}</Text>
          <View className="flex-row flex-wrap gap-3 justify-center">
            {categoryIds.map((id) => {
              const category = expenseCategories.find((category) => category.id === id)
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="flex-row px-3 pl-2 py-1"
                  style={{
                    backgroundColor: category?.color
                      ? colorsSecondary[category.color][colorScheme]
                      : getColor('--secondary'),
                  }}
                >
                  {category?.icon ? (
                    <GenericIcon
                      className="size-5 text-secondary-foreground/80"
                      name={category.icon}
                    />
                  ) : (
                    <IconCategory className="size-5 text-secondary-foreground/80" />
                  )}
                  <Text className="text-sm">{category?.title ?? t('uncategorized')}</Text>
                </Badge>
              )
            })}
          </View>
        </View>
        <View className="px-4 gap-3">
          <View className="flex-row justify-between items-end w-full">
            <View className="flex-row items-end basis-[70%] gap-2" style={{minWidth: 0}}>
              <Text
                className="text-3xl font-medium"
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{flexShrink: 1}}
              >
                {formatMoney(amountLimit, currency?.currency)}
              </Text>
              <Text className="text-lg text-muted-foreground pb-0.5">{t('budget')}</Text>
            </View>
            <View className="items-end justify-end basis-[30%] shrink-0">
              <Text className="text-muted-foreground" adjustsFontSizeToFit numberOfLines={1}>
                {getBudgetPeriodLabel(timeRange, t)}
              </Text>
            </View>
          </View>
          <View className="relative">
            <Progress
              className="h-8 bg-gray-300 dark:bg-gray-600"
              value={amountLimit < amountUsed ? 100 : percentageOf(amountLimit, amountUsed)}
              indicatorClassName={cn(percentageOf(amountLimit, amountUsed) > 90 && 'bg-red-500')}
            />
            <View className="absolute h-full left-[50%] items-center justify-center">
              <Text className="text-sm text-primary dark:text-muted">{`${Math.round(percentageOf(amountLimit, amountUsed))}%`}</Text>
            </View>
          </View>
          <View className="flex-row justify-between w-full gap-4">
            <View className="basis-[50%] shrink-0 flex-row gap-2 items-end">
              <Text
                className="text-2xl"
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{flexShrink: 1}}
              >
                {formatMoney(amountUsed, currency?.currency)}
              </Text>
              <Text className="text-muted-foreground">{t('spent')}</Text>
            </View>
            <View className="flex-1 flex-row shrink-0 gap-2 items-end justify-end">
              <Text
                className={cn(
                  'text-2xl',
                  amountLimit < amountUsed && 'text-amount-negative/90',
                  amountLimit > amountUsed && 'text-amount-positive'
                )}
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{flexShrink: 1}}
              >
                {amountLimit > amountUsed
                  ? formatMoney(amountLimit - amountUsed, currency?.currency)
                  : formatMoney(amountUsed - amountLimit, currency?.currency)}
              </Text>
              {amountLimit > amountUsed ? (
                <Text className="text-muted-foreground">{t('remaining')}</Text>
              ) : (
                <Text className="text-muted-foreground">{t('over')}</Text>
              )}
            </View>
          </View>
        </View>
        {amountUsed > budget.amountLimit && (
          <View className="gap-3 px-4">
            <View className="flex-row items-center gap-3 p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <IconExclamationCircle className="h-7 w-7 text-foreground" />
              <Text>{t('budgetLimit')}</Text>
            </View>
          </View>
        )}
        <TransactionListGroup
          transactions={transactions}
          loading={isLoading}
          onBack={true}
          showEmptyState
        />
      </View>
    </ScreenContent>
  )
}

// PARTS

function getBudgetPeriodLabel(range: TimeRange, t: (key: string) => string) {
  const now = new Date()
  const from = new Date(range.from)

  const isSameMonth = from.getFullYear() === now.getFullYear() && from.getMonth() === now.getMonth()

  if (isSameMonth) {
    return `${daysUntilEndOfMonth()} ${t('daysLeft')}`
  } else if (from > now) {
    return t('budgetNotStarted')
  } else {
    return t('budgetPeriodEnded')
  }
}

// TYPES

type TimeRange = {
  from: TDateISO
  to: TDateISO
}
