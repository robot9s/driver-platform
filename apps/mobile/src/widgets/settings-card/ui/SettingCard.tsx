import {Pressable, View} from 'react-native'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'
import type {Icon} from '@tabler/icons-react-native'
import type {ReactNode} from 'react'

export const SettingCard = ({
  title,
  description,
  icon: Icon,
  rightSection,
  onPress,
  disabled = false,
  className,
  iconClassName,
  titleClassName,
  descClassName,
}: SettingCardProps) => {
  return (
    <Pressable
      className={cn(
        'flex flex-row items-center justify-between h-[52px] gap-1 px-3 py-2 active:bg-muted-foreground/10',
        disabled && 'opacity-50',
        className
      )}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="flex flex-row gap-3 items-center">
        {Icon && (
          <View
            className={cn(
              'flex items-center justify-center rounded-lg h-9 w-9 border dark:border-none border-primary/20',
              iconClassName
            )}
          >
            <Icon className="h-7 w-7 text-foreground" />
          </View>
        )}
        <View className="flex justify-center">
          <Text className={cn('text-lg font-medium -mt-1', titleClassName)}>{title}</Text>
          {description && (
            <Text className={cn('text-muted-foreground text-xs -mt-0.5', descClassName)}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {rightSection}
    </Pressable>
  )
}

// TYPES

interface SettingCardProps {
  title: string
  icon?: Icon
  rightSection?: ReactNode
  description?: string
  onPress?(): void
  disabled?: boolean
  className?: string
  iconClassName?: string
  titleClassName?: string
  descClassName?: string
}
