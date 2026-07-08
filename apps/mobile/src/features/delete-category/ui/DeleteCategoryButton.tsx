import {toast} from '@backpackapp-io/react-native-toast'
import {IconTrash} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {useState} from 'react'
import type {ExpenseCategoryID, IncomeCategoryID} from '@entities/category'
import {useDeleteCategory} from '@entities/category'
import {useUserEntitlements} from '@entities/subscription'
import {useDeleteTransactionsByExpenseCategories} from '@entities/transaction'
import {useTranslation} from '@shared/i18n'
import {
  globalStorage,
  STORAGE_EXPENSE_LAST_CATEGORY_ID,
  STORAGE_INCOME_LAST_CATEGORY_ID,
} from '@shared/storage/global-storage'
import {Button} from '@shared/ui/button'
import {ConfirmationDialog} from '@shared/ui-primitives/ConfirmationDialog'
import {LoadingModal} from '@shared/ui-primitives/LoadingModal'

export const DeleteCategoryButton = ({id, beforeDelete}: DeleteCategoryButtonProps) => {
  const {t} = useTranslation('DeleteCategoryButton')
  const router = useRouter()

  const deleteCategory = useDeleteCategory()
  const deleteTransactionsByCategories = useDeleteTransactionsByExpenseCategories()
  const {isPro} = useUserEntitlements()
  const [confirmationIsOpen, setConfirmationIsOpen] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)
  const [countTransactions, setCountTransactions] = useState(0)

  const onDelete = async () => {
    if (!isPro) {
      return router.push('/paywall?highlight=categories')
    }
    beforeDelete?.()
    setLoadingModal(true)
    try {
      await deleteTransactionsByCategories([id])
      await deleteCategory(id)
      globalStorage.removeItem(STORAGE_EXPENSE_LAST_CATEGORY_ID)
      globalStorage.removeItem(STORAGE_INCOME_LAST_CATEGORY_ID)
      setLoadingModal(false)
      setCountTransactions(0)
      router.back()
    } catch (error) {
      toast.error(String(error))
      setCountTransactions(0)
      setLoadingModal(false)
    }
  }

  const closeConfirmation = () => setConfirmationIsOpen(false)
  const openConfirmation = () => setConfirmationIsOpen(true)

  return (
    <>
      <Button size="icon" variant="ghost" onPress={openConfirmation}>
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

interface DeleteCategoryButtonProps {
  id: ExpenseCategoryID | IncomeCategoryID
  beforeDelete?(): void
  className?: string
}
