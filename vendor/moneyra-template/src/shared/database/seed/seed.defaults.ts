// eslint-disable-next-line import/no-restricted-paths
import type {CreateExpenseCategory, CreateIncomeCategory} from '@entities/category'
// eslint-disable-next-line import/no-restricted-paths
import type {CreateCurrency} from '@entities/currency'

export const DEFAULT_CURRENCIES: CreateCurrency[] = [
  {
    currency: 'USD',
    name: 'US dollars',
    symbol: '$',
    symbolPosition: 'left',
    color: 'stone',
  },
  {
    currency: 'EUR',
    name: 'Euros',
    symbol: '€',
    symbolPosition: 'left',
    color: 'stone',
  },
  {
    currency: 'CAD',
    name: 'Canadian dollars',
    symbol: 'CA$',
    symbolPosition: 'left',
    color: 'stone',
  },
  {
    currency: 'GBP',
    name: 'British pounds',
    symbol: '£',
    symbolPosition: 'left',
    color: 'stone',
  },
  {
    currency: 'INR',
    name: 'Indian rupees',
    symbol: '₹',
    symbolPosition: 'left',
    color: 'stone',
  },
]

export const DEFAULT_EXPENSE_CATEGORIES: CreateExpenseCategory[] = [
  {title: 'Food', icon: 'IconMeat', color: 'slate'},
  {title: 'House', icon: 'IconSmartHome', color: 'gray'},
  {title: 'Coffee and restaurants', icon: 'IconBottle', color: 'zinc'},
  {title: 'Car', icon: 'IconCar', color: 'stone'},
  {title: 'Entertainment', icon: 'IconMovie', color: 'orange'},
  {title: 'Clothes and shoes', icon: 'IconShoppingBag', color: 'amber'},
  {title: 'Pets', icon: 'IconShoppingBag', color: 'lime'},
  {title: 'Children', icon: 'IconUsers', color: 'green'},
  {title: 'Health', icon: 'IconHeart', color: 'emerald'},
  {title: 'Beauty and care', icon: 'IconStar', color: 'cyan'},
  {title: 'Travel', icon: 'IconAirTrafficControl', color: 'blue'},
  {title: 'Technique', icon: 'IconDeviceLaptop', color: 'indigo'},
  {title: 'Communication services', icon: 'IconPhoneCall', color: 'purple'},
  {title: 'Other', icon: 'IconBasket', color: 'rose'},
]

export const DEFAULT_INCOME_CATEGORIES: CreateIncomeCategory[] = [
  {title: 'Salary', icon: 'IconCashBanknote', color: 'green'},
  {title: 'Part time job', icon: 'IconUser', color: 'yellow'},
  {title: 'Interest on deposits', icon: 'IconCurrencyDollar', color: 'sky'},
  {title: 'Cashback', icon: 'IconCash', color: 'violet'},
  {title: 'Bonus', icon: 'IconGift', color: 'pink'},
]
