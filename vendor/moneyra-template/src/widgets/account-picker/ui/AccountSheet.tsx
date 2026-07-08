import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {IconPlus} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useBalanceAccount} from '@features/statistics'
import type {Account} from '@entities/account'
import {useAccountsOnce, AccountCard} from '@entities/account'
import {useUserEntitlements} from '@entities/subscription'
import {ENTITLEMENT_LIMIT} from '@shared/config/appLimits'
import {useTranslation} from '@shared/i18n'
import {globalStorage, STORAGE_CONSTANT_LAST_ACCOUNT_ID} from '@shared/storage/global-storage'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import type {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types'

export const AccountSheet = ({onSelect, value, closeSheetModal}: AccountButtonsProps) => {
  const {t} = useTranslation('AccountSelect')
  const router = useRouter()
  const {data: accounts} = useAccountsOnce()
  const {entitlement} = useUserEntitlements()
  const {bottom} = useSafeAreaInsets()

  const isExceeded =
    ENTITLEMENT_LIMIT[entitlement]?.maxWallets <= (Object.values(accounts).length ?? 0)

  return (
    <BottomSheetFlatList
      data={Object.values(accounts)}
      numColumns={4}
      keyExtractor={(i: Account) => i.id}
      columnWrapperClassName="flex-wrap gap-4"
      contentContainerClassName="px-4"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListHeaderComponent={
        <View className="flex-row justify-between items-center pb-5">
          <Text className="text-lg">{t('title')}</Text>
          <Button
            className="rounded-full"
            size="icon"
            variant="ghost"
            onPress={() => {
              closeSheetModal?.()
              router.push(!isExceeded ? '/accounts/create' : '/paywall?highlight=accounts')
            }}
          >
            <IconPlus className="size-6 text-foreground" />
          </Button>
        </View>
      }
      contentContainerStyle={{paddingBottom: bottom + 16}}
      renderItem={({item: account}: {item: Account}) => {
        return (
          <AccountCardWrapper
            key={account.id}
            account={account}
            selectedAccountId={value}
            onPress={() => {
              onSelect(account.id)
              globalStorage.setItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID, account.id)
              closeSheetModal?.()
            }}
          />
        )
      }}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center">
          <Text className="mt-6 text-center text-muted-foreground">{t('notFound.title')}</Text>
          <Text className="text-center text-muted-foreground">{t('notFound.body')}</Text>
        </View>
      }
    />
  )
}

// PARTS

const AccountCardWrapper = (props: AccountCardWrapperProps) => {
  const {account, onPress, selectedAccountId} = props
  const {balance} = useBalanceAccount(account.id)

  return (
    <AccountCard
      account={account}
      formattedBalance={balance}
      onPress={onPress}
      withCheckbox
      checked={account.id === selectedAccountId}
    />
  )
}

// TYPES

type AccountCardWrapperProps = {
  account: Account
  selectedAccountId: string
  onPress(): void
}

interface AccountButtonsProps {
  onSelect(accountId: string): void
  value: string
  closeSheetModal?: BottomSheetMethods['close']
}
