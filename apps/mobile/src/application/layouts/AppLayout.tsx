import {Redirect, Stack} from 'expo-router'
import {Platform} from 'react-native'
import {authClient} from '@shared/api'
import {useTranslation} from '@shared/i18n'
import {useColorPalette} from '@shared/lib/palette'
import {BackButton} from './ui/BackButton'

export default function AppLayout() {
  const {t} = useTranslation('AppLayout')
  const {getColor} = useColorPalette()
  const {data: session, isPending} = authClient.useSession()

  if (isPending) {
    return null
  }

  if (!session) {
    return <Redirect href="/login" />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: getColor('--foreground'),
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 16,
          color: getColor('--foreground'),
        },
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: getColor('--background'),
        },
        headerLeft: () => <BackButton />,
        ...(Platform.OS === 'android' && {
          animation: 'ios_from_right',
        }),
      }}
    >
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen
        name="appearance"
        options={{
          headerTitle: t('headerTitle.appearance'),
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          headerTitle: t('headerTitle.languages'),
        }}
      />
      <Stack.Screen
        name="faq"
        options={{
          headerTitle: t('headerTitle.faq'),
        }}
      />
    </Stack>
  )
}
