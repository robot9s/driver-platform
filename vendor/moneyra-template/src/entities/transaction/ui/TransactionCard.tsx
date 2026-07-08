import {IconCategory} from '@tabler/icons-react-native'
import {Link} from 'expo-router'
import {memo} from 'react'
import {View, Pressable} from 'react-native'
import type {TColor} from '@shared/config/colors'
import {colorsSecondary} from '@shared/config/colors'
import type {TCategoryIcon} from '@shared/config/icons'
import {useTranslation} from '@shared/i18n'
import type {TDateISO} from '@shared/lib/dates'
import {useDateFormatter} from '@shared/lib/format'
import {useColorPalette} from '@shared/lib/palette'
import {useColorScheme} from '@shared/lib/theme'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import {TransactionTypeConst} from '../model/models'
import type {TransactionType} from '../model/models'

export const TransactionCard = memo(function TransactionCard(props: TransactionCardProps) {
  const {t} = useTranslation('TransactionCard')
  const {id, transaction, category, onBack} = props
  const {formattedAmount, createdAt, datetime, type, description} = transaction
  const isExpense = type === TransactionTypeConst.expense
  const formatDate = useDateFormatter()
  const {colorScheme} = useColorScheme()
  const {getColor} = useColorPalette()

  return (
    <Link
      asChild
      push
      href={{
        pathname: '/transaction/[id]',
        params: {id: id, back: String(onBack)},
      }}
    >
      <Pressable className="flex flex-row items-center justify-between gap-4 px-4 py-2.5 active:bg-secondary/60">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: category?.color
              ? colorsSecondary[category.color][colorScheme]
              : getColor('--input'),
          }}
        >
          {category?.icon ? (
            <GenericIcon className="size-8 text-secondary-foreground/80" name={category.icon} />
          ) : (
            <IconCategory className="size-8 text-secondary-foreground/80" />
          )}
        </View>
        <View className="flex flex-1 justify-center">
          <Text numberOfLines={1} className="flex-1 font-medium text-lg leading-2 -top-[1px]">
            {description ? description : category?.name}
          </Text>
          <View className={cn('flex flex-row gap-1 -top-[2px]', description && '-mt-[5px]')}>
            <Text className={cn('text-muted-foreground/60 text-sm', description && 'text-xs')}>
              {t('atDate', {date: formatDate(createdAt, {variant: 'variant2'})})}
            </Text>
            {createdAt.split('.')[0] !== datetime.split('.')[0] && (
              <Text
                className={cn('text-muted-foreground/60 text-sm italic', description && 'text-xs')}
              >
                ({t('updateAtDate', {date: formatDate(datetime, {variant: 'variant2'})})})
              </Text>
            )}
          </View>
        </View>
        <View className="justify-center">
          <Text className={cn('text-lg font-medium', !isExpense ? 'text-amount-positive' : '')}>
            {isExpense ? '' : '+'} {formattedAmount}
          </Text>
        </View>
      </Pressable>
    </Link>
  )
})

// TYPES

interface TransactionCardProps {
  id: string
  transaction: {
    formattedAmount: string
    createdAt: TDateISO
    datetime: TDateISO
    type: TransactionType
    description?: string
  }
  category: {
    id: string
    name: string
    icon: TCategoryIcon
    color: TColor
  }
  onBack?: boolean
}
