import {createContext, useContext} from 'react'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'
import type {RefObject} from 'react'

export enum AppSheet {
  BUDGET_LEFT_INFO = 'budget-left-info',
}

export type SheetProvider = Record<AppSheet, RefObject<BottomSheetModal | null>>

const SheetContext = createContext<SheetProvider | null>(null)

export function useSheet() {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error('useSheet must be used within a <SheetProvider />')
  }
  return context
}

export default SheetContext
