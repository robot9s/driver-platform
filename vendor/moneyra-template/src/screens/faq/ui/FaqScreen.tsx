import {ScrollView, View} from 'react-native'
import {useTranslation} from '@shared/i18n'

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@shared/ui/accordion'
import {Text} from '@shared/ui/text'

export default function FaqScreen() {
  const {t} = useTranslation('FaqScreen')

  return (
    <ScrollView className="bg-background" contentContainerClassName="px-6 py-3">
      <View>
        <Accordion type="multiple" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Text>{t('itemQuestion1')}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>{t('itemAnswer1')}</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Text>{t('itemQuestion2')}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>{t('itemAnswer2')}</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <Text>{t('itemQuestion3')}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>{t('itemAnswer3')}</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <Text>{t('itemQuestion4')}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>{t('itemAnswer4')}</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <Text>{t('itemQuestion5')}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>{t('itemAnswer5')}</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              <Text>{t('itemQuestion6')}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>{t('itemAnswer6')}</Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    </ScrollView>
  )
}
