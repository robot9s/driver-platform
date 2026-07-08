import {ScrollView} from 'react-native'
import {CreateAccountForm} from '@features/create-account'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'

export default function CreateAccountScreen() {
  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-4 p-6"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
      >
        <CreateAccountForm />
      </ScrollView>
    </ScreenContent>
  )
}
