import {toast} from '@backpackapp-io/react-native-toast'
import {IconChevronRight, IconLock} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {useEffect, useState} from 'react'
import {Alert, ActivityIndicator, FlatList, Modal, Pressable, View, Platform} from 'react-native'
// eslint-disable-next-line no-restricted-imports
import {AccountsRepo} from '@entities/account/model/repository.watermelon'
import {useUserEntitlements} from '@entities/subscription'
import {listBackups, createBackup, restoreFromItem, deleteItem} from '@shared/backup/backup'
import {useLocale, useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {globalStorage, STORAGE_CONSTANT_LAST_ACCOUNT_ID} from '@shared/storage/global-storage'
import {useUserSettingsStore} from '@shared/stores/user-settings'
import {Button} from '@shared/ui/button'
import {Separator} from '@shared/ui/separator'
import {Switch} from '@shared/ui/switch'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {formatBytes} from '../libs/formatBytes'
import {formatWhen} from '../libs/formatWhen'

export default function BackupScreen() {
  const {t} = useTranslation('BackupScreen')
  const {language} = useLocale()
  const router = useRouter()
  const {isPro} = useUserEntitlements()
  const [items, setItems] = useState<Item[]>([])
  const [busy, setBusy] = useState<null | 'create' | 'restore' | 'delete'>(null)
  const [error, setError] = useState<string | null>(null)
  const asMsg = (e: unknown) => (e instanceof Error ? e.message : String(e))

  const [sheetOpen, setSheetOpen] = useState(false)
  const [selected, setSelected] = useState<Item | null>(null)

  const auto = useUserSettingsStore((s) => s.autoBackup)
  const setAuto = useUserSettingsStore((s) => s.setAutoBackup)

  async function reload() {
    try {
      const data = await listBackups()
      setItems(data)
    } catch (e) {
      setError(`[Backup failed]: ${asMsg(e)}`)
      throw e
    }
  }

  useEffect(() => {
    reload()
  }, [])

  function openSheet(item: Item) {
    setSelected(item)
    setSheetOpen(true)
  }
  function closeSheet() {
    setSheetOpen(false)
    setSelected(null)
  }

  async function handleSwitchAutoBackup(value: boolean) {
    try {
      if (!isPro) {
        return router.push('/paywall?highlight=sync')
      }
      setAuto(value)
      await listBackups()
      setError(null)
    } catch (e) {
      setAuto(false)
      toast.error(asMsg(e))
    }
  }

  async function handleCreate() {
    try {
      if (!isPro) {
        return router.push('/paywall?highlight=sync')
      }
      setBusy('create')
      await createBackup()
      await reload()
    } catch (e) {
      Alert.alert(t('error.title'), String(e))
    } finally {
      setBusy(null)
    }
  }

  async function handleRestore(item: Item) {
    Alert.alert(t('restore.confirmTitle'), t('restore.confirmMessage'), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('restore.confirmAction'),
        style: 'destructive',
        onPress: async () => {
          try {
            setBusy('restore')
            await restoreFromItem(item)
            const accounts = await AccountsRepo.fetchListOnce()
            globalStorage.setItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID, accounts[0]?.id)
            Alert.alert(t('restore.doneTitle'), t('restore.doneMessage'))
            router.replace('/')
          } catch (e) {
            Alert.alert(t('error.restoreTitle'), String(e))
          } finally {
            setBusy(null)
            closeSheet()
          }
        },
      },
    ])
  }

  async function handleDelete(item: Item) {
    Alert.alert(t('delete.confirmTitle'), item.name, [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('delete.confirmAction'),
        style: 'destructive',
        onPress: async () => {
          try {
            setBusy('delete')
            await deleteItem(item)
            await reload()
          } catch (e) {
            Alert.alert(t('error.deleteTitle'), String(e))
          } finally {
            setBusy(null)
            closeSheet()
          }
        },
      },
    ])
  }

  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <FlatList
        data={items}
        keyExtractor={(x) => x.name}
        contentContainerClassName="gap-1 p-4"
        ListHeaderComponent={
          <View className="gap-4">
            {error && (
              <View className="rounded-xl border border-rose-500 bg-rose-500/15 px-3 py-2">
                <View className="flex-row items-start">
                  <Text className="flex-1 text-rose-400 font-semibold" numberOfLines={3}>
                    {error}
                  </Text>
                </View>
              </View>
            )}
            <Text className="text-foreground font-semibold">
              {t('description', {
                service: Platform.OS === 'ios' ? 'iCloud Drive' : 'Google Drive',
              })}
            </Text>
            <View className="overflow-hidden rounded-2xl bg-secondary mb-8">
              <View className="flex-row items-center justify-between border-b border-foreground/20 px-4 py-3">
                <Text className="font-semibold ">{t('auto.title')}</Text>
                <Switch checked={auto} onCheckedChange={handleSwitchAutoBackup} />
              </View>
              <Pressable
                disabled={!!busy || Boolean(error)}
                onPress={handleCreate}
                className="px-4 py-3"
              >
                {busy === 'create' ? (
                  <ActivityIndicator />
                ) : (
                  <View className="flex-row items-center gap-1">
                    <Text
                      className={cn(
                        ' font-semibold text-emerald-400',
                        Boolean(error) && 'text-muted-foreground'
                      )}
                    >
                      {t('create')}
                    </Text>
                    {!isPro && <IconLock className="size-5 text-muted-foreground" />}
                  </View>
                )}
              </Pressable>
            </View>
            <Text className="text-xl font-bold text-neutral-50 mb-1">{t('recent')}</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={<Text className="mt-6 text-center text-neutral-400">{t('empty')}</Text>}
        renderItem={({item}) => (
          <Pressable
            onPress={() => openSheet(item)}
            className="bg-muted-foreground/10 rounded-lg active:bg-muted px-4 py-3"
          >
            <View className="flex-row items-center justify-between">
              <View className="shrink">
                <Text className="font-semibold text-white capitalize" numberOfLines={1}>
                  {formatWhen(item.mtime, language)}
                </Text>
                <Text className="mt-0.5 text-xs text-neutral-400">{formatBytes(item.size)}</Text>
              </View>
              <IconChevronRight className="h-6 w-6 text-foreground" />
            </View>
          </Pressable>
        )}
      />

      <BackupActionSheet
        visible={sheetOpen}
        item={selected}
        busy={!!busy}
        onRestore={() => selected && handleRestore(selected)}
        onDelete={() => selected && handleDelete(selected)}
        onClose={closeSheet}
      />
    </ScreenContent>
  )
}

// PARTS

const BackupActionSheet = ({visible, item, busy, onRestore, onDelete, onClose}: SheetProps) => {
  const {t} = useTranslation('BackupScreen')

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 bg-black/40" />
      <View className="rounded-t-3xl bg-neutral-900 p-4">
        <View className="mb-3 h-1.5 w-12 self-center rounded-full bg-neutral-700" />
        <Text className="mb-5 text-center text-sm text-neutral-400">
          {item ? `${formatWhen(item.mtime)} • ${formatBytes(item.size)}` : ''}
        </Text>
        <View className="mb-8">
          <View className="gap-3">
            <Button
              disabled={busy || !item}
              onPress={onRestore}
              className="text-center bg-neutral-800"
            >
              <Text className="font-semibold text-emerald-400">{t('sheet.restore')}</Text>
            </Button>

            <Button
              disabled={busy || !item}
              onPress={onDelete}
              className="text-center bg-neutral-800"
            >
              <Text className="font-semibold text-rose-500">{t('sheet.delete')}</Text>
            </Button>
          </View>
          <Separator className="my-6" />
          <Button onPress={onClose} className="text-center bg-neutral-800">
            <Text className="font-semibold text-neutral-300">{t('common.cancel')}</Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
}

// TYPES

type SheetProps = {
  visible: boolean
  item: Item | null
  busy: boolean
  onRestore: () => void
  onDelete: () => void
  onClose: () => void
}

type Item = {
  name: string
  size?: number
  mtime?: number
}
