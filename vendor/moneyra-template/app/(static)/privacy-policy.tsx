import * as Linking from 'expo-linking'
import {ScrollView} from 'react-native'
import {Separator} from '@shared/ui/separator'
import {Text} from '@shared/ui/text'

export default function PrivacyScreen() {
  return (
    <ScrollView className="bg-background" contentContainerClassName="px-6 py-3 gap-2">
      <Text className="font-semiBold text-xl">Privacy Policy</Text>
      <Text>
        Moneyra is a fully offline personal finance app. We do not collect, store, or transmit any
        personal data to our servers or third parties.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">How Data Is Handled</Text>
      <Text>
        All information you enter — such as expenses, categories, or budgets — stays entirely on
        your device. It is never uploaded or shared. If you use iCloud backups, your system manages
        them privately under your Apple account.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">No Accounts or Tracking</Text>
      <Text>
        Moneyra does not require registration, login, or internet access. We do not use analytics,
        tracking, or advertising SDKs.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">Security</Text>
      <Text>
        Your data is stored locally within the app’s secure storage on your device. You have full
        control over it and can delete it at any time by removing the app.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">Contact</Text>
      <Text>If you have questions about privacy, contact:</Text>
      <Text>
        Email:{' '}
        <Text
          className="text-blue-600"
          onPress={() => Linking.openURL('mailto:jonypopovv@gmail.com')}
        >
          jonypopovv@gmail.com
        </Text>
      </Text>

      <Separator className="mx-auto my-3 w-[70%]" />
      <Text className="text-center text-muted-foreground">Last updated: 10/8/2025</Text>
    </ScrollView>
  )
}
