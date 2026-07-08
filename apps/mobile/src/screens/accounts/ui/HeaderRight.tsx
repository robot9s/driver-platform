import {IconPlus} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {useAccountsObserved} from '@entities/account'
import {useUserEntitlements} from '@entities/subscription'
import {ENTITLEMENT_LIMIT} from '@shared/config/appLimits'
import {Button} from '@shared/ui/button'

export const HeaderRight = () => {
  const router = useRouter()
  const accounts = useAccountsObserved()
  const {entitlement} = useUserEntitlements()

  const isExceeded = ENTITLEMENT_LIMIT[entitlement]?.maxWallets <= (accounts?.length ?? 0)

  const onPressHelpFeed = () => {
    router.push(!isExceeded ? '/accounts/create' : '/paywall?highlight=accounts')
  }

  return (
    <Button className="rounded-full" size="icon" variant="ghost" onPress={onPressHelpFeed}>
      <IconPlus className="size-7 text-foreground" />
    </Button>
  )
}
