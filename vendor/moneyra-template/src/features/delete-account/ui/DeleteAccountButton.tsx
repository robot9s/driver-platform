import {toast} from '@backpackapp-io/react-native-toast'
import {IconTrash} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {useState} from 'react'
import type {AccountID} from '@entities/account'
import {useAccountsOnce, useDeleteAccount} from '@entities/account'
import {useUserEntitlements} from '@entities/subscription'
import {useDeleteTransactionsByAccount} from '@entities/transaction'
import {ENTITLEMENT_LIMIT} from '@shared/config/appLimits'
import {useTranslation} from '@shared/i18n'
import {
  globalStorage,
  STORAGE_EXPENSE_LAST_CATEGORY_ID,
  STORAGE_INCOME_LAST_CATEGORY_ID,
} from '@shared/storage/global-storage'
import {Button} from '@shared/ui/button'
import {ConfirmationDialog} from '@shared/ui-primitives/ConfirmationDialog'
import {LoadingModal} from '@shared/ui-primitives/LoadingModal'

export const DeleteAccountButton = ({id, beforeDelete}: DeleteAccountButtonProps) => {
  const {t} = useTranslation('DeleteAccountButton')
  const router = useRouter()

  const {data: accounts} = useAccountsOnce()
  const deleteAccount = useDeleteAccount()
  const deleteTransactionsByAccount = useDeleteTransactionsByAccount()

  const {entitlement, isPro} = useUserEntitlements()
  const isExceeded = ENTITLEMENT_LIMIT[entitlement]?.minWallets >= (accounts?.length ?? 0)
  const [confirmationIsOpen, setConfirmationIsOpen] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)
  const [countTransactions, setCountTransactions] = useState(0)

  const onDelete = async () => {
    if (!isPro) {
      return router.push('/paywall?highlight=accounts')
    }
    beforeDelete?.()
    setLoadingModal(true)
    try {
      await deleteTransactionsByAccount(id)
      await deleteAccount(id)
      globalStorage.removeItem(STORAGE_EXPENSE_LAST_CATEGORY_ID)
      globalStorage.removeItem(STORAGE_INCOME_LAST_CATEGORY_ID)
      setLoadingModal(false)
      setCountTransactions(0)
      router.back()
    } catch (error) {
      console.log('error', error)
      setLoadingModal(false)
      setCountTransactions(0)
      toast.error(String(error))
    }
  }

  const closeConfirmation = () => setConfirmationIsOpen(false)
  const openConfirmation = () => setConfirmationIsOpen(true)

  return (
    <>
      <Button size="icon" variant="ghost" onPress={openConfirmation} disabled={isExceeded}>
        <IconTrash className="size-7 text-foreground" />
      </Button>
      <ConfirmationDialog
        title={t('confirm.title')}
        description={t('confirm.body')}
        open={confirmationIsOpen}
        onCancel={closeConfirmation}
        onContinue={onDelete}
      />
      <LoadingModal
        modalVisible={loadingModal}
        title={
          countTransactions > 0
            ? t('loadingWithTransactions', {transactions: countTransactions})
            : t('loading')
        }
      />
    </>
  )
}

// TYPES

interface DeleteAccountButtonProps {
  id: AccountID
  beforeDelete?(): void
  className?: string
}
