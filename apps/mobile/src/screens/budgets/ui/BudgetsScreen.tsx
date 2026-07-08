import {useRouter} from 'expo-router'
import {Pressable, View, FlatList} from 'react-native'
// eslint-disable-next-line no-restricted-imports
import {TPeriodFilter} from '@screens/statistics/model/types'
import {AccountPickerSelect} from '@widgets/account-picker'
import {TimeRangeControl} from '@widgets/time-range-control'
import {useCategoriesStatistics} from '@features/statistics'
import {useAccountsObserved} from '@entities/account'
import {BudgetRecordCard, useBudgetsObserved} from '@entities/budget'
import {useCurrenciesObserved} from '@entities/currency'
import {BudgetsEmptyIllustration} from '@shared/assets/illustrations'
import {useTranslation} from '@shared/i18n'
import type {TDateISO} from '@shared/lib/dates'
import {cn} from '@shared/lib/utils'
import {globalStorage, STORAGE_CONSTANT_LAST_ACCOUNT_ID} from '@shared/storage/global-storage'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {useBudgetsFiltersStore} from '../model/store'
import {HeaderRight} from './HeaderRight'
import LeftToBudget from './LeftToBudget'

export default function BudgetsScreen() {
  const {t} = useTranslation('BudgetsScreen')
  const router = useRouter()

  const filters = useBudgetsFiltersStore((state) => state.filters)
  const setBudgetsFilters = useBudgetsFiltersStore((state) => state.setBudgetsFilters)
  const {fromDateTimeRange, toDateTimeRange, type, accountId} = filters

  const accounts = useAccountsObserved()
  const currencies = useCurrenciesObserved()
  const budgetRecords = useBudgetsObserved()

  const selectedAccountId =
    accountId ?? globalStorage.getItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID) ?? accounts[0]?.id
  const account = accounts.find((account) => account.id === selectedAccountId)
  const currency = currencies.find((currency) => currency.id === account?.currencyId)

  const statistics = useCategoriesStatistics({
    type,
    accountId: selectedAccountId,
    fromDateTimeRange,
    toDateTimeRange,
  })
  const {income, expense} = statistics ?? {}
  const categories = type === 'expense' ? expense.categories : income.categories

  const handleSetTimeRange = (timeRange: TimeRange) => {
    setBudgetsFilters({
      ...filters,
      fromDateTimeRange: timeRange.from,
      toDateTimeRange: timeRange.to,
    })
  }

  return (
    <ScreenContent excludeEdges={['bottom']}>
      <View className="flex flex-row items-center justify-between gap-4 px-4 pb-3">
        <AccountPickerSelect
          accountId={selectedAccountId as string}
          selectAccount={(accountId) => {
            setBudgetsFilters({
              ...filters,
              accountId: accountId,
            })
          }}
        />
        <HeaderRight />
      </View>
      <TimeRangeControl
        className="mb-3"
        filter={TPeriodFilter.ByMonth}
        timeRange={{
          from: fromDateTimeRange!,
          to: toDateTimeRange!,
        }}
        onTimeRangeChange={handleSetTimeRange}
        showDaysUntilEndOfMonth
      />
      <View className="flex-1 gap-6 px-4">
        <LeftToBudget accountId={String(selectedAccountId)} from={fromDateTimeRange} />
        <FlatList
          className="flex-1"
          contentContainerClassName="gap-1 pb-[160px]"
          contentContainerStyle={budgetRecords.length <= 0 && {flex: 1}}
          data={budgetRecords}
          renderItem={({item: record, index}) => {
            const isFirst = index === 0
            const isLast = index === budgetRecords.length - 1
            let amountUsed = 0
            categories?.forEach((categorystatistics) => {
              if (record.categoryIds.includes(categorystatistics.categoryId)) {
                amountUsed = amountUsed + categorystatistics.amount
              }
            })

            return (
              <>
                <Pressable
                  key={record.id}
                  className={cn(
                    'bg-muted active:bg-muted-foreground/5 group-last:rounded-full',
                    isFirst && 'rounded-t-3xl',
                    isLast && 'rounded-b-3xl'
                  )}
                  onPress={() =>
                    router.push({
                      pathname: '/budget/[id]',
                      params: {id: record.id},
                    })
                  }
                >
                  <BudgetRecordCard
                    budget={record}
                    amountUsed={amountUsed ?? 0}
                    currency={currency?.currency ?? ''}
                  />
                </Pressable>
              </>
            )
          }}
          ListEmptyComponent={
            <View className="justify-center items-center flex-1" style={{marginBottom: 20}}>
              <BudgetsEmptyIllustration className="size-52 text-muted-foreground" />
              <Text className="mt-6 text-center text-muted-foreground">{t('notFound.title')}</Text>
              <Text className="text-center text-muted-foreground">{t('notFound.body')}</Text>
            </View>
          }
        />
      </View>
    </ScreenContent>
  )
}

type TimeRange = {
  from: TDateISO
  to: TDateISO
}
