import {View} from 'react-native'
import {Skeleton} from '@shared/ui/skeleton'

export function ListSkeleton() {
  return (
    <>
      <View className="mt-3 mb-3 flex-row items-center gap-4 px-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-4 w-[40%] rounded-full" />
      </View>
      <View className="mt-3 mb-3 flex-row items-center gap-5 px-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-4 w-[50%] rounded-full" />
      </View>
      <View className="mt-3 mb-3 flex-row items-center gap-5 px-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-4 w-[30%] rounded-full" />
      </View>
    </>
  )
}
