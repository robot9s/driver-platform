import {View} from 'react-native'
import {cn} from '@shared/lib/utils'
import {Avatar, AvatarFallback, AvatarImage} from '@shared/ui/avatar'
import {Text} from '@shared/ui/text'
import type {Currency} from '../model/models'
import type {ReactNode} from 'react'

export const CurrencyCard = ({currency, actions, className}: CurrencyCardProps) => {
  return (
    <View
      className={cn('flex-row items-center gap-4 px-4 py-2 rounded-lg justify-between', className)}
    >
      <Avatar
        alt={`Avatar n°${currency.currency + 1}`}
        className={cn('h-12 w-12 border border-border bg-muted')}
      >
        <AvatarImage
          source={{
            uri: `https://flagcdn.com/w80/${currency.currency.substring(0, 2).toLowerCase()}.jpg`,
          }}
        />
        <AvatarFallback>
          <Text className={cn('font-semiBold uppercase leading-tight')}>
            {currency.currency.substring(0, 2)}
          </Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1">
        <Text className="font-medium">
          {currency.currency} {currency.currency !== currency.symbol && `(${currency.symbol})`}
        </Text>
        <Text className="text-muted-foreground">{currency.name}</Text>
      </View>
      <View>{actions}</View>
    </View>
  )
}

// TYPES

interface CurrencyCardProps {
  currency: Omit<Currency, 'id' | 'color' | 'createdAt' | 'symbolPosition'>
  actions: ReactNode
  className?: string
}
