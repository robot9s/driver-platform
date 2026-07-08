import {View} from 'react-native'
import colors from 'tailwindcss/colors'
import {colorsPrimary} from '@shared/config/colors'
import {useMoneyFormatter} from '@shared/lib/format'
import {percentageOf} from '@shared/lib/number'
import {useColorPalette} from '@shared/lib/palette'
import {useColorScheme} from '@shared/lib/theme'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'
import {CircularProgressBar} from '@shared/ui-primitives/CircularProgressBar'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import type {BudgetRecord} from '../model/models'

export const BudgetRecordCard = ({
  budget,
  amountUsed = 0,
  currency,
  className,
}: BudgetRecordCardProps) => {
  const {name, amountLimit} = budget
  const formatMoney = useMoneyFormatter()
  const {colorScheme} = useColorScheme()
  const {getColor} = useColorPalette()

  return (
    <View className={cn('flex-row w-full gap-x-3 px-4 py-3 gap-3 h-[70px]', className)}>
      <View className="flex-row items-center gap-2 w-[48px]">
        <CircularProgressBar
          trackColor={getColor('--border')}
          progressColor={cn(
            percentageOf(amountLimit, amountUsed) > 80
              ? colors.rose[700]
              : colorsPrimary[budget.color][colorScheme]
          )}
          percentageValue={amountLimit < amountUsed ? 100 : percentageOf(amountLimit, amountUsed)}
          radius={24}
          strokeWidth={3}
          hideCenterText
        />
        <GenericIcon
          name={budget.icon}
          className="-ml-[44px] h-7 w-7 text-foreground"
          color={colorsPrimary[budget.color][colorScheme]}
        />
      </View>
      <View className="flex flex-1 content-center justify-center">
        <Text
          className="font-semibold text-lg leading-5 mb-1"
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {name}
        </Text>
        <Text
          className={cn(
            amountLimit - amountUsed > 0 && 'text-green-600',
            amountLimit - amountUsed < 0 && 'text-red-400'
          )}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatMoney(amountLimit - amountUsed, currency)}{' '}
          <Text className="text-muted-foreground" numberOfLines={1} adjustsFontSizeToFit>
            left to spend
          </Text>
        </Text>
      </View>
      <View className="basis-[25%] shrink-0 items-end justify-center ">
        <Text className="text-xl font-semibold text-right" numberOfLines={1} adjustsFontSizeToFit>
          {formatMoney(amountLimit, currency, {
            notation: amountLimit.toString().length > 7 ? 'compact' : 'standard',
            minimumFractionDigits: amountLimit.toString().length > 7 ? 2 : 0,
            maximumFractionDigits: amountLimit.toString().length > 7 ? 2 : 0,
          })}
        </Text>
      </View>
    </View>
  )
}

// TYPES

interface BudgetRecordCardProps {
  budget: BudgetRecord
  amountUsed: number
  currency?: string
  className?: string
}
