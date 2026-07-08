import {IconArrowsDownUp, IconWallet} from '@tabler/icons-react-native'
import {useCallback, useRef} from 'react'
import {TouchableOpacity, View} from 'react-native'
import {useBalanceAccount} from '@features/statistics'
import {useAccountsOnce} from '@entities/account'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import LoadingTypography from '@shared/ui-primitives/LoadingTypography'
import {BottomSheet} from '@shared/ui-primitives/Sheet'
import {AccountSheet} from './AccountSheet'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'

export const AccountPickerSelect = ({accountId, selectAccount}: AccountButtonsProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const {data: accounts} = useAccountsOnce()
  const selectedAccountId = accountId ?? accounts[0]?.id
  const {balance, loading} = useBalanceAccount(selectedAccountId)
  const account = accounts.find((account) => account.id === selectedAccountId)

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex flex-1 flex-row items-center gap-3"
        onPress={handlePresentModalPress}
      >
        <View className="h-12 w-12 items-center justify-center rounded-lg bg-secondary">
          {account?.icon ? (
            <GenericIcon name={account.icon} className="size-8 text-secondary-foreground" />
          ) : (
            <IconWallet className="size-8 text-secondary-foreground" />
          )}
        </View>
        <View className="flex-1 gap-0.5">
          <View className="flex-row items-center gap-1">
            <LoadingTypography
              loading={loading}
              className="line-clamp-1 font-bold text-foreground text-md"
              classes={{skeleton: 'w-[60px]'}}
            >
              {account?.title ?? 'No account'}
            </LoadingTypography>
            <IconArrowsDownUp className="h-4 w-4 text-muted-foreground" />
          </View>
          <LoadingTypography
            loading={loading}
            className="font-medium text-base text-muted-foreground"
            classes={{skeleton: 'w-[80px]'}}
          >
            {(account && balance) ?? '0.00'}
          </LoadingTypography>
        </View>
      </TouchableOpacity>
      <BottomSheet ref={bottomSheetModalRef} index={0} enableDynamicSizing>
        <AccountSheet
          onSelect={selectAccount}
          value={selectedAccountId}
          closeSheetModal={bottomSheetModalRef.current?.close}
        />
      </BottomSheet>
    </>
  )
}

// TYPES

interface AccountButtonsProps {
  accountId: string | undefined
  selectAccount(accountId: string): void
}
