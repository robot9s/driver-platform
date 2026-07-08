import {toast} from '@backpackapp-io/react-native-toast'
import {
  IconBook2,
  IconCategory,
  IconChevronRight,
  IconCurrencyDollar,
  IconExternalLink,
  IconInfoCircle,
  IconLayoutDashboard,
  IconListSearch,
  IconLock,
  IconMessage2Share,
  IconNotes,
  IconRefresh,
  IconShare,
  IconWallet,
  IconWorld,
} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {Alert, Linking, ScrollView, Share, View} from 'react-native'
import {AppVersion} from '@widgets/app-version'
import {SettingCard, SettingCardGroup} from '@widgets/settings-card'
import {useUserEntitlements} from '@entities/subscription'
import {useTranslation, useLocale} from '@shared/i18n'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {SettingCardLocalAuth} from './SettingCardLocalAuth'

export default function SettingScreen() {
  const {t} = useTranslation('SettingScreen')
  const router = useRouter()
  const {language} = useLocale()
  const {isPro} = useUserEntitlements()

  async function handleShare() {
    try {
      await Share.share({
        message: t('share'),
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const sendFeedback = () => {
    const email = 'jonypopovv@gmail.com'
    const subject = 'Feedback for the app'
    const body = 'Hi! I wanted to share my feedback...'

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Error', 'Failed to open mail app')
    })
  }

  return (
    <ScreenContent excludeEdges={['top', 'bottom']} backgroundColor="bg-background">
      <ScrollView
        contentContainerClassName="p-4 gap-4 mb-[400px]"
        contentContainerStyle={{paddingBottom: 120}}
      >
        {!isPro && (
          <SettingCard
            className="!px-4 !h-20 border border-amber-600 bg-secondary rounded-lg"
            onPress={() => router.push('/paywall')}
            title={t('card.premium.title')}
            description={t('card.premium.desc')}
            rightSection={<IconLock className="h-6 w-6 text-muted-foreground" />}
            titleClassName="text-xl"
            descClassName="!text-base font-regular text-muted-foreground mt-0"
          />
        )}
        <SettingCardGroup title={t('group.common')}>
          <SettingCard
            className="border-b border-background dark:border-muted"
            onPress={() => router.push('/categories')}
            title={t('card.categories.title')}
            description={t('card.categories.desc')}
            icon={IconCategory}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-orange-200 dark:bg-orange-700"
          />
          <SettingCard
            className="border-b border-background dark:border-muted"
            onPress={() => router.push('/accounts')}
            title={t('card.accounts.title')}
            icon={IconWallet}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-amber-200 dark:bg-amber-700"
          />
          <SettingCard
            className="border-b border-background dark:border-muted"
            onPress={() => router.push('/currencies')}
            title={t('card.currencies.title')}
            icon={IconCurrencyDollar}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-lime-200 dark:bg-lime-700"
          />
          <SettingCard
            onPress={() => router.push('/data')}
            title={t('card.data.title')}
            icon={IconRefresh}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-stone-200 dark:bg-stone-700"
          />
        </SettingCardGroup>
        <SettingCardGroup title={t('group.app')}>
          <SettingCardLocalAuth />
          <SettingCard
            className="border-b border-background dark:border-muted"
            onPress={() => router.push('/appearance')}
            title={t('card.appearance.title')}
            icon={IconLayoutDashboard}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-teal-200 dark:bg-teal-700"
          />
          <SettingCard
            onPress={() => router.push('/language')}
            title={t('card.language.title')}
            icon={IconWorld}
            rightSection={
              <View className="flex flex-row items-center gap-2">
                <Text className="text-muted-foreground uppercase">{language}</Text>
                <IconChevronRight className="h-6 w-6 text-foreground" />
              </View>
            }
            iconClassName="bg-sky-200 dark:bg-sky-700"
          />
        </SettingCardGroup>
        <SettingCardGroup title={t('group.info')}>
          <SettingCard
            className="border-b border-background dark:border-muted"
            onPress={() => Linking.openURL('https://www.moneyra.app/privacy-policy')}
            title={t('card.privacyPolicy.title')}
            icon={IconNotes}
            rightSection={<IconExternalLink className="h-6 w-6 text-foreground" />}
            iconClassName="bg-indigo-200 dark:bg-indigo-700"
          />
          <SettingCard
            className="border-b border-background dark:border-muted"
            onPress={() => Linking.openURL('https://www.moneyra.app/terms-of-service')}
            title={t('card.termsOfUse.title')}
            icon={IconBook2}
            rightSection={<IconExternalLink className="h-6 w-6 text-foreground" />}
            iconClassName="bg-purple-200 dark:bg-purple-700"
          />
          <SettingCard
            onPress={() => router.push('/faq')}
            title={t('card.faq.title')}
            icon={IconListSearch}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-yellow-200 dark:bg-yellow-700"
          />
        </SettingCardGroup>
        {/*prettier-ignore*/}
        <SettingCardGroup title={<>Moneyra, <AppVersion /></>}>
          <SettingCard
            className="border-b border-background dark:border-muted"
            onPress={() => Linking.openURL('https://www.moneyra.app')}
            title={t('card.aboutApp.title')}
            icon={IconInfoCircle}
            rightSection={<IconExternalLink className="h-6 w-6 text-foreground" />}
            iconClassName="bg-pink-200 dark:bg-pink-700"
          />
          <SettingCard
            className="border-b border-background dark:border-muted"
            onPress={sendFeedback}
            title={t('card.feedback.title')}
            icon={IconMessage2Share}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-indigo-200 dark:bg-indigo-700"
          />
          <SettingCard
            onPress={handleShare}
            title={t('card.share.title')}
            icon={IconShare}
            rightSection={<IconChevronRight className="h-6 w-6 text-foreground" />}
            iconClassName="bg-emerald-200 dark:bg-emerald-700"
          />
        </SettingCardGroup>
      </ScrollView>
    </ScreenContent>
  )
}
