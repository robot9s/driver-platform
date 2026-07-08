import {View} from 'react-native'
import TextTicker from 'react-native-text-ticker'
import type {TColor} from '@shared/config/colors'
import {colorsPrimary} from '@shared/config/colors'
import type {TCategoryIcon} from '@shared/config/icons'
import {cn, useColorScheme} from '@shared/lib/theme'
import {Button} from '@shared/ui/button'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import type {ExpenseCategoryID} from '../model/models'
import type {StyleProp, ViewStyle} from 'react-native'

export const CategoryCheckboxCard = ({category, onClick, checked}: CategoryCheckboxCardProps) => {
  const {title, icon, color} = category
  const {colorScheme} = useColorScheme()

  return (
    <View className="w-[33%] items-center justify-center p-2">
      <Button
        size="icon"
        className={cn(
          'flex h-20 w-full flex-1 flex-grow flex-col px-2 pt-1.5',
          checked && 'border border-primary'
        )}
        variant={checked ? 'secondary' : 'outline'}
        onPress={async () => {
          onClick()
        }}
      >
        <GenericIcon
          name={icon}
          className="size-8 text-foreground"
          color={colorsPrimary[color][colorScheme]}
        />
        <TextTicker
          marqueeDelay={500}
          duration={200 * title.length}
          bouncePadding={{left: 5, right: 5}}
          bounce
          loop
          animationType="bounce"
          className="line-clamp-1 text-center font-regular text-muted-foreground text-sm"
        >
          {title}
        </TextTicker>
      </Button>
    </View>
  )
}

// TYPES

export interface CategoryCardAccount {
  id: ExpenseCategoryID
  title: string
  icon: TCategoryIcon
  color: TColor
}

interface CategoryCheckboxCardProps {
  category: CategoryCardAccount
  onClick(): void
  checked: boolean
  styleRoot?: StyleProp<ViewStyle>
}
