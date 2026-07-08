import {IconWallet} from '@tabler/icons-react-native'
import {Pressable, View} from 'react-native'
import type {TWalletIcon} from '@shared/config/icons'
import {cn} from '@shared/lib/utils'
import {Checkbox} from '@shared/ui/checkbox'
import {Text} from '@shared/ui/text'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import type {AccountID} from '../model/models'

export const AccountCard = ({
  account,
  formattedBalance,
  onPress,
  checked = false,
  withCheckbox,
}: AccountCardProps) => {
  const {icon, title} = account
  return (
    <Pressable
      className={cn(
        'flex-row items-center w-full p-3 rounded-lg bg-muted-foreground/10 active:bg-muted',
        checked && 'border border-primary/70'
      )}
      onPress={onPress}
    >
      <View className="flex-row flex-1 items-center gap-2">
        {icon ? (
          <GenericIcon name={icon} className="size-8 text-secondary-foreground" />
        ) : (
          <IconWallet className="size-8 text-foreground" />
        )}
        <Text>{title}</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <Text>{formattedBalance}</Text>
        {withCheckbox && <Checkbox checked={checked} onCheckedChange={onPress} />}
      </View>
    </Pressable>
  )
}

// TYPES

export interface AccountCardAccount {
  id: AccountID
  title: string
  icon: TWalletIcon
}

interface AccountCardProps {
  account: AccountCardAccount
  formattedBalance: string
  onPress(): void
  checked?: boolean
  withCheckbox?: boolean
}
