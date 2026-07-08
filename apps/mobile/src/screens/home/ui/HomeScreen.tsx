import {useQuery} from '@tanstack/react-query'
import {View} from 'react-native'
import {authClient, orpcClient} from '@shared/api'
import {useTranslation} from '@shared/i18n'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'

export default function HomeScreen() {
  const {t} = useTranslation('HomeScreen')
  const {data: session} = authClient.useSession()

  const {data, isPending, isError} = useQuery({
    queryKey: ['drivers', 'getMyProfile'],
    queryFn: () => orpcClient.drivers.getMyProfile(),
    enabled: !!session,
  })

  const profileStatus = isPending
    ? t('profile.loading')
    : isError
      ? t('profile.error')
      : data?.profile
        ? t('profile.ready')
        : t('profile.empty')

  return (
    <ScreenContent excludeEdges={['bottom']} backgroundColor="bg-background">
      <View className="flex-1 items-center justify-center gap-2 px-6">
        <Text className="text-3xl font-semibold">Driver Platform</Text>
        <Text className="text-base text-muted-foreground text-center">{t('subtitle')}</Text>
        {session && (
          <View className="mt-6 items-center gap-1">
            <Text className="text-sm text-muted-foreground">{session.user.email}</Text>
            <Text className="text-sm text-muted-foreground">{profileStatus}</Text>
          </View>
        )}
      </View>
    </ScreenContent>
  )
}
