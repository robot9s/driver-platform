import '../global.css'

import NetInfo from '@react-native-community/netinfo'
import {PortalHost} from '@rn-primitives/portal'
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister'
import {focusManager, onlineManager} from '@tanstack/react-query'
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import * as NavigationBar from 'expo-navigation-bar'
import {Stack} from 'expo-router'
import {ThemeProvider, DarkTheme, DefaultTheme} from 'expo-router/react-navigation'
import * as SplashScreen from 'expo-splash-screen'
import {StatusBar} from 'expo-status-bar'
import {colorScheme as nativewindColorScheme, cssInterop} from 'nativewind'
import {useCallback, useEffect, useState} from 'react'
import {AppState, type AppStateStatus, Platform, View} from 'react-native'
import {KeyboardProvider} from 'react-native-keyboard-controller'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Svg} from 'react-native-svg'
import {AuthLocal, useLocalAuth} from '@entities/auth'
import {initSentry} from '@shared/config/sentry'
import {LanguageProvider} from '@shared/i18n'
import {useColorScheme} from '@shared/lib/theme'
import {SheetProvider} from '@shared/sheet-provider'
import {queryStorage} from '@shared/storage/query-storage'
import {useUserSettingsStore} from '@shared/stores/user-settings'
import {ToastRoot} from '@shared/toast/ToastRoot'
import {queryClient} from '../libs/queryClient'
import {CustomPaletteWrapper} from '../providers/CustomPaletteWrapper'
import 'react-native-reanimated'
import '../intl-polyfills'

const SentryInstance = !__DEV__ && initSentry()

// Online status management
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const asyncStoragePersister = createAsyncStoragePersister({
  storage: queryStorage,
})

const initialPreferredTheme = useUserSettingsStore.getState().preferredTheme
nativewindColorScheme.set(initialPreferredTheme)

cssInterop(Svg, {
  className: {
    target: 'style',
    nativeStyleToProp: {width: true, height: true},
  },
})

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 300,
  fade: true,
})

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('../../../ReactotronConfig')
}

function RootLayout() {
  const {colorScheme, setColorScheme} = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false)
  const preferredTheme = useUserSettingsStore((state) => state.preferredTheme)

  const onLayoutRootView = useCallback(() => {
    // Use a double requestAnimationFrame:
    // 1. The first rAF waits for the current layout/paint cycle to finish.
    // 2. The second rAF ensures the first real UI frame is actually rendered.
    // This prevents a white flash between the splash screen and the app content.
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        await SplashScreen.hideAsync()
      })
    })
  }, [])

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setStyle(colorScheme === 'dark' ? 'dark' : 'light')
    }
  }, [colorScheme])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)

    const loadTheme = async () => {
      if (!preferredTheme) {
        setIsColorSchemeLoaded(true)
        return
      }
      if (preferredTheme !== colorScheme) {
        setColorScheme(preferredTheme)

        setIsColorSchemeLoaded(true)
        return
      }
      setIsColorSchemeLoaded(true)
    }

    loadTheme()

    return () => subscription.remove()
  }, [])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      <RootLayoutNav />
    </View>
  )
}

export default SentryInstance ? SentryInstance.wrap(RootLayout) : RootLayout

// PARTS

function RootLayoutNav() {
  const preferredTheme = useUserSettingsStore((state) => state.preferredTheme)
  const {shouldAuthLocal, setShouldAuthLocal} = useLocalAuth()

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{persister: asyncStoragePersister}}
    >
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider value={preferredTheme === 'dark' ? DarkTheme : DefaultTheme}>
            <CustomPaletteWrapper>
              <StatusBar style={preferredTheme === 'dark' ? 'light' : 'dark'} />
              <LanguageProvider>
                <SheetProvider>
                  {shouldAuthLocal && (
                    <AuthLocal onAuthenticated={() => setShouldAuthLocal(false)} />
                  )}
                  <Stack>
                    <Stack.Screen name="(app)" options={{headerShown: false, animation: 'none'}} />
                    <Stack.Screen
                      name="(static)"
                      options={{headerShown: false, presentation: 'modal'}}
                    />
                    <Stack.Screen name="welcome" options={{headerShown: false}} />
                    <Stack.Screen name="login" options={{headerShown: false}} />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <ToastRoot />
                  <PortalHost />
                </SheetProvider>
              </LanguageProvider>
            </CustomPaletteWrapper>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  )
}
