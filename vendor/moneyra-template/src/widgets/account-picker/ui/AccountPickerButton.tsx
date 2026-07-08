import {type BottomSheetModal} from '@gorhom/bottom-sheet'
import {IconWallet} from '@tabler/icons-react-native'
import {useRef, useEffect, useState} from 'react'
import {Keyboard} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import {useAccountsOnce} from '@entities/account'
import {useTranslation} from '@shared/i18n'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import {BottomSheet} from '@shared/ui-primitives/Sheet'
import {AccountSheet} from './AccountSheet'

export function AccountPickerButton({value, onChange, visible = true}: AccountPickerProps) {
  const {t} = useTranslation('AccountPicker')
  const {data: accounts} = useAccountsOnce()
  const selectedAccountId = value ?? accounts[0]?.id
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)
  const sheetRef = useRef<BottomSheetModal>(null)
  const [shouldRender, setShouldRender] = useState(visible)

  const animatedValue = useSharedValue(visible ? 1 : 0)
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedValue.value * 100}%`,
    maxWidth: 140,
    opacity: animatedValue.value,
  }))

  useEffect(() => {
    if (visible) {
      setShouldRender(true)
      animatedValue.value = withTiming(1, {duration: 300})
    } else {
      animatedValue.value = withTiming(0, {duration: 300}, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false)
        }
      })
    }
  }, [visible])

  if (!shouldRender) return null

  return (
    <Animated.View style={animatedStyle}>
      <Button
        variant="secondary"
        className="!px-2 max-w-[140px]"
        onPress={() => {
          Keyboard.dismiss()
          sheetRef.current?.present()
        }}
      >
        {!!selectedAccount && <IconWallet className="size-6 text-secondary-foreground" />}
        <Text className="line-clamp-1 shrink">{selectedAccount?.title || t('selectAccount')}</Text>
      </Button>
      <BottomSheet ref={sheetRef} index={0} enableDynamicSizing>
        <AccountSheet
          onSelect={onChange}
          value={selectedAccountId}
          closeSheetModal={sheetRef.current?.close}
        />
      </BottomSheet>
    </Animated.View>
  )
}

// TYPES

interface AccountPickerProps {
  onChange: (id: string) => void
  value?: string | null
  visible?: boolean
}
