import {ScrollView} from 'react-native'
import {CreateBudgetForm} from '@widgets/budget'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'

export default function CreateBudgetScreen() {
  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="flex flex-1 gap-4 py-3 px-6"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <CreateBudgetForm />
      </ScrollView>
    </ScreenContent>
  )
}
