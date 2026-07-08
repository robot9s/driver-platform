import {View} from 'react-native'
import Animated, {useAnimatedStyle, interpolate, Extrapolation} from 'react-native-reanimated'
import {useColorScheme} from '@shared/lib/theme'
import {Text} from '@shared/ui/text'
import type {DataItem} from './WelcomeScreen'
import type {SharedValue} from 'react-native-reanimated'

const SlideWelcome = ({item, index, width, x}: SlideWelcomeProps) => {
  const {colorScheme} = useColorScheme()

  const imageAnimationStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0, 1, 0],
      Extrapolation.CLAMP
    )

    return {
      opacity: opacityAnimation,
      width: width * 0.9,
      height: width * 1.03,
    }
  })

  const textAnimationStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0, 1, 0],
      Extrapolation.CLAMP
    )

    return {
      opacity: opacityAnimation,
    }
  })

  return (
    <View className="flex-1 items-center pt-4" style={[{width: width}]}>
      <Animated.View style={imageAnimationStyle} className="overflow-hidden items-center sm:pt-16">
        <Animated.Image
          source={colorScheme === 'dark' ? item.image : item.imageLight}
          style={{width: width * 0.9, height: 450}}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View
        style={textAnimationStyle}
        className="flex-1 items-center gap-4 pt-12 px-6 sm:-mt-16"
      >
        <Text className="text-[25px] text-center text-foreground">{item.title}</Text>
        <Text className="text-lg text-center leading-7 text-muted-foreground">{item.text}</Text>
      </Animated.View>
    </View>
  )
}

export default SlideWelcome

// TYPES

type SlideWelcomeProps = {
  item: DataItem
  index: number
  width: number
  x: SharedValue<number>
}
