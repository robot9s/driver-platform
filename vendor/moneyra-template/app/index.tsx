import {Redirect} from 'expo-router'
import {
  constantStorage,
  STORAGE_CONSTANT_IS_USER_ONBOARDED,
} from '@shared/storage/contstant-storage'

export default function Index() {
  const completed = constantStorage.getBoolean(STORAGE_CONSTANT_IS_USER_ONBOARDED)

  if (!completed) {
    return <Redirect href="/welcome" />
  }

  return <Redirect href="/(app)/(tabs)" />
}
