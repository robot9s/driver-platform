import {useState} from 'react'
import {View} from 'react-native'
import {AccountPickerSelect} from '@widgets/account-picker'
import {MonthsSelector} from '@widgets/month-selector'
import {TimeRangeControl} from '@widgets/time-range-control'
import {TransactionListGroup} from '@widgets/transaction-list'
import {useAccountsObserved} from '@entities/account'
import type {TransactionType} from '@entities/transaction'
import {useTransactionsInfinite} from '@entities/transaction'
import {endOfMonth, startOfMonth} from '@shared/lib/dates'
import {globalStorage, STORAGE_CONSTANT_LAST_ACCOUNT_ID} from '@shared/storage/global-storage'
import {Separator} from '@shared/ui/separator'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {TransactionsView} from '../model/types'
import {MonthlyAccountBalance} from './MonthlyAccountBalance'
import {SelectView} from './SelectView'
import type {TimeRange} from '../model/types'

const TransactionsScreen = () => {
  const accounts = useAccountsObserved()

  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: startOfMonth.toISOString(),
    to: endOfMonth.toISOString(),
  })
  const {from, to} = timeRange
  const [type, setType] = useState<TransactionType | undefined>()
  const [view, setView] = useState<TransactionsView>(TransactionsView.Default)
  const [walletAccountId, setWalletAccountId] = useState<string>(
    globalStorage.getItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID) ?? accounts[0]?.id
  )

  const handleSetTimeRange = (timeRange: TimeRange) => {
    setTimeRange({
      from: timeRange.from,
      to: timeRange.to,
    })
  }

  const {transactions, loading, endReached, loadMore} = useTransactionsInfinite(
    {fromDateTimeRange: from, toDateTimeRange: to, type, accountId: walletAccountId},
    30
  )

  return (
    <ScreenContent excludeEdges={['bottom']}>
      <View className="flex flex-row items-center justify-between gap-4 bg-background px-4 pb-2">
        <AccountPickerSelect accountId={walletAccountId} selectAccount={setWalletAccountId} />
        <View className="flex-row items-center gap-2">
          {view === TransactionsView.Default && (
            <MonthsSelector from={from!} onChange={handleSetTimeRange} />
          )}
          <SelectView value={view} onSelect={setView} onTimeRangeChange={handleSetTimeRange} />
        </View>
      </View>
      <View className="flex-1">
        {view !== TransactionsView.Default && view !== TransactionsView.All && (
          <TimeRangeControl
            filter={view}
            timeRange={{
              from: from!,
              to: to!,
            }}
            onTimeRangeChange={handleSetTimeRange}
          />
        )}
        {view === TransactionsView.Default ? (
          <View className="flex-row gap-5 m-4 px-4 py-3 bg-muted/40 rounded-3xl">
            <MonthlyAccountBalance
              from={from!}
              type="expense"
              accountId={walletAccountId}
              onSelect={setType}
              selectedType={type}
            />
            <Separator className="mx-auto w-[1px]" orientation="vertical" />
            <MonthlyAccountBalance
              from={from!}
              type="income"
              accountId={walletAccountId}
              onSelect={setType}
              selectedType={type}
            />
          </View>
        ) : null}
        <TransactionListGroup
          transactions={transactions}
          loading={loading}
          endReached={endReached}
          loadMore={loadMore}
          showEmptyState
        />
      </View>
    </ScreenContent>
  )
}

export default TransactionsScreen
