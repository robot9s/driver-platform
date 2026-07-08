import {useEffect, useMemo} from 'react'
import {Pressable, View} from 'react-native'
import Animated, {useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'
import type {Currency} from '@entities/currency'
import {useTransactionsOnce} from '@entities/transaction'
import {useLocale} from '@shared/i18n'
import type {TDateISO} from '@shared/lib/dates'
import {useMoneyFormatter} from '@shared/lib/format'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'
import {getMonthlySums} from '../libs/getMonthlySums'

export default function ChartExpenseByMonths({
  categoryId,
  from,
  to,
  accountId,
  currency,
  onChange,
}: TProps) {
  const formatMoney = useMoneyFormatter()
  const {language} = useLocale()

  const {transactions} = useTransactionsOnce({
    expenseCategoryIds: [categoryId],
    accountId: accountId,
  })
  const monthlySums = useMemo(
    () => getMonthlySums({transactions, toDateISOString: to, locale: language}),
    [transactions]
  )

  const maxSum = monthlySums.reduce((max, item) => Math.max(max, item.sum), 0)
  const selectedMonth = new Date(from).toLocaleString(language, {month: 'short'})

  return (
    <View className="px-4 max-w-[600px] w-full mx-auto">
      <View className="flex-row">
        <View className="justify-between w-8">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            className="text-muted-foreground -mt-3 -ml-2"
          >
            {formatMoney(maxSum, currency?.currency, {
              notation: maxSum.toString().length > 5 ? 'compact' : 'standard',
              minimumFractionDigits: maxSum.toString().length > 5 ? 2 : 0,
              maximumFractionDigits: maxSum.toString().length > 5 ? 2 : 0,
            })}
          </Text>
          <Text className="text-muted-foreground -mb-2">$0</Text>
        </View>
        <View className="flex flex-row flex-1 gap-3 items-end border-b-2 border-b-gray-500 px-3 h-[100px]">
          {monthlySums.map(({year, month, monthIndex, sum}) => {
            return (
              <AnimatedBar
                key={month}
                year={year}
                month={month}
                monthIndex={monthIndex}
                sum={sum}
                maxSum={maxSum}
                selectedMonth={selectedMonth}
                onChange={onChange}
              />
            )
          })}
        </View>
      </View>
      <Text className="text-muted-foreground mt-8 mx-auto">Data for previous 6 months</Text>
    </View>
  )
}

// PARTS

export function AnimatedBar({
  year,
  month,
  monthIndex,
  sum,
  maxSum,
  selectedMonth,
  onChange,
}: AnimatedBarProps) {
  const maxHeight = 100
  const height = useSharedValue(0)
  const targetHeight = maxSum > 0 ? (sum / maxSum) * maxHeight : 0

  useEffect(() => {
    height.value = withTiming(targetHeight, {duration: 500})
  }, [targetHeight])

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }))

  const isSelected = month === selectedMonth

  return (
    <View className="flex-1 relative">
      <Pressable
        onPress={() => {
          const date = new Date(year, monthIndex + 1, 0)
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          endOfMonth.setHours(23, 59, 59, 999)

          onChange?.({
            from: startOfMonth.toISOString(),
            to: endOfMonth.toISOString(),
          })
        }}
      >
        <Animated.View
          style={animatedStyle}
          className={cn('rounded-t-[6px]', 'w-full', isSelected ? 'bg-primary' : 'bg-muted')}
        />
      </Pressable>
      <View className="absolute w-full -bottom-7">
        <Text className={cn('text-center', isSelected ? 'font-semibold' : 'text-muted-foreground')}>
          {month}
        </Text>
      </View>
    </View>
  )
}

// TYPES

type TProps = {
  categoryId: string
  from: TDateISO
  to: TDateISO
  onChange?: (date: TimeRange) => void
  accountId?: string | string[]
  currency?: Currency
}

type AnimatedBarProps = {
  month: string
  monthIndex: number
  year: number
  sum: number
  maxSum: number
  selectedMonth: string
  onChange?: (date: TimeRange) => void
}

type TimeRange = {
  from: TDateISO
  to: TDateISO
}
