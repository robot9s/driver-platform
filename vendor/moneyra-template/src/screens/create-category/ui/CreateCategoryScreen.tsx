import {useLocalSearchParams} from 'expo-router'
import {ScrollView} from 'react-native'
import {CreateCategoryForm} from '@features/create-category'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'

export default function CreateCategoryScreen() {
  const local = useLocalSearchParams()
  const parentId = String(local.parentId)

  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <ScrollView
        className="bg-background px-6 py-3"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <CreateCategoryForm parentId={parentId} />
      </ScrollView>
    </ScreenContent>
  )
}
