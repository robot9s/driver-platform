import {useRouter} from 'expo-router'
import {FlatList, View} from 'react-native'
import {useBalanceAccount} from '@features/statistics'
import type {Account} from '@entities/account'
import {AccountCard, useAccountsObserved} from '@entities/account'
import {AccountsEmptyIllustration} from '@shared/assets/illustrations'
import {useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {HeaderRight} from './HeaderRight'

export default function AccountsScreen() {
  const {t} = useTranslation('AccountsScreen')
  const router = useRouter()
  const accounts = useAccountsObserved()

  return (
    <ScreenContent
      excludeEdges={['top', 'bottom']}
      navigationOptions={{
        headerRight: () => <HeaderRight />,
      }}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={false}
        contentContainerClassName={cn('p-4 gap-3 pb-36', accounts.length <= 0 && 'flex-1')}
        automaticallyAdjustContentInsets={true}
        data={Object.values(accounts)}
        renderItem={({item: account}) => (
          <AccountCardWrapper
            key={account.id}
            account={account}
            onPress={() => router.push(`/accounts/${account.id}`)}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <AccountsEmptyIllustration className="h-[200px] w-[200px] text-muted-foreground" />
            <Text className="mt-6 text-center text-muted-foreground">{t('notFound.title')}</Text>
            <Text className="text-center text-muted-foreground">{t('notFound.body')}</Text>
          </View>
        }
      />
    </ScreenContent>
  )
}

// PARTS

const AccountCardWrapper = (props: AccountCardWrapperProps) => {
  const {account, onPress} = props
  const {balance} = useBalanceAccount(account.id)

  return <AccountCard account={account} formattedBalance={balance} onPress={onPress} />
}

// TYPES

type AccountCardWrapperProps = {
  account: Account
  onPress(): void
}
