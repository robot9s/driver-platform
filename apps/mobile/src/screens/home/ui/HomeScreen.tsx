import {View} from 'react-native'
import {useTranslation} from '@shared/i18n'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'

export default function HomeScreen() {
  const {t} = useTranslation('HomeScreen')

  return (
    <ScreenContent excludeEdges={['bottom']} backgroundColor="bg-background">
      <View className="flex-1 items-center justify-center gap-2 px-6">
        <Text className="text-3xl font-semibold">Driver Platform</Text>
        <Text className="text-base text-muted-foreground text-center">{t('subtitle')}</Text>
      </View>
    </ScreenContent>
  )
}
