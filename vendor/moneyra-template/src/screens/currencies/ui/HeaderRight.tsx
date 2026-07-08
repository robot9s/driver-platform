import {IconPlus} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {useCurrenciesObserved} from '@entities/currency'
import {useUserEntitlements} from '@entities/subscription'
import {ENTITLEMENT_LIMIT} from '@shared/config/appLimits'
import {Button} from '@shared/ui/button'

export const HeaderRight = () => {
  const router = useRouter()
  const currencies = useCurrenciesObserved()
  const {entitlement} = useUserEntitlements()

  const isExceeded = ENTITLEMENT_LIMIT[entitlement]?.maxCurrencies <= (currencies?.length ?? 0)

  const onPressHelpFeed = () => {
    router.push(!isExceeded ? '/currencies/add' : '/paywall?highlight=currencies')
  }

  return (
    <Button className="rounded-full" size="icon" variant="ghost" onPress={onPressHelpFeed}>
      <IconPlus className="size-7 text-foreground" />
    </Button>
  )
}
