import type {CreateExpense, CreateIncome} from '@entities/transaction'
import type {CreateTransactionFormData} from './ui/CreateTransactionForm.schema'

export function isExpense(transaction: CreateTransactionFormData): transaction is CreateExpense {
  return transaction.type === 'expense'
}

export function isIncome(transaction: CreateTransactionFormData): transaction is CreateIncome {
  return transaction.type === 'income'
}
