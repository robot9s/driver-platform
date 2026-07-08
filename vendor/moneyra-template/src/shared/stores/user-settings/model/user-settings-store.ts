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
  showStatisticsDiagram: boolean
  setShowStatisticsDiagram: (show: boolean) => void
  showBudgetLeft: boolean
  setShowBudgetLeft: (show: boolean) => void
  showAccountSelect: boolean
  setShowAccountSelect: (show: boolean) => void
  autoBackup: boolean
  setAutoBackup: (auto: boolean) => void
  lastBackupAt?: string
  setLastBackupAt: (iso: string) => void
}

export const useUserSettingsStore = create<UserSettingsStore>()(
  persist(
    (set) => ({
      enabledLocalAuth: false,
      setEnabledLocalAuth: (enabledLocalAuth) => set({enabledLocalAuth}),
      preferredTheme: 'dark',
      setPreferredTheme: (preferredTheme) => set({preferredTheme}),
      preferredPalette: Palette.Default,
      setShowStatisticsDiagram: (showStatisticsDiagram) => set({showStatisticsDiagram}),
      showStatisticsDiagram: true,
      setShowBudgetLeft: (showBudgetLeft) => set({showBudgetLeft}),
      showBudgetLeft: true,
      setShowAccountSelect: (showAccountSelect) => set({showAccountSelect}),
      showAccountSelect: true,
      setAutoBackup: (autoBackup) => set({autoBackup}),
      autoBackup: false,
      lastBackupAt: undefined,
      setLastBackupAt: (iso) => set({lastBackupAt: iso}),
    }),
    {
      name: 'user-settings-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)

export const getUserSettingsState = () => useUserSettingsStore.getState()
