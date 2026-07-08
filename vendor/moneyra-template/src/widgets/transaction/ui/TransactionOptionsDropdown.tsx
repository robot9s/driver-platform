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

export function TransactionOptionsDropdown() {
  const {t} = useTranslation('TransactionOptionsDropdown')

  const showAccountSelect = useUserSettingsStore((state) => state.showAccountSelect)
  const setShowAccountSelect = useUserSettingsStore((state) => state.setShowAccountSelect)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('!h-11 w-11 !px-2.5 !py-0 flex-row items-center gap-2')}
        >
          <IconDots className={cn('size-6 text-foreground')} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-62"
        insets={{top: 10, bottom: 10, left: 10, right: 10}}
        portalHost="transaction-form"
      >
        <DropdownMenuItem onPress={() => setShowAccountSelect(!showAccountSelect)}>
          <View className="flex flex-row items-center justify-center gap-2">
            <IconCheck
              className={cn(
                'size-6 text-popover-foreground invisible',
                !showAccountSelect && 'visible'
              )}
            />
            <Text>{t('hideAccountSelect')}</Text>
          </View>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={() => setShowAccountSelect(!showAccountSelect)}>
          <View className="flex flex-row items-center justify-center gap-2">
            <IconCheck
              className={cn(
                'size-6 text-popover-foreground invisible',
                showAccountSelect && 'visible'
              )}
            />
            <Text>{t('showAccountSelect')}</Text>
          </View>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
