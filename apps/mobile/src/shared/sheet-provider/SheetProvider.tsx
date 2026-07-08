import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import React from 'react'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import SheetContext from './context'
import type {SheetProvider as ProviderType} from './context'
import type {FC} from 'react'

interface SheetProviderProps {
  children: React.ReactNode
}

export const SheetProvider: FC<SheetProviderProps> = ({children}) => {
  const initialSheetContext: ProviderType = {}

  return (
    <SheetContext.Provider value={initialSheetContext}>
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SheetContext.Provider>
  )
}
