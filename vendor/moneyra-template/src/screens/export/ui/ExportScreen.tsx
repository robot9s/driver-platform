import {IconLock} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import * as Sharing from 'expo-sharing'
import {useEffect, useState} from 'react'
import {Alert, ScrollView, Switch, View, Text, ActivityIndicator} from 'react-native'
import {useUserEntitlements} from '@entities/subscription'
import {exportFullBackupJSON, exportTransactionsCSV} from '@shared/backup'
import {database} from '@shared/database'
import {useTranslation} from '@shared/i18n'
import {Button} from '@shared/ui/button'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import type {ReactNode} from 'react'

export default function ExportScreen() {
  const {t} = useTranslation('ExportScreen')
  const router = useRouter()
  const {isPro} = useUserEntitlements()
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [count, setCount] = useState<number | null>(null)
  const [busy, setBusy] = useState<'csv' | 'json' | null>(null)

  useEffect(() => {
    database
      .get('transactions')
      .query()
      .fetchCount()
      .then(setCount)
      .catch(() => setCount(null))
  }, [database])

  async function shareFile(uri: string, title: string) {
    const available = await Sharing.isAvailableAsync()
    if (available) {
      await Sharing.shareAsync(uri, {dialogTitle: title})
    } else {
      Alert.alert(t('alerts.savedTitle'), uri)
    }
  }

  function errMsg(e: unknown) {
    return e instanceof Error ? e.message : String(e)
  }

  async function onExportCSV() {
    try {
      if (!isPro) {
        return router.push('/paywall?highlight=export')
      }
      setBusy('csv')
      const uri = await exportTransactionsCSV(database, {includeHeaders})
      await shareFile(uri, t('share.csvTitle'))
    } catch (e: unknown) {
      Alert.alert(t('errors.exportFailedTitle'), errMsg(e))
    } finally {
      setBusy(null)
    }
  }

  async function onExportBackup() {
    try {
      if (!isPro) {
        return router.push('/paywall?highlight=export')
      }
      setBusy('json')
      const uri = await exportFullBackupJSON(database)
      await shareFile(uri, t('share.backupTitle'))
    } catch (e: unknown) {
      Alert.alert(t('errors.backupFailedTitle'), errMsg(e))
    } finally {
      setBusy(null)
    }
  }

  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <ScrollView className="bg-background" contentContainerClassName="gap-3 px-4 mt-4 pb-6">
        <Section title={t('backup.title')} hint={t('footer.hintJson')}>
          <Text className="text-muted-foreground">{t('backup.description')}</Text>
          <Button onPress={onExportBackup} disabled={!!busy} className="mt-3">
            {busy === 'json' ? <ActivityIndicator size="small" /> : null}
            <View className="flex-row items-center gap-1">
              <Text>{t('backup.action')}</Text>
              {!isPro && <IconLock className="size-5 text-muted" />}
            </View>
          </Button>
        </Section>

        <Section title={t('csv.title')} hint={t('footer.hintCvv')}>
          <View className="py-3 flex-row items-center justify-between">
            <Text className="text-primary">{t('csv.headersLabel')}</Text>
            <Switch className="mr-4" value={includeHeaders} onValueChange={setIncludeHeaders} />
          </View>
          <Text className="text-muted-foreground mt-2">{t('csv.columnsHint')}</Text>
          <Text className="text-muted-foreground mt-2">
            {t('csv.count', {transactions: `${count ?? '—'}`})}
          </Text>
          <Button onPress={onExportCSV} disabled={(count ?? 0) === 0 || !!busy} className="mt-4">
            {busy === 'csv' ? <ActivityIndicator size="small" /> : null}
            <View className="flex-row items-center gap-1">
              <Text>{t('csv.action')}</Text>
              {!isPro && <IconLock className="size-5 text-muted" />}
            </View>
          </Button>
        </Section>
      </ScrollView>
    </ScreenContent>
  )
}

// PARTS

function Section({title, children, hint}: {title: string; children: ReactNode; hint?: ReactNode}) {
  return (
    <View className="mb-6">
      <Text className="text-foreground text-base font-semibold mb-2">{title}</Text>
      <View className="bg-zinc-300 dark:bg-neutral-800 rounded-2xl p-3">{children}</View>
      {hint && <Text className="text-muted-foreground mt-2">{hint}</Text>}
    </View>
  )
}
