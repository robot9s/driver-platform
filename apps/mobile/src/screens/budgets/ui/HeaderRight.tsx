import {IconPlus} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {View} from 'react-native'
import {useBudgetsObserved} from '@entities/budget'
import {useUserEntitlements} from '@entities/subscription'
import {ENTITLEMENT_LIMIT} from '@shared/config/appLimits'
import {Button} from '@shared/ui/button'
import {BudgetOptionsDropdown} from './BudgetOptionsDropdown'

export const HeaderRight = () => {
  const router = useRouter()
  const budgetRecords = useBudgetsObserved()
  const {entitlement} = useUserEntitlements()

  const isExceeded = ENTITLEMENT_LIMIT[entitlement]?.maxBudgets <= Object.keys(budgetRecords).length

  const onPressCreate = () => {
    router.push(!isExceeded ? '/budget/create' : '/paywall?highlight=budgets')
  }

  return (
    <View className="!h-12 flex-row gap-2 items-center rounded-full border-[1px] border-border">
      <Button
        variant="ghost"
        onPress={onPressCreate}
        className="!h-12 w-12 !px-2.5 items-center rounded-full"
      >
        <IconPlus className="size-7 text-foreground" />
      </Button>
      <BudgetOptionsDropdown />
    </View>
  )
}
