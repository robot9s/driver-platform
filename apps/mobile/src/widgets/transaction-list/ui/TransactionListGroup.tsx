import {LegendList} from '@legendapp/list'
import {IconLocationSearch} from '@tabler/icons-react-native'
import {useMemo, useState} from 'react'
import {View} from 'react-native'
import Animated, {FadeIn, FadeOutUp} from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useAccountsObserved} from '@entities/account'
import {useCategoriesObserved} from '@entities/category'
import {useCurrenciesObserved} from '@entities/currency'
import type {Transaction} from '@entities/transaction'
import {TransactionTypeConst, TransactionCard} from '@entities/transaction'
import {useTranslation} from '@shared/i18n'
import {getDatesDiffInDays} from '@shared/lib/dates'
import {useRelativeTimeFormatter, useDateFormatter, useMoneyFormatter} from '@shared/lib/format'
import {Text} from '@shared/ui/text'
import {groupTransactionsByDate} from '../lib/groupToFlatList'
import {ListSkeleton} from './ListSkeleton'
import type {ReactElement} from 'react'

export const TransactionListGroup = ({
  transactions,
  loading,
  endReached,
  loadMore,
  showEmptyState = false,
  ListHeaderComponent,
  onBack,
}: TransactionListGroupProps) => {
  const {t} = useTranslation('TransactionListGroup')
  const {bottom} = useSafeAreaInsets()
  const [height, setHeight] = useState(0)

  const {categories: expenseCategories} = useCategoriesObserved('expense')
  const {categories: incomeCategories} = useCategoriesObserved('income')
  const accounts = useAccountsObserved()
  const currencies = useCurrenciesObserved()

  const formatRelativeTime = useRelativeTimeFormatter()
  const formatDate = useDateFormatter()
  const formatMoney = useMoneyFormatter()
  const formatLocalDate = (localDate: string) => {
    const daysDifference = getDatesDiffInDays(Date.now(), localDate)
    const shouldUseRelative = Math.abs(daysDifference) <= 1
    return shouldUseRelative
      ? formatRelativeTime(localDate)
      : formatDate(localDate, {skipTime: true})
  }

  const transactionsByDate = useMemo(() => groupTransactionsByDate(transactions), [transactions])

  return (
    <LegendList
      maintainVisibleContentPosition
      className="flex-1"
      contentContainerStyle={{paddingBottom: bottom + 120, flexGrow: 1}}
      onEndReachedThreshold={0.6}
      onEndReached={() => {
        if (!endReached && !loading) {
          loadMore?.()
        }
      }}
      data={transactionsByDate}
      keyExtractor={(item) => ('date' in item ? item.date : item.id)}
      renderItem={({item: transaction}) => {
        if ('date' in transaction) {
          const account = accounts.find((account) => account.id === transaction.accountId)
          const currency = currencies.find((currency) => account?.currencyId === currency.id)
          return (
            <View className="flex-row justify-between border-border border-b-[0.5px] mx-4 py-2 pt-4 align-center">
              <Text className="text-foreground/70 capitalize">
                {formatLocalDate(transaction.date)}
              </Text>
              <Text className="text-foreground/50">
                {formatMoney(transaction.total, currency?.currency)}
              </Text>
            </View>
          )
        } else {
          const account = accounts.find((account) => account.id === transaction.accountId)
          const currency = currencies.find((currency) => account?.currencyId === currency.id)

          const isExpense = transaction.type === TransactionTypeConst.expense
          const categories = isExpense ? expenseCategories : incomeCategories
          const category =
            categories.find((category) => category.id === transaction.categoryId) ?? undefined

          return (
            <Animated.View entering={FadeIn.duration(300)} exiting={FadeOutUp}>
              <TransactionCard
                id={transaction.id}
                transaction={{
                  formattedAmount: formatMoney(transaction.amount, currency?.currency),
                  createdAt: transaction.createdAt,
                  datetime: transaction.datetime,
                  type: transaction.type,
                  description: transaction?.description,
                }}
                category={{
                  name: !category?.id ? 'Uncategorized' : category.title,
                  id: transaction.categoryId,
                  icon: category?.icon ?? 'IconBox',
                  color: category?.color ?? 'slate',
                }}
                onBack={onBack}
              />
            </Animated.View>
          )
        }
      }}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={loading ? <ListSkeleton /> : null}
      onLayout={(e) => {
        const {height} = e.nativeEvent.layout
        setHeight(height)
      }}
      ListEmptyComponent={
        showEmptyState && !loading ? (
          <View className="justify-center items-center h-full" style={{height: height - 100}}>
            <IconLocationSearch className="size-16 text-muted-foreground" />
            <Text className="mt-6 text-center text-muted-foreground">{t('notFound.title')}</Text>
            <Text className="text-center text-muted-foreground">{t('notFound.body')}</Text>
          </View>
        ) : null
      }
    />
  )
}

// TYPES

interface TransactionListGroupProps {
  transactions: Transaction[]
  loading: boolean
  endReached?: boolean
  loadMore?: () => void
  showEmptyState?: boolean
  ListHeaderComponent?: ReactElement
  onBack?: boolean
}
