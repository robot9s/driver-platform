import {IconChevronDown} from '@tabler/icons-react-native'
import {useCallback, useRef} from 'react'
import {View} from 'react-native'
import {useAccountsOnce} from '@entities/account'
import {cn} from '@shared/lib/utils'
import {Button} from '@shared/ui/button'
import {Label} from '@shared/ui/label'
import {Text} from '@shared/ui/text'
import {BottomSheet} from '@shared/ui-primitives/Sheet'
import {AccountSheet} from './AccountSheet'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'

export const AccountPickerField = ({value, onChange, label}: AccountSelectFieldProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const {data: accounts} = useAccountsOnce()
  const account = accounts.find((account) => account.id === value)
  const selectedAccountId = account ? account.id : accounts[0]?.id

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <>
      <View className="gap-1">
        <Label nativeID="label-account">{label}</Label>
        <Button
          onPress={handlePresentModalPress}
          variant="ghost"
          className={cn(
            '!border !h-11 !py-0 !px-3 w-full rounded-r border-input justify-between',
            selectedAccountId && 'border-stone-600'
          )}
        >
          <Text>{account?.title ?? 'Select your account'}</Text>
          <IconChevronDown
            size={16}
            aria-hidden={true}
            className="text-foreground opacity-50 justify-center"
          />
        </Button>
      </View>
      <BottomSheet ref={bottomSheetModalRef} index={0} enableDynamicSizing>
        <AccountSheet
          value={selectedAccountId}
          onSelect={onChange}
          closeSheetModal={bottomSheetModalRef.current?.close}
        />
      </BottomSheet>
    </>
  )
}

// TYPES

interface AccountSelectFieldProps {
  value: string
  onChange(accountId: string): void
  label?: string
}
