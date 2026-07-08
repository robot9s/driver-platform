import {toast} from '@backpackapp-io/react-native-toast'
import {AppState} from 'react-native'
import {createBackup} from '@shared/backup/backup'
import {useUserSettingsStore} from '@shared/stores/user-settings'

const ONE_DAY_MS = 24 * 60 * 60 * 1000
let initialized = false

async function maybeAutoBackup(reason: 'startup' | 'active') {
  const {autoBackup, lastBackupAt, setLastBackupAt} = useUserSettingsStore.getState()
  if (!autoBackup) return

  const now = Date.now()
  const last = lastBackupAt ? new Date(lastBackupAt).getTime() : 0
  const due = now - last > ONE_DAY_MS

  if (!due) return

  try {
    await createBackup()
    setLastBackupAt(new Date().toISOString())
    console.log(`[autoBackup] Backup created (${reason})`)
  } catch (e) {
    toast.error(`[autoBackup] failed: ${e instanceof Error ? e.message : String(e)}`)
  }
}

export function initializeAutoBackup() {
  if (initialized) return
  initialized = true

  // Check immediately at startup
  void maybeAutoBackup('startup')

  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void maybeAutoBackup('active')
    }
  })
}
