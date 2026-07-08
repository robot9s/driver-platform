import type {icons} from '@tabler/icons-react-native'

export const WALLET_ICONS = [
  'IconWallet',
  'IconBrandVisa',
  'IconBrandMastercard',
  'IconBrandAlipay',
  'IconBrandPaypal',
  'IconCreditCard',
  'IconCurrencyEuro',
  'IconCurrencyDollar',
  'IconUser',
  'IconArrowBigUpLine',
  'IconCash',
  'IconCashBanknote',
  'IconGift',
  'IconBasket',
  'IconHome',
  'IconCar',
  'IconShoppingCart',
  'IconAirTrafficControl',
] as const satisfies (keyof typeof icons)[]
