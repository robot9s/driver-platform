import * as Linking from 'expo-linking'
import {ScrollView, View} from 'react-native'
import {Separator} from '@shared/ui/separator'
import {Text} from '@shared/ui/text'

export default function TermsScreen() {
  return (
    <ScrollView className="bg-background" contentContainerClassName="px-6 py-3 gap-2">
      <Text className="font-semiBold text-xl">1. Introduction</Text>
      <Text>
        Welcome to Moneyra. These Terms of Use (“Terms”) govern your use of the Moneyra mobile
        application (“App”), a personal finance tool for recording and analyzing your spending and
        budgets. By using the App, you agree to these Terms. If you do not agree, please do not use
        the App.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">2. Purpose of the App</Text>
      <Text>
        Moneyra helps you record expenses and income, organize categories, set budgets, and review
        analytics. The App is not a banking, payment processing, investment, or financial advisory
        service.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">3. No Registration & Privacy</Text>
      <Text>
        Moneyra does not require account registration and does not request your email or other
        personal identifiers. Data you enter (e.g., transactions, budgets, categories) is stored
        locally on your device. If you enable system backups (e.g., iCloud), they are managed by
        your device provider and are outside our control. For details, see the Privacy Policy.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">4. Your Responsibilities</Text>
      <Text>
        You are responsible for the accuracy and completeness of the data you enter and for keeping
        your device secure (including backups). The App has no social/sharing features—only you
        control your data on your device.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">5. In-App Purchases</Text>
      <Text>Moneyra offers the following paid options managed by Apple’s App Store:</Text>
      <View className="gap-2 px-2">
        <Text>✳︎ Annual subscription (may include a free trial).</Text>
        <Text>✳︎ One-time lifetime purchase.</Text>
      </View>
      <Text>
        Purchases and payments are processed by Apple. Prices and terms are shown at checkout. Any
        refunds are handled by Apple under App Store policies.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">6. Managing Subscriptions</Text>
      <Text>
        Subscriptions renew automatically unless canceled at least 24 hours before the end of the
        current period. You can manage or cancel your subscription in iOS Settings → Apple ID →
        Subscriptions. Deleting the App does not cancel an active subscription.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">7. Third-Party Services (Billing Only)</Text>
      <Text>
        The App uses RevenueCat solely to manage in-app purchases and subscriptions. RevenueCat
        operates with randomly generated identifiers and does not require your email or name.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">8. Data Storage & Deletion</Text>
      <Text>
        Your financial data is stored on your device. You can delete it by removing it in-app or by
        uninstalling the App. Because there is no central account, we cannot restore or delete data
        on your behalf.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">9. Limitation of Liability</Text>
      <Text>
        The App is provided “as is” without warranties of any kind. We are not liable for loss or
        corruption of data, inaccurate reports, device failures, system updates, or other issues.
        Please keep regular device backups to protect your data.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">10. Intellectual Property</Text>
      <Text>
        “Moneyra” and related materials are protected by applicable intellectual property laws. You
        may not use the name or branding without prior written consent.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">11. Changes to the App and Terms</Text>
      <Text>
        We may update the App and these Terms from time to time. Updates will be posted in the App.
        Your continued use after changes means you accept the updated Terms.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">12. Governing Law</Text>
      <Text>
        These Terms are governed by the laws of Ukraine. If a provision is unenforceable under local
        law, the remaining provisions remain in effect.
      </Text>

      <Text className="mt-3 font-semiBold text-xl">13. Contact</Text>
      <Text>Questions or support requests:</Text>
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
