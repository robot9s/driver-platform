import {toast} from '@backpackapp-io/react-native-toast'
import * as Haptics from 'expo-haptics'
import {useLocalSearchParams, useRouter} from 'expo-router'
import {useEffect} from 'react'
import {ActivityIndicator, Alert, View} from 'react-native'
import type {CreateTransactionFormData} from '@widgets/transaction'
import {createTransactionFormSchema, TransactionForm} from '@widgets/transaction'
import type {UpdateExpense} from '@entities/transaction'
import {useTransactionOnce, useUpdateTransaction, useDeleteTransaction} from '@entities/transaction'
import {useTranslation} from '@shared/i18n'
import {ToastModal} from '@shared/toast/ToastModal'
import {useFinalForm} from '@shared/ui-primitives/FinalFormKit'

export default function TransactionOverviewScreen() {
  const {t} = useTranslation('TransactionOverviewScreen')
  const {id: transactionId, back} = useLocalSearchParams<{id: string; back: string}>()
  const id = String(transactionId)
  if (typeof id === 'undefined') {
    throw new Error('Impossible expense id')
  }
  const router = useRouter()

  const transaction = useTransactionOnce(id)
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()

  const form = useFinalForm({schema: createTransactionFormSchema})
  const {reset} = form

  useEffect(() => {
    if (transaction) {
      reset(transaction)
    }
  }, [id, transaction, reset])

  const handleUpdate = async (values: CreateTransactionFormData) => {
    try {
      await updateTransaction(id, values as UpdateExpense)
      router.back()
      if (back && back !== 'undefined') {
        router.back()
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      toast.error(t('errorUpdate'))
    }
  }

  function handleDelete(onFinish: () => void) {
    Haptics.selectionAsync()
    Alert.alert(t('confirmTitle'), t('confirmBody'), [
      {
        text: t('btnCancel'),
        style: 'cancel',
        onPress: onFinish,
      },
      {
        text: t('btnDelete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTransaction(id)
            onFinish()
            router.back()
            if (back && back !== 'undefined') {
              router.back()
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            onFinish()
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            toast.error(t('errorDelete'), {providerKey: 'MODAL::1'})
          }
        },
      },
    ])
  }

  if (!transaction) {
    return (
      <View className="flex-1 items-center justify-center bg-muted">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-background">
      <TransactionForm
        form={form}
        onSubmit={handleUpdate}
        onCancel={router.back}
        onDelete={handleDelete}
        type={transaction?.type}
        showAccountSelect
      />
      <ToastModal />
    </View>
  )
}
