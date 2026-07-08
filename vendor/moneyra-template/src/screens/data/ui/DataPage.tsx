import {toast} from '@backpackapp-io/react-native-toast'
import {
  IconChevronRight,
  IconDatabaseExport,
  IconFileExport,
  IconFileImport,
  IconTrash,
} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {useState} from 'react'
import {Alert, Platform, ScrollView, View} from 'react-native'
import {SettingCard, SettingCardGroup} from '@widgets/settings-card'
import {useCreateAccount} from '@entities/account'
import {database, seedDatabaseIfNeeded} from '@shared/database'
import {useTranslation} from '@shared/i18n'
import {globalStorage, STORAGE_CONSTANT_LAST_ACCOUNT_ID} from '@shared/storage/global-storage'
import {useUserSettingsStore} from '@shared/stores/user-settings'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'

export default function DataPage() {
  const {t} = useTranslation('DataPage')
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const createAccount = useCreateAccount()

  const auto = useUserSettingsStore((s) => s.autoBackup)

  const onResetPress = () => {
    Alert.alert(t('reset.title'), t('reset.message'), [
      {text: t('reset.cancel'), style: 'cancel'},
      {
        text: t('reset.confirm'),
        style: 'destructive',
        onPress: async () => {
          try {
            setBusy(true)
            await database.write(async () => {
              await database.unsafeResetDatabase()
            })
            const data = await seedDatabaseIfNeeded()
            const {currencies} = data ?? {}
            const account = await createAccount({
              title: 'Bank account',
              currencyId: currencies![0].id,
              icon: 'IconWallet',
              initialBalance: 0,
            })
            globalStorage.setItem(STORAGE_CONSTANT_LAST_ACCOUNT_ID, account.id)
            toast.success(t('reset.done_message'))
            router.replace('/')
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e)
            toast.error(msg)
          } finally {
            setBusy(false)
          }
        },
      },
    ])
  }

  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <ScrollView contentContainerClassName="p-4 gap-4">
        {Platform.OS === 'ios' && (
          <SettingCardGroup title={t('group.backup')}>
            <SettingCard
              className="border-b border-background dark:border-muted"
              onPress={() => router.push('/data/backup')}
              title={t('card.backup.title')}
              icon={IconDatabaseExport}
              rightSection={
                <View className="flex flex-row items-center gap-2">
                  <Text className="text-muted-foreground uppercase">{auto ? 'On' : 'Off'}</Text>
                  <IconChevronRight className="h-6 w-6 text-foreground" />
                </View>
              }
              iconClassName="bg-cyan-200 dark:bg-cyan-700"
            />
          </SettingCardGroup>
        )}
        <SettingCardGroup title={t('group.common')}>
          <SettingCard
            className="border-b border-background dark:border-muted"
            onPress={() => router.push('/data/export')}
            title={t('card.export.title')}
            icon={IconFileExport}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-stone-200 dark:bg-stone-700"
          />
          <SettingCard
            onPress={() => router.push('/data/import')}
            title={t('card.import.title')}
            icon={IconFileImport}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-stone-200 dark:bg-stone-700"
          />
        </SettingCardGroup>
        <View className="gap-2">
          <Button variant="outline" onPress={onResetPress} disabled={busy}>
            <IconTrash className="h-5 w-5 text-red-500" />
            <Text className="text-red-500">{t('removeData')}</Text>
          </Button>
          <Text className="text-sm text-muted-foreground">{t('removeDataDesc')}</Text>
        </View>
      </ScrollView>
    </ScreenContent>
  )
}
