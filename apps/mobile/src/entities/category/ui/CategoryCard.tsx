import {useRouter} from 'expo-router'
import {Pressable, View} from 'react-native'
import {colorsPrimary} from '@shared/config/colors'
import {useColorScheme} from '@shared/lib/theme'
import {Text} from '@shared/ui/text'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import type {CategoryType, ExpenseCategory, IncomeCategory} from '../model/models'

export const CategoryCard = ({category, type, className}: CategoryCardProps) => {
  const {icon, title, color} = category
  const router = useRouter()
  const {colorScheme} = useColorScheme()

  return (
    <Pressable
      onPress={() => router.push(`/categories/${type}/${category.id}`)}
      className={className}
    >
      <View className="flex-row items-center gap-2">
        <View className="flex items-center justify-center rounded-lg h-10 w-10">
          <GenericIcon
            name={icon}
            className="h-7 w-7 text-foreground"
            color={colorsPrimary[color][colorScheme]}
          />
        </View>
        <Text className="flex-shrink" numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </Pressable>
  )
}

// TYPES

interface CategoryCardProps {
  category: CategoryCardCategory
  type: CategoryType
  className?: string
}

export type CategoryCardCategory = Omit<IncomeCategory | ExpenseCategory, 'createdAt'>
