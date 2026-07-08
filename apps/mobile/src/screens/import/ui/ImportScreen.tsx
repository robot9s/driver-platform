import {toast} from '@backpackapp-io/react-native-toast'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import {useState} from 'react'
import {Alert, ScrollView, View, Text, Pressable, ActivityIndicator} from 'react-native'
import type {ValidBackup, TableName} from '@shared/backup'
import {importFullBackupJSON, validateBackupShape} from '@shared/backup'
import {database} from '@shared/database'
import {useTranslation} from '@shared/i18n'
import {Button} from '@shared/ui/button'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import type {ReactNode} from 'react'

export default function ImportScreen() {
  const {t} = useTranslation('ImportScreen')
  const [busy, setBusy] = useState(false)
  const [pickedFile, setPickedFile] = useState<string | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)

  async function pickFile() {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      })
      if (res.canceled || !res.assets?.[0]) return
      const asset = res.assets[0]
      setPickedFile(asset.name ?? 'backup.json')

      const text = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      })

      const parsed = JSON.parse(text)
      let valid: ValidBackup
      try {
        valid = validateBackupShape(parsed)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        const [key, table] = msg.split(':')
        Alert.alert(t('errors.title'), t(key, {table}))
        setPreview(null)
        setPickedFile(null)
        return
      }

      setPreview({
        version: valid.version,
        exportedAt: valid.exportedAt,
        tables: Object.keys(valid.tables) as TableName[],
        sample: valid.tables.transactions?.[0] as Record<string, unknown> | undefined,
        raw: valid,
      })
    } catch (e: unknown) {
      toast.error(t(e instanceof Error ? e.message : String(e)))
      setPreview(null)
      setPickedFile(null)
    }
  }

  async function doImport() {
    if (!preview?.raw?.tables) return
    try {
      setBusy(true)
      await importFullBackupJSON(database, preview.raw.tables)
      toast.success(t(`done.message`))
      setPreview(null)
      setPickedFile(null)
    } catch (e: unknown) {
      toast.error(t(e instanceof Error ? e.message : String(e)))
    } finally {
      setBusy(false)
    }
  }

  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <ScrollView className="bg-background" contentContainerClassName="gap-3 px-4 mt-4 pb-6">
        <Section title={t('title')} hint={t('note')}>
          <Text className="text-muted-foreground">{t('description')}</Text>
          <Button onPress={pickFile} disabled={busy} className="mt-3">
            {busy ? <ActivityIndicator size="small" /> : null}
            <Text className="text-primary-foreground font-semibold">
              {pickedFile ?? t('buttons.choose')}
            </Text>
          </Button>

          {preview && (
            <View className="mt-3 rounded-xl border border-border">
              <Text className="text-sm text-muted-foreground">
                {t('preview.version')}{' '}
                <Text className="text-foreground font-medium">
                  {String(preview.version ?? '—')}
                </Text>
              </Text>
              <Text className="text-sm text-muted-foreground">
                {t('preview.tables')}{' '}
                <Text className="text-foreground font-medium">{preview.tables.join(', ')} </Text>
              </Text>
              {preview.sample && (
                <Text className="text-xs text-muted-foreground mt-2">
                  {t('preview.sample')} {JSON.stringify(preview.sample).slice(0, 200)}…
                </Text>
              )}

              <Pressable
                onPress={doImport}
                disabled={busy}
                className={`mt-3 rounded-xl px-4 py-3 items-center justify-center ${busy ? 'opacity-60' : ''} bg-green-500`}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">{t('buttons.import')}</Text>
                )}
              </Pressable>
            </View>
          )}
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

// TYPES

type Preview = {
  version?: string | number
  exportedAt?: string
  tables: TableName[]
  sample?: Record<string, unknown>
  raw: ValidBackup
}
