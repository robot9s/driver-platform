import {IconTrash} from '@tabler/icons-react-native'
import {useState} from 'react'
import type {BudgetRecordID} from '@entities/budget'
import {useDeleteBudget} from '@entities/budget'
import {Button} from '@shared/ui/button'
import {ConfirmationDialog} from '@shared/ui-primitives/ConfirmationDialog'
import {LoadingModal} from '@shared/ui-primitives/LoadingModal'

interface DeleteBudgetButtonProps {
  id: BudgetRecordID
  onComplete?: () => void
  beforeDelete?(): void
  className?: string
}

export const DeleteBudgetButton = ({id, onComplete, beforeDelete}: DeleteBudgetButtonProps) => {
  const deleteBudgetRecord = useDeleteBudget()

  const [loadingModal, setLoadingModal] = useState(false)
  const [confirmationIsOpen, setConfirmationIsOpen] = useState(false)

  const onDelete = async () => {
    beforeDelete?.()
    try {
      setLoadingModal(true)
      await deleteBudgetRecord(id)
      setLoadingModal(false)
      onComplete?.()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setLoadingModal(false)
    }
  }

  const closeConfirmation = () => setConfirmationIsOpen(false)
  const openConfirmation = () => setConfirmationIsOpen(true)

  return (
    <>
      <Button className="rounded-full" size="icon" variant="ghost" onPress={openConfirmation}>
        <IconTrash className="size-7 text-foreground" />
      </Button>
      <ConfirmationDialog
        title="Are you sure?"
        description="You will not be able to undo this action. Make sure you have a backup."
        open={confirmationIsOpen}
        onCancel={closeConfirmation}
        onContinue={onDelete}
      />
      <LoadingModal modalVisible={loadingModal} />
    </>
  )
}
