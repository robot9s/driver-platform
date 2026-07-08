import {useRef} from 'react'
import {useFormContext, useWatch} from 'react-hook-form'
import {useAccountsObserved} from '@entities/account'
import {useCurrenciesObserved} from '@entities/currency'
import {TextTicker} from '@shared/ui-primitives/TextTicker'
import type {CreateTransactionFormData} from './CreateTransactionForm.schema'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'

export function TransactionAmount() {
  const {watch} = useFormContext<CreateTransactionFormData>()
  const [accountId] = watch(['accountId'])
  const amount = useWatch({name: 'amount', defaultValue: 0})
  const sheetRef = useRef<BottomSheetModal>(null) // FIXME: sheetRef should be removed from here

  const accounts = useAccountsObserved()
  const currencies = useCurrenciesObserved()
  const account = accounts.find((account) => account.id === accountId)
  const currency = currencies.find((currency) => currency.id === account?.currencyId)

  return (
    <TextTicker
      value={String(amount)}
      className="text-center text-6xl text-foreground leading-tight"
      suffix={currency?.symbol}
      suffixClassName="ml-2 top-1 text-muted-foreground overflow-visible"
      onPressSuffix={() => {
        sheetRef.current?.present()
      }}
    />
  )
}
