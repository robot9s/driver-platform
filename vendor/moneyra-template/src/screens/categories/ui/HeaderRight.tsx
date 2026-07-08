import {IconPlus} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {useCategoriesObserved} from '@entities/category'
import {useUserEntitlements} from '@entities/subscription'
import {ENTITLEMENT_LIMIT} from '@shared/config/appLimits'
import {Button} from '@shared/ui/button'

export const HeaderRight = () => {
  const router = useRouter()
  const {categories: expenseCategories} = useCategoriesObserved('expense')
  const {entitlement} = useUserEntitlements()

  const isExceeded =
    ENTITLEMENT_LIMIT[entitlement]?.maxExpenseCategories <=
    (Object.keys(expenseCategories).length ?? 0)

  const onPressHelpFeed = () => {
    router.push(!isExceeded ? '/categories/create' : '/paywall?highlight=categories')
  }

  return (
    <Button className="rounded-full" size="icon" variant="ghost" onPress={onPressHelpFeed}>
      <IconPlus className="size-7 text-foreground" />
    </Button>
  )
}
