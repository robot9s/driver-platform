import {IconInfoCircle} from '@tabler/icons-react-native'
import {FlatList, View} from 'react-native'
import {DeleteCurrencyButton} from '@features/delete-currency'
import {CurrencyCard, useCurrenciesObserved} from '@entities/currency'
import {CurrenciesEmptyIllustration} from '@shared/assets/illustrations'
import {useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {HeaderRight} from './HeaderRight'

export default function CurrenciesPage() {
  const {t} = useTranslation('CurrenciesPage')
  const currencies = useCurrenciesObserved()

  return (
    <ScreenContent
      excludeEdges={['top', 'bottom']}
      navigationOptions={{
        headerRight: () => <HeaderRight />,
      }}
    >
      <View className="flex-row gap-2 m-4 p-4 bg-sky-100 dark:bg-sky-950 rounded-lg">
        <IconInfoCircle className="size-8 text-blue-400" />
        <Text className="flex-1">{t('info')}</Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={false}
        contentContainerClassName={cn('p-4 gap-3 pb-36 flex-1')}
        automaticallyAdjustContentInsets={true}
        data={currencies}
        renderItem={({item}) => (
          <CurrencyCard
            key={item.id}
            currency={item}
            actions={<DeleteCurrencyButton id={item.id} />}
            className="bg-muted"
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <CurrenciesEmptyIllustration className="h-[200px] w-[180px] text-muted-foreground" />
            <Text className="mt-6 text-center text-muted-foreground">{t('notFound.title')}</Text>
            <Text className="text-center text-muted-foreground">{t('notFound.body')}</Text>
          </View>
        }
      />
    </ScreenContent>
  )
}
