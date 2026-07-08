import {IconArrowRight} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {Pressable} from 'react-native'
import Animated, {useAnimatedStyle, withSpring, withTiming} from 'react-native-reanimated'
import {useTranslation} from '@shared/i18n'
import {
  constantStorage,
  STORAGE_CONSTANT_IS_USER_ONBOARDED,
} from '@shared/storage/contstant-storage'
import type {DataItem} from './WelcomeScreen'
import type {SharedValue, AnimatedRef} from 'react-native-reanimated'

const CustomButton = ({flatListRef, flatListIndex, dataLength}: CustomButtonProps) => {
  const {t} = useTranslation('CustomButton')
  const router = useRouter()

  const buttonAnimationStyle = useAnimatedStyle(() => ({
    width: withSpring(240),
    height: 60,
  }))

  const arrowAnimationStyle = useAnimatedStyle(() => ({
    opacity: flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
    transform: [
      {
        translateX: flatListIndex.value === dataLength - 1 ? withTiming(100) : withTiming(0),
      },
    ],
  }))

  const textAnimationStyle = useAnimatedStyle(() => ({
    opacity: flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
    transform: [
      {
        translateX: flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(-100),
      },
    ],
  }))

  const handlePress = async () => {
    if (flatListIndex.value < dataLength - 1) {
      flatListRef.current?.scrollToIndex({index: flatListIndex.value + 1})
    } else {
      constantStorage.setBoolean(STORAGE_CONSTANT_IS_USER_ONBOARDED, true)
      router.navigate('/(app)/(tabs)')
    }
  }

  return (
    <Pressable hitSlop={12} onPress={handlePress}>
      <Animated.View
        style={[buttonAnimationStyle]}
        className="bg-secondary p-3 rounded-full justify-center items-center overflow-hidden"
      >
        <Animated.Text
          className="text-lg absolute text-primary font-regular"
          style={[textAnimationStyle]}
        >
          {t('getStarted')}
        </Animated.Text>
        <Animated.View style={[arrowAnimationStyle]} className="flex-row items-center gap-2">
          <Animated.Text className="text-foreground">{t('next')}</Animated.Text>
          <IconArrowRight className="size-8 text-foreground" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  )
}

export default CustomButton

// TYPES

type CustomButtonProps = {
  flatListRef: AnimatedRef<Animated.FlatList<DataItem>>
  flatListIndex: SharedValue<number>
  dataLength: number
}
