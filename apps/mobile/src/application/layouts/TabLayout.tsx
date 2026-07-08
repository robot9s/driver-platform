import {IconPlus} from '@tabler/icons-react-native'
import {Tabs, usePathname, useRouter} from 'expo-router'
import {TouchableOpacity, View} from 'react-native'
import {useTranslation} from '@shared/i18n'
import {useColorPalette} from '@shared/lib/palette'
import {TabBottom} from './ui/TabBottom'

export default function TabLayout() {
  const {t} = useTranslation('TabLayout')
  const {getColor} = useColorPalette()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerTintColor: getColor('--foreground'),
          headerTitleStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 16,
            color: getColor('--foreground'),
          },
          headerStyle: {
            backgroundColor: getColor('--background'),
          },
        }}
        tabBar={(props) => <TabBottom {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="budgets"
          options={{
            title: t('title.budgets'),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('title.settings'),
          }}
        />
      </Tabs>
      {pathname !== '/settings' && (
        <View className="absolute bottom-28 right-6 z-50">
          <TouchableOpacity
            onPress={() => router.push('/transaction/create')}
            className={'bg-secondary rounded-full w-16 h-16 items-center justify-center shadow-lg'}
            activeOpacity={0.8}
          >
            <IconPlus className="size-10 text-primary" />
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}
