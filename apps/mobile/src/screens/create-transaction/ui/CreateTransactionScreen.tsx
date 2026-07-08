import {toast} from '@backpackapp-io/react-native-toast'
import {PortalHost} from '@rn-primitives/portal'
import * as Haptics from 'expo-haptics'
import {useNavigation, useRouter} from 'expo-router'
import {Fragment, useEffect, useMemo, useState} from 'react'
import {Platform, View} from 'react-native'
import {FullWindowOverlay} from 'react-native-screens'
import type {CreateTransactionFormData} from '@widgets/transaction'
import {createTransactionFormSchema, TransactionForm} from '@widgets/transaction'
import {useAccountsOnce} from '@entities/account'
import {useUserEntitlements} from '@entities/subscription'
import type {TransactionType} from '@entities/transaction'
import {useCreateTransaction} from '@entities/transaction'
import {ENTITLEMENT_LIMIT} from '@shared/config/appLimits'
import {useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {
  globalStorage,
  STORAGE_EXPENSE_LAST_CATEGORY_ID,
  STORAGE_INCOME_LAST_CATEGORY_ID,
  STORAGE_CONSTANT_LAST_ACCOUNT_ID,
  STORAGE_CONSTANT_NUMBER_OF_TRANSACTIONS,
} from '@shared/storage/global-storage'
import {useUserSettingsStore} from '@shared/stores/user-settings'
import {ToastModal} from '@shared/toast/ToastModal'
import {Text} from '@shared/ui/text'
import {ToggleGroup, ToggleGroupItem} from '@shared/ui/toggle-group'
import {useFinalForm} from '@shared/ui-primitives/FinalFormKit'

export default function CreateTransactionScreen() {
  const {t} = useTranslation('CreateTransactionScreen')
  const router = useRouter()
  const navigation = useNavigation()
  const [type, setType] = useState<TransactionType>('expense')

  const createTransaction = useCreateTransaction()
  const {data: accounts} = useAccountsOnce()

  const showAccountSelect = useUserSettingsStore((state) => state.showAccountSelect)
  const {entitlement} = useUserEntitlements()
  const numberOfTransactions = Number(
    globalStorage.getItem(STORAGE_CONSTANT_NUMBER_OF_TRANSACTIONS)
  )
  const lastCategoryId =
    type === 'expense' ? STORAGE_EXPENSE_LAST_CATEGORY_ID : STORAGE_INCOME_LAST_CATEGORY_ID
  const isExceeded = ENTITLEMENT_LIMIT[entitlement]?.maxTransactionsByMonth <= numberOfTransactions
  const memoizedDate = useMemo(() => new Date().toISOString(), [])

  const form = useFinalForm({
    schema: createTransactionFormSchema,
    defaultValues: {
      type: 'expense',
      amount: 0,
      categoryId: globalStorage.getItem(lastCategoryId) ?? undefined,
      accountId: globalStorage.getItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID) ?? accounts[0]?.id,
      datetime: memoizedDate,
      description: '',
    },
  })

  const WindowOverlay = Platform.OS === 'ios' ? FullWindowOverlay : Fragment

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <ToggleGroup
          value={type}
          onValueChange={(value) => {
            if (value) {
              setType(value as TransactionType)
            }
          }}
          type="single"
          className="w-[260px] bg-secondary rounded-lg p-1.5 h-12"
        >
          <ToggleGroupItem
            value="expense"
            className={cn('flex-1 max-h-10', type === 'expense' && 'bg-background')}
          >
            <Text>{t('expense')}</Text>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="income"
            className={cn('flex-1 max-h-10', type === 'income' && 'bg-background')}
          >
            <Text>{t('income')}</Text>
          </ToggleGroupItem>
        </ToggleGroup>
      ),
    })
  }, [type])

  const handleCreateTransaction = async (transaction: CreateTransactionFormData) => {
    if (isExceeded) {
      return router.push('/paywall?highlight=transactions')
    }
    try {
      const datetime = new Date(transaction.datetime).toISOString()
      await createTransaction({...transaction, type: type, datetime})
      if (transaction.categoryId) {
        globalStorage.setItem(lastCategoryId, transaction.categoryId)
      }
      if (transaction.accountId) {
        globalStorage.setItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID, transaction.accountId)
      }
      globalStorage.setItem(
        STORAGE_CONSTANT_NUMBER_OF_TRANSACTIONS,
        String(numberOfTransactions + 1)
      )
      router.back()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.error(t('error'))
    }
  }

  return (
    <View className="flex-1 bg-background">
      <TransactionForm
        form={form}
        onSubmit={handleCreateTransaction}
        onCancel={router.back}
        type={type}
        showAccountSelect={showAccountSelect}
      />
      <ToastModal />
      <WindowOverlay>
        <PortalHost name="transaction-form" />
      </WindowOverlay>
    </View>
  )
}
