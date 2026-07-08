import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {Palette} from '@shared/lib/theme'
import {zustandStorage} from '@shared/storage/zustand-storage'

interface UserSettingsStore {
  enabledLocalAuth: boolean
  setEnabledLocalAuth: (enabledLocalAuth: boolean) => void
  preferredTheme: 'light' | 'dark' | 'system'
  setPreferredTheme: (preferredTheme: 'light' | 'dark' | 'system') => void
  preferredPalette: Palette
}

export const useUserSettingsStore = create<UserSettingsStore>()(
  persist(
    (set) => ({
      enabledLocalAuth: false,
      setEnabledLocalAuth: (enabledLocalAuth) => set({enabledLocalAuth}),
      preferredTheme: 'dark',
      setPreferredTheme: (preferredTheme) => set({preferredTheme}),
      preferredPalette: Palette.Default,
    }),
    {
      name: 'user-settings-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)

export const getUserSettingsState = () => useUserSettingsStore.getState()
