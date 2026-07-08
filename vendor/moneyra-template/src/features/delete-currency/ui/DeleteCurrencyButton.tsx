import {IconTrash} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {useState} from 'react'
import {Alert} from 'react-native'
import {useAccountsOnce, useDeleteAccountsByCurrency} from '@entities/account'
import type {CurrencyID} from '@entities/currency'
import {useCurrenciesObserved, useDeleteCurrency} from '@entities/currency'
import {useUserEntitlements} from '@entities/subscription'
import {useDeleteTransactionsByAccount} from '@entities/transaction'
import {ENTITLEMENT_LIMIT} from '@shared/config/appLimits'
import {useTranslation} from '@shared/i18n'
import {Button} from '@shared/ui/button'
import {ConfirmationDialog} from '@shared/ui-primitives/ConfirmationDialog'
import {LoadingModal} from '@shared/ui-primitives/LoadingModal'

export const DeleteCurrencyButton = ({id, beforeDelete}: DeleteCurrencyButtonProps) => {
  const {t} = useTranslation('DeleteCurrencyButton')
  const router = useRouter()

  const currencies = useCurrenciesObserved()
  const deleteCurrency = useDeleteCurrency()

  const {data: accounts} = useAccountsOnce()
  const deleteAccountsByCurrency = useDeleteAccountsByCurrency()

  const deleteTransactionsByAccount = useDeleteTransactionsByAccount()
  const {entitlement, isPro} = useUserEntitlements()

  const isExceeded = ENTITLEMENT_LIMIT[entitlement]?.minCurrencies >= (currencies?.length ?? 0)
  const [confirmationIsOpen, setConfirmationIsOpen] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)

  const onDelete = async () => {
    if (!isPro) {
      return router.push('/paywall?highlight=currencies')
    }
    beforeDelete?.()
    if (Object.values(accounts).some((account) => account.currencyId === id)) {
      Alert.alert(
        'Forbidden',
        'Deleting the currency is not possible. Because it is used in the wallet. In order to delete the currency, you must first delete the wallet.',
        [{text: 'Ok'}]
      )
    } else {
      setLoadingModal(true)
      await deleteCurrency(id)
      const accountIds = await deleteAccountsByCurrency(id)
      await deleteTransactionsByAccount(accountIds[0])
      setLoadingModal(false)
    }
  }

  const closeConfirmation = () => setConfirmationIsOpen(false)
  const openConfirmation = () => setConfirmationIsOpen(true)

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        onPress={openConfirmation}
        disabled={isExceeded}
        className="active:bg-background"
      >
        <IconTrash className="size-7 text-foreground" />
      </Button>
      <ConfirmationDialog
        title={t('confirm.title')}
        description={t('confirm.body')}
        open={confirmationIsOpen}
        onCancel={closeConfirmation}
        onContinue={onDelete}
      />
      <LoadingModal modalVisible={loadingModal} />
    </>
  )
}

// TYPES

interface DeleteCurrencyButtonProps {
  id: CurrencyID
  beforeDelete?(): void
  className?: string
}
