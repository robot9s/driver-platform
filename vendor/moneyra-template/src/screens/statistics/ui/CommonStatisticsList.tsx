import {ScrollView, View, Text} from 'react-native'
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated'
import {AnimatedNumber} from '@widgets/animated-number'
import {useCategoriesStatistics} from '@features/statistics'
import {useAccountsObserved} from '@entities/account'
import {useCurrenciesObserved} from '@entities/currency'
import {useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {useStatisticsFiltersStore} from '../model/store'

const CommonStatisticsList = () => {
  const {t} = useTranslation('StatisticsScreen')

  const filters = useStatisticsFiltersStore((state) => state.filters)
  const {fromDateTimeRange, toDateTimeRange, accountId, type} = filters

  const accounts = useAccountsObserved()
  const currencies = useCurrenciesObserved()

  const selectedAccountId = accountId ?? accounts[0]?.id
  const account = accounts.find((account) => account.id === selectedAccountId)
  const currency = currencies.find((currency) => currency.id === account?.currencyId)

  const statistics = useCategoriesStatistics({
    fromDateTimeRange,
    toDateTimeRange,
    accountId: selectedAccountId,
  })

  const {income, expense} = statistics ?? {}
  const transactionCount = type === 'expense' ? expense.transactionCount : income.transactionCount
  const categoryAmounts = expense.categories?.map((c) => c.amount) ?? []
  const maxAmount = categoryAmounts.length > 0 ? Math.max(...categoryAmounts) : 0

  const incomeTotal = income.totalAmount
  const expenseTotal = expense.totalAmount

  let savedPercent = 0
  if (incomeTotal > 0) {
    savedPercent = ((incomeTotal - expenseTotal) / incomeTotal) * 100
  } else if (expenseTotal > 0) {
    savedPercent = -100
  } else {
    savedPercent = 0
  }

  return (
    <ScrollView
      contentContainerClassName="gap-4 mt-4 px-4 pb-[120px]"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl text-foreground font-semiBold">{t('summary')}</Text>
      <View className="flex gap-3 pb-16">
        <Animated.View
          className="flex-row items-center justify-between bg-secondary p-4 rounded-xl"
          entering={FadeInDown.delay(1 * 50)}
          exiting={FadeOutDown}
        >
          <View className="flex-1 gap-1">
            <Text className="text-2xl text-foreground font-semiBold">{t('incomeExpense')}</Text>
            <Text className="text-muted-foreground">{t('incomeExpenseDescription')}</Text>
          </View>
          <View className="w-[110px] shrink-0 items-end justify-center">
            <AnimatedNumber
              className={cn(
                'text-2xl font-semiBold text-primary text-right',
                savedPercent > 0 && 'text-green-400',
                savedPercent < 0 && 'text-red-400'
              )}
              value={savedPercent}
              fractionDigits={0}
              showSign
              showPercent
            />
          </View>
        </Animated.View>

        <Animated.View
          className="flex-row items-center justify-between bg-secondary p-4 rounded-xl"
          entering={FadeInDown.delay(2 * 50)}
          exiting={FadeOutDown}
        >
          <View className="flex-1 gap-1">
            <Text className="text-2xl text-foreground font-semiBold">{t('incomeMonth')}</Text>
            <Text className="text-muted-foreground">{t('incomeMonthDescription')}</Text>
          </View>
          <View className="w-[110px] shrink-0 items-end justify-center">
            <AnimatedNumber
              className={cn(
                'text-2xl font-semiBold text-foreground text-right',
                income.totalAmount > 0 && 'text-green-400'
              )}
              value={income.totalAmount}
              currency={currency?.currency}
              showSign
            />
          </View>
        </Animated.View>

        <Animated.View
          className="flex-row items-center justify-between bg-secondary p-4 rounded-xl"
          entering={FadeInDown.delay(3 * 50)}
          exiting={FadeOutDown}
        >
          <View className="flex-1 gap-1">
            <Text className="text-2xl text-foreground font-semiBold">{t('spendMonth')}</Text>
            <Text className="text-muted-foreground">{t('spendMonthDescription')}</Text>
          </View>
          <View className="w-[110px] shrink-0 items-end justify-center">
            <AnimatedNumber
              className="text-2xl font-semiBold text-foreground"
              value={expenseTotal}
              currency={currency?.currency}
            />
          </View>
        </Animated.View>

        <Animated.View
          className="flex-row gap-2 items-center justify-between bg-secondary p-4 rounded-xl"
          entering={FadeInDown.delay(4 * 50)}
          exiting={FadeOutDown}
        >
          <View className="flex-1 gap-1">
            <Text className="text-2xl text-foreground font-semiBold">{t('totalTransactions')}</Text>
            <Text className="text-muted-foreground">{t('totalTransactionsDescription')}</Text>
          </View>
          <View className="w-[80px] shrink-0 items-end justify-center">
            <AnimatedNumber
              className="text-2xl font-semiBold text-foreground"
              value={transactionCount}
              fractionDigits={0}
            />
          </View>
        </Animated.View>

        <Animated.View
          className="flex-row gap-2 items-center justify-between bg-secondary p-4 rounded-xl"
          entering={FadeInDown.delay(5 * 50)}
          exiting={FadeOutDown}
        >
          <View className="flex-1 gap-1">
            <Text className="text-2xl text-foreground font-semiBold">{t('maxExpense')}</Text>
            <Text className="text-muted-foreground">{t('maxExpenseDescription')}</Text>
          </View>
          <View className="w-[110px] shrink-0 items-end justify-center">
            <AnimatedNumber
              className="text-2xl font-semiBold text-foreground"
              value={maxAmount}
              currency={currency?.currency}
            />
          </View>
        </Animated.View>

        <Animated.View
          className="flex-row gap-2 items-center justify-between bg-secondary p-4 rounded-xl"
          entering={FadeInDown.delay(6 * 50)}
          exiting={FadeOutDown}
        >
          <View className="flex-1 gap-1">
            <Text className="text-2xl text-foreground font-semiBold">{t('topCategory')}</Text>
            <Text className="text-muted-foreground">{t('topCategoryDescription')}</Text>
          </View>
          <View className="w-[160px] shrink-0 items-end justify-center">
            <Text
              className="text-2xl font-semiBold text-foreground"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {expense.categories[0]?.category.title ?? '-'}
            </Text>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  )
}

export default CommonStatisticsList
