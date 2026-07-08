import {memo, useEffect} from 'react'
import {View} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
// eslint-disable-next-line import/no-restricted-paths,no-restricted-imports
import {useBudgetsFiltersStore} from '@screens/budgets/model/store'
import {useAmountByMonth} from '@features/statistics'
import {useAccountsOnce} from '@entities/account'
import {useBudgetsOnce} from '@entities/budget'
import {useCurrenciesOnce} from '@entities/currency'
import {useTranslation} from '@shared/i18n'
import {useMoneyFormatter} from '@shared/lib/format'
import {useSheet, AppSheet} from '@shared/sheet-provider/context'
import {globalStorage, STORAGE_CONSTANT_LAST_ACCOUNT_ID} from '@shared/storage/global-storage'
import {Text} from '@shared/ui/text'
import {SheetModal} from '@shared/ui-primitives/Sheet'

export const SheetBudgetLeftInfo = memo(function SheetBudgetLeftInfo() {
  const {[AppSheet.BUDGET_LEFT_INFO]: budgetInfoRef} = useSheet()
  const {t} = useTranslation('SheetBudgetLeftInfo')
  const formatMoney = useMoneyFormatter()

  const progressOpacity = useSharedValue(0)
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }))

  const filters = useBudgetsFiltersStore((state) => state.filters)
  const {fromDateTimeRange, accountId} = filters
  const type = 'income'

  const {data: budgetRecords} = useBudgetsOnce()
  const {data: accounts} = useAccountsOnce()
  const {data: currencies} = useCurrenciesOnce()

  const summaryAmountBudget = Object.values(budgetRecords).reduce(
    (sum, record) => sum + Number(record.amountLimit),
    0
  )

  const selectedAccountId =
    accountId ?? globalStorage.getItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID) ?? accounts[0]?.id
  const account = accounts.find((account) => account.id === selectedAccountId)
  const currency = currencies.find((currency) => currency.id === account?.currencyId)

  const selectedMonth = fromDateTimeRange ?? new Date().toISOString()
  const monthIndex = new Date(selectedMonth).getMonth()

  const {amount: amountIncome} = useAmountByMonth({
    fromDateTimeRange: new Date(Date.UTC(new Date().getFullYear(), monthIndex, 1)).toISOString(),
    toDateTimeRange: new Date(Date.UTC(new Date().getFullYear(), monthIndex + 1, 1)).toISOString(),
    type,
    accountId,
  })

  useEffect(() => {
    progressOpacity.value = withTiming(1, {duration: 800})
  }, [])

  return (
    <SheetModal name={AppSheet.BUDGET_LEFT_INFO} snapPoints={[380]} ref={budgetInfoRef}>
      <View className="flex-1 px-4">
        <Animated.View className="gap-4" style={progressAnimatedStyle}>
          <Text className="text-2xl font-semibold text-center">{t('title')}</Text>
          <Text>{t('desc')}</Text>
          <View className="border-l-4 border-gray-400 bg-gray-600 p-3 rounded-md my-3">
            <Text className="italic text-primary">{t('descFormula')}</Text>
          </View>
          <View className="gap-1">
            <View className="flex-row gap-2 flex-wrap">
              <Text>1) {t('descIncome')} - </Text>
              <Text className="font-medium text-green-900 dark:text-green-400">
                {formatMoney(amountIncome, currency?.currency)}
              </Text>
            </View>
            <View className="flex-row gap-2 flex-wrap">
              <Text>2) {t('descBudget')} - </Text>
              <Text className="font-medium text-orange-900 dark:text-orange-400">
                {formatMoney(summaryAmountBudget, currency?.currency)}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2 flex-wrap">
            <Text>{t('descLeftBudget')}</Text>
            <Text className="text-green-900 dark:text-green-400">
              {formatMoney(amountIncome - summaryAmountBudget, currency?.currency)}
            </Text>
          </View>
        </Animated.View>
      </View>
    </SheetModal>
  )
})
