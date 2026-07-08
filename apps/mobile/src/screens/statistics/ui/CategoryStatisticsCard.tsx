import {IconCategory} from '@tabler/icons-react-native'
import {useEffect} from 'react'
import {View} from 'react-native'
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import type {ExpenseCategory, IncomeCategory} from '@entities/category'
import type {Currency} from '@entities/currency'
import type {TransactionType} from '@entities/transaction'
import {colorsSecondary} from '@shared/config/colors'
import {useMoneyFormatter} from '@shared/lib/format'
import {useColorPalette} from '@shared/lib/palette'
import {cn, useColorScheme} from '@shared/lib/theme'
import {Text} from '@shared/ui/text'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import {formatPercentage} from '../libs/formatPercentage'

const MAX_BAR_WIDTH = 98

export function CategoryStatisticsCard({
  statistics,
  currency,
  index,
  type,
  maxPercentage,
  isSingleCategory,
}: CategoryStatisticsLineProps) {
  const {category, percentage, amount} = statistics
  const formatMoney = useMoneyFormatter()
  const {colorScheme} = useColorScheme()
  const {getColor} = useColorPalette()

  const width = useSharedValue(0)
  const computedWidth = isSingleCategory ? 100 : (percentage / maxPercentage) * MAX_BAR_WIDTH

  useEffect(() => {
    width.value = withTiming(computedWidth, {duration: 500}) // 500ms анимация
  }, [computedWidth])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    }
  })

  return (
    <Animated.View
      className="relative"
      entering={FadeInDown.delay(index * 100)}
      exiting={FadeOutDown}
    >
      <Animated.View
        className={cn(
          'absolute top-0 bottom-0 left-0',
          type === 'expense' && 'dark:bg-[#27150d] bg-[#ffe2d5]',
          type === 'income' && 'dark:bg-[#041d0f] bg-[#dcfce7]'
        )}
        style={animatedStyle}
      />
      <View className="flex-row items-center justify-between gap-6 px-4 py-1">
        <View className="flex-row items-center gap-3 w-[60%]">
          <View
            className="h-10 w-10 items-center justify-center rounded-lg border border-primary/20"
            style={{
              backgroundColor: category?.color
                ? colorsSecondary[category.color][colorScheme]
                : getColor('--accent'),
            }}
          >
            {category?.icon ? (
              <GenericIcon name={category.icon} className="size-7 text-secondary-foreground/80" />
            ) : (
              <IconCategory className="size-6 text-secondary-foreground/80" />
            )}
          </View>
          <Text
            className="font-medium flex-shrink leading-5"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {category?.title ?? 'Uncategorized'}
          </Text>
        </View>
        <View className="flex flex-row flex-1 justify-end gap-1">
          <Text className="font-semibold" numberOfLines={1} adjustsFontSizeToFit>
            {formatMoney(amount, currency?.currency)}
          </Text>
          <Text className="text-muted-foreground">({formatPercentage(percentage)}%)</Text>
        </View>
      </View>
    </Animated.View>
  )
}

// TYPES

interface CategoryStatisticsLineProps {
  statistics: {
    categoryId: string
    amount: number
    percentage: number
    category: ExpenseCategory | IncomeCategory
  }
  index: number
  maxPercentage: number
  isSingleCategory?: boolean
  type?: TransactionType | TransactionType[]
  currency?: Currency
}
