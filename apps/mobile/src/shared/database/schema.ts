import {appSchema, tableSchema} from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'transactions',
      columns: [
        {name: 'type', type: 'string'},
        {name: 'amount', type: 'number'},
        {name: 'categoryId', type: 'string'},
        {name: 'accountId', type: 'string'},
        {name: 'datetime', type: 'string'},
        {name: 'description', type: 'string', isOptional: true},
        {name: 'createdAt', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'accounts',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'icon', type: 'string'},
        {name: 'currencyId', type: 'string'},
        {name: 'initialBalance', type: 'number', isOptional: true},
        {name: 'createdAt', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'currencies',
      columns: [
        {name: 'currency', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'symbol', type: 'string'},
        {name: 'symbolPosition', type: 'string'}, // 'left'|'right'
        {name: 'color', type: 'string'},
        {name: 'createdAt', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'icon', type: 'string'},
        {name: 'parentId', type: 'string', isOptional: true},
        {name: 'type', type: 'string'}, // 'expense' | 'income'
        {name: 'createdAt', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'budgets',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'period', type: 'string'}, // 'monthly' | 'yearly'
        {name: 'amountLimit', type: 'number'},
        {name: 'icon', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'categoryIds', type: 'string'},
        {name: 'accountId', type: 'string'},
        {name: 'createdAt', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'meta',
      columns: [
        {name: 'key', type: 'string'},
        {name: 'value', type: 'string'},
      ],
    }),
  ],
})
