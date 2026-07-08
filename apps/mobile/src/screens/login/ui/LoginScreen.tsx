import {useRouter} from 'expo-router'
import {useState} from 'react'
import {View} from 'react-native'
import {authClient} from '@shared/api'
import {useTranslation} from '@shared/i18n'
import {Button} from '@shared/ui/button'
import {Input} from '@shared/ui/input'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'

export default function LoginScreen() {
  const {t} = useTranslation('LoginScreen')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)
    const result = await authClient.signIn.email({
      email: email.trim(),
      password,
    })
    setIsSubmitting(false)

    if (result.error) {
      setError(t('error.invalidCredentials'))
      return
    }

    router.replace('/(app)/(tabs)')
  }

  return (
    <ScreenContent backgroundColor="bg-background">
      <View className="flex-1 justify-center gap-6 px-6">
        <View className="gap-2">
          <Text className="text-3xl font-semibold">{t('title')}</Text>
          <Text className="text-base text-muted-foreground">{t('subtitle')}</Text>
        </View>
        <View className="gap-4">
          <View className="gap-1.5">
            <Text className="text-sm text-muted-foreground">{t('emailLabel')}</Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder={t('emailPlaceholder')}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
          </View>
          <View className="gap-1.5">
            <Text className="text-sm text-muted-foreground">{t('passwordLabel')}</Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder={t('passwordPlaceholder')}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              onSubmitEditing={() => canSubmit && handleSubmit()}
            />
          </View>
          {error && <Text className="text-sm text-destructive">{error}</Text>}
          <Button onPress={handleSubmit} disabled={!canSubmit}>
            <Text>{isSubmitting ? t('submitting') : t('submit')}</Text>
          </Button>
        </View>
      </View>
    </ScreenContent>
  )
}
