import {IconInfoCircle} from '@tabler/icons-react-native'
import {TouchableOpacity, View} from 'react-native'
import {useAmountByMonth} from '@features/statistics'
import {useAccountsObserved} from '@entities/account'
import {useBudgetsObserved} from '@entities/budget'
import {useCurrenciesObserved} from '@entities/currency'
import {useTranslation} from '@shared/i18n'
import type {TDateISO} from '@shared/lib/dates'
import {useMoneyFormatter} from '@shared/lib/format'
import {AppSheet, useSheet} from '@shared/sheet-provider'
import {globalStorage, STORAGE_CONSTANT_LAST_ACCOUNT_ID} from '@shared/storage/global-storage'
import {useUserSettingsStore} from '@shared/stores/user-settings'
import {Text} from '@shared/ui/text'
import LoadingTypography from '@shared/ui-primitives/LoadingTypography'

export default function LeftToBudget({accountId, from}: TProps) {
  const {t} = useTranslation('BudgetsScreen')
  const formatMoney = useMoneyFormatter()
  const type = 'income'
  const {[AppSheet.BUDGET_LEFT_INFO]: budgetInfoRef} = useSheet()

  const budgetRecords = useBudgetsObserved()
  const accounts = useAccountsObserved()
  const currencies = useCurrenciesObserved()
  const showBudgetLeft = useUserSettingsStore((state) => state.showBudgetLeft)

  const summaryAmountBudget = Object.values(budgetRecords).reduce(
    (sum, record) => sum + Number(record.amountLimit),
    0
  )

  const selectedAccountId =
    accountId ?? globalStorage.getItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID) ?? accounts[0]?.id
  const account = accounts.find((account) => account.id === selectedAccountId)
  const currency = currencies.find((currency) => currency.id === account?.currencyId)

  const selectedMonth = from ?? new Date().toISOString()
  const monthIndex = new Date(selectedMonth).getMonth()

  const {amount: amountIncome, loading} = useAmountByMonth({
    fromDateTimeRange: new Date(Date.UTC(new Date().getFullYear(), monthIndex, 1)).toISOString(),
    toDateTimeRange: new Date(Date.UTC(new Date().getFullYear(), monthIndex + 1, 1)).toISOString(),
    type,
    accountId,
  })

  const amountLeft = (amountIncome ?? 0) - summaryAmountBudget

  return (
    showBudgetLeft &&
    amountLeft > 0 && (
      <TouchableOpacity activeOpacity={0.8} onPress={() => budgetInfoRef?.current?.present()}>
        <View className="flex-row justify-between items-center bg-green-400 dark:bg-green-950 px-4 py-4 rounded-lg">
          <View className="flex-row items-center gap-1">
            <Text className="text-lg">{t('left')}</Text>
            <IconInfoCircle className="h-6 w-6 text-foreground" />
          </View>
          <LoadingTypography
            loading={loading}
            className="text-xl font-semibold"
            classes={{skeleton: 'w-[60px]'}}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatMoney(amountLeft, currency?.currency, {
              notation: amountLeft?.toString().length > 8 ? 'compact' : 'standard',
              minimumFractionDigits: amountLeft?.toString().length > 9 ? 2 : 0,
              maximumFractionDigits: amountLeft?.toString().length > 9 ? 2 : 0,
            })}
          </LoadingTypography>
        </View>
      </TouchableOpacity>
    )
  )
}

// PARTS

type TProps = {
  accountId: string
  from?: TDateISO
}
