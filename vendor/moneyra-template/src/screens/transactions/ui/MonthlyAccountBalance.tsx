import {Pressable, View} from 'react-native'
import {useAmountByMonth} from '@features/statistics'
import {useAccountsObserved} from '@entities/account'
import {useCurrenciesObserved} from '@entities/currency'
import type {TransactionType} from '@entities/transaction'
import {useTranslation} from '@shared/i18n'
import type {TDateISO} from '@shared/lib/dates'
import {useMoneyFormatter} from '@shared/lib/format'
import {cn} from '@shared/lib/utils'
import {Skeleton} from '@shared/ui/skeleton'
import {Text} from '@shared/ui/text'

export const MonthlyAccountBalance = ({
  from,
  type,
  selectedType,
  accountId,
  onSelect,
}: TMonthlyAccountBalanceProps) => {
  const {t} = useTranslation('MonthlyAccountBalance')
  const formatMoney = useMoneyFormatter()

  const accounts = useAccountsObserved()
  const currencies = useCurrenciesObserved()

  const selectedAccountId = (accountId && String(accountId)) ?? accounts[0]?.id
  const currencyId = accounts.find((account) => account.id === selectedAccountId)?.currencyId
  const currency = currencies.find((currency) => currency.id === currencyId)

  const selectedMonth = from ?? new Date().toISOString()
  const monthIndex = new Date(selectedMonth).getMonth()

  const selected = type === selectedType
  const isExpense = type === 'expense'

  const {amount, loading} = useAmountByMonth({
    fromDateTimeRange: new Date(Date.UTC(new Date().getFullYear(), monthIndex, 1)).toISOString(),
    toDateTimeRange: new Date(Date.UTC(new Date().getFullYear(), monthIndex + 1, 1)).toISOString(),
    type,
    accountId,
  })

  return (
    <Pressable
      onPress={() => onSelect(selected ? undefined : type)}
      className={cn(
        'flex flex-1 gap-1 active:bg-muted/30',
        selected && 'border-muted-foreground/70'
      )}
    >
      <Text
        className={cn(
          'font-semiBold text-muted-foreground/60 text-xs text-right uppercase',
          selected && 'text-primary'
        )}
      >
        {isExpense ? t('monthlyExpenses') : t('monthlyIncomes')} {selected && '•'}
      </Text>
      <View>
        {loading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            className={cn([
              'text-2xl font-semiBold text-right',
              isExpense ? 'text-amount-negative' : 'text-amount-positive',
            ])}
          >
            {isExpense ? '-' : '+'}
            {formatMoney(amount ?? 0, currency?.currency ?? '')}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

// TYPES

interface TMonthlyAccountBalanceProps {
  from: TDateISO
  type: TransactionType | undefined
  selectedType: TransactionType | undefined
  accountId: string
  onSelect: (type: TransactionType | undefined) => void
}
