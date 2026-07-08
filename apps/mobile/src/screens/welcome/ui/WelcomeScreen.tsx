import {memo} from 'react'
import {View, useWindowDimensions} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated'
import {useTranslation} from '@shared/i18n'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import BgLinearGradient from './BgLinearGradient'
import CustomButton from './CustomButton'
import Pagination from './Pagination'
import SlideWelcome from './Slide'
import type {ViewToken, ImageRequireSource} from 'react-native'

const WelcomeScreen = memo(function WelcomeScreen() {
  const {t} = useTranslation('WelcomeScreen')
  const {width: SCREEN_WIDTH} = useWindowDimensions()
  const flatListRef = useAnimatedRef<Animated.FlatList<DataItem>>()
  const x = useSharedValue(0)
  const flatListIndex = useSharedValue(0)

  const slideWidth =
    SCREEN_WIDTH > 600 ? Math.min(Math.round(SCREEN_WIDTH * 0.75), 640) : SCREEN_WIDTH

  const onViewableItemsChanged = ({viewableItems}: {viewableItems: ViewToken[]}) => {
    flatListIndex.value = viewableItems[0]?.index ?? 0
  }

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x
    },
  })

  const data: DataItem[] = [
    {
      id: 1,
      image: require('@assets/images/onboarding/onboarding1.webp'),
      imageLight: require('@assets/images/onboarding/onboarding1-light.webp'),
      title: t('slide1.title'),
      text: t('slide1.text'),
    },
    {
      id: 2,
      image: require('@assets/images/onboarding/onboarding2.webp'),
      imageLight: require('@assets/images/onboarding/onboarding2-light.webp'),
      title: t('slide2.title'),
      text: t('slide2.text'),
    },
    {
      id: 3,
      image: require('@assets/images/onboarding/onboarding3.webp'),
      imageLight: require('@assets/images/onboarding/onboarding3-light.webp'),
      title: t('slide3.title'),
      text: t('slide3.desc'),
    },
  ]

  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <BgLinearGradient />
      <View
        className="flex-1 pt-24 pb-9 mx-auto justify-center items-center"
        style={{width: slideWidth}}
      >
        <Text className="italic text-3xl">Moneyra</Text>
        <Animated.FlatList
          ref={flatListRef}
          onScroll={onScroll}
          data={data}
          renderItem={({item, index}) => (
            <SlideWelcome item={item} index={index} width={slideWidth} x={x} />
          )}
          scrollEventThrottle={16}
          horizontal={true}
          bounces={false}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            minimumViewTime: 300,
            viewAreaCoveragePercentThreshold: 10,
          }}
        />
        <View className="justify-between mx-6 pb-6">
          <Pagination data={data} x={x} screenWidth={slideWidth} />
          <CustomButton
            flatListRef={flatListRef}
            flatListIndex={flatListIndex}
            dataLength={data.length}
          />
        </View>
      </View>
    </ScreenContent>
  )
})

export default WelcomeScreen

// TYPES

export type DataItem = {
  id: number
  image: ImageRequireSource
  imageLight: ImageRequireSource
  title: string
  text: string
}
