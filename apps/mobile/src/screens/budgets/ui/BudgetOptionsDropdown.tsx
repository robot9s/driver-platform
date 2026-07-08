import {IconCheck, IconDots} from '@tabler/icons-react-native'
import {View} from 'react-native'
import {useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {useUserSettingsStore} from '@shared/stores/user-settings'
import {Button} from '@shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'
import {Text} from '@shared/ui/text'

export function BudgetOptionsDropdown() {
  const {t} = useTranslation('BudgetOptionsDropdown')

  const showBudgetLeft = useUserSettingsStore((state) => state.showBudgetLeft)
  const setShowBudgetLeft = useUserSettingsStore((state) => state.setShowBudgetLeft)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('!h-11 w-11 !px-2.5 !py-0 items-center rounded-full')}
        >
          <IconDots className={cn('size-6 text-foreground')} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-62" insets={{top: 10, bottom: 10, left: 10, right: 10}}>
        <DropdownMenuItem onPress={() => setShowBudgetLeft(!showBudgetLeft)}>
          <View className="flex flex-row items-center justify-center gap-2">
            <IconCheck
              className={cn(
                'size-6 text-popover-foreground invisible',
                !showBudgetLeft && 'visible'
              )}
            />
            <Text>{t('hideLeftBudget')}</Text>
          </View>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
