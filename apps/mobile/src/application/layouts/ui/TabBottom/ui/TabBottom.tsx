import {IconHome, IconSettings} from '@tabler/icons-react-native'
import {rem} from 'nativewind'
import {useEffect} from 'react'
import {Pressable, View, useWindowDimensions, type PressableProps} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import {useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'
import type {Icon} from '@tabler/icons-react-native'
import type {BottomTabBarProps} from 'expo-router/build/react-navigation/bottom-tabs'

export function TabBottom({state, descriptors, navigation}: BottomTabBarProps) {
  const {width} = useWindowDimensions()
  const tabs = state.routes.length
  const tabIndex = useSharedValue(state.index)

  const contentW = tabs * ITEM_W + (tabs - 1) * GAP
  const containerW = contentW + PAD_X * 2

  const side = Math.min(Math.max(width * 0.04, 8), 24)
  const maxW = width - side * 2
  const finalW = Math.min(containerW, maxW) + 10

  const indicatorStyle = useAnimatedStyle(() => {
    const indicatorW = ITEM_W + INDICATOR_PADDING * 2
    const x = tabIndex.value * (ITEM_W + GAP) - INDICATOR_PADDING
    return {
      width: indicatorW,
      transform: [{translateX: x}],
    }
  })

  useEffect(() => {
    tabIndex.value = withTiming(state.index, {duration: 200})
  }, [state.index])

  return (
    <View
      style={{width: finalW}}
      className="absolute bottom-6 self-center rounded-[40px] border border-border bg-background p-2"
    >
      <View className="mx-auto flex-row items-center gap-4">
        <Animated.View
          pointerEvents="none"
          style={indicatorStyle}
          className="absolute h-16 rounded-full bg-primary/20"
        />
        {state.routes.map((route, index) => {
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            }) as {defaultPrevented?: boolean}

            if (state.index !== index && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <TabBarItem
              key={route.key}
              icon={TAB_BAR_ICONS[route.name as keyof typeof TAB_BAR_ICONS]}
              name={route.name}
              focused={state.index === index}
              descriptor={descriptors[route.key]}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          )
        })}
      </View>
    </View>
  )
}

// PARTS

const ITEM_W = 5.25 * rem.get() // w-20 = 5rem
const GAP = 1 * rem.get() // gap-4 = 1rem
const PAD_X = 0.5 * rem.get() // p-2  = 0.5rem
const INDICATOR_PADDING = 7 // ←  7px

const TAB_BAR_ICONS = {
  index: IconHome,
  settings: IconSettings,
}

function TabBarItem({
  icon: IconComp,
  name,
  focused,
  descriptor,
  ...props
}: TabBarItemProps & PressableProps) {
  const {t} = useTranslation('TabBottom[Item]')
  const {options} = descriptor
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? {selected: true} : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      style={{width: ITEM_W}}
      className="h-14 items-center justify-center gap-1"
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      {...props}
    >
      <IconComp className={cn('size-8', focused ? 'text-primary' : 'text-muted-foreground/60')} />
      <Text
        className={cn('font-medium text-xs', focused ? 'text-primary' : 'text-muted-foreground/60')}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {t(name)}
      </Text>
    </Pressable>
  )
}

// TYPES

type TabBarItemProps = {
  focused: boolean
  icon: Icon
  name: string
  descriptor: BottomTabBarProps['descriptors'][string]
}

// TRANSLATIONS

// t('index')
// t('settings')
