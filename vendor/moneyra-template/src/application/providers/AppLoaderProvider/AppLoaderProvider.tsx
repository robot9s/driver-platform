import * as SplashScreen from 'expo-splash-screen'
import {useState, useEffect, useCallback} from 'react'
import {View} from 'react-native'
import {getMeta} from '@shared/database'
import {
  constantStorage,
  STORAGE_CONSTANT_IS_USER_ONBOARDED,
} from '@shared/storage/contstant-storage'
import type {ReactNode} from 'react'

export function AppLoaderProvider({children}: AppLoaderProviderProps) {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const userOnboarded = !!constantStorage.getBoolean(STORAGE_CONSTANT_IS_USER_ONBOARDED)
        if (!userOnboarded) {
          const metaVal = await getMeta('onboarding_completed')
          if (metaVal === 'true') {
            constantStorage.setBoolean(STORAGE_CONSTANT_IS_USER_ONBOARDED, true)
          }
        }
      } finally {
        setAppIsReady(true)
      }
    })()
  }, [])

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      {children}
    </View>
  )
}

// TYPES

type AppLoaderProviderProps = {
  children: ReactNode
}
