import {useState} from 'react'
import {View} from 'react-native'
import {useTranslation} from '@shared/i18n'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@shared/ui/tabs'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {ExpenseCategoriesTabPanel} from './ExpenseCategoriesTabPanel'
import {HeaderRight} from './HeaderRight'
import {IncomeCategoriesTabPanel} from './IncomeCategoriesTabPanel'

export default function CategoriesScreen() {
  const {t} = useTranslation('CategoriesScreen')
  const [value, setValue] = useState('expense')

  return (
    <ScreenContent
      excludeEdges={['top', 'bottom']}
      navigationOptions={{
        headerRight: () => <HeaderRight />,
      }}
    >
      <View className="flex-1 p-3">
        <Tabs value={value} onValueChange={(v) => setValue(v)} className="flex-1 w-full gap-1.5">
          <TabsList>
            <TabsTrigger value="expense">
              <Text>{t('expense')}</Text>
            </TabsTrigger>
            <TabsTrigger value="income">
              <Text>{t('income')}</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expense" className="flex-1">
            <ExpenseCategoriesTabPanel />
          </TabsContent>
          <TabsContent value="income" className="flex-1">
            <IncomeCategoriesTabPanel />
          </TabsContent>
        </Tabs>
      </View>
    </ScreenContent>
  )
}
