export enum Palette {
  Default = 'default',
}

export const themeVariables: Record<
  Palette,
  Record<'light' | 'dark', Partial<Record<ColorKey, string>>>
> = {
  [Palette.Default]: {
    light: {
      '--background': '210 33% 98%',
      '--foreground': '222 15% 15%',
      '--muted': '210 30% 95%',
      '--muted-foreground': '222 8% 45%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '222 15% 15%',
      '--input': '210 20% 92%',
      '--border': '210 20% 90%',
      '--card': '0 0% 100%',
      '--card-foreground': '222 15% 15%',
      '--primary': '183 80% 40%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '220 25% 92%',
      '--secondary-foreground': '222 15% 15%',
      '--accent': '183 65% 45%',
      '--accent-foreground': '0 0% 100%',
      '--destructive': '0 80% 55%',
      '--destructive-foreground': '0 0% 98%',
      '--ring': '183 70% 45%',
    },
    dark: {
      '--background': '220 22% 8%',
      '--foreground': '0 0% 95%',
      '--muted': '220 12% 14%',
      '--muted-foreground': '0 0% 70%',
      '--accent': '183 70% 40%',
      '--accent-foreground': '0 0% 98%',
      '--popover': '220 22% 8%',
      '--popover-foreground': '0 0% 98%',
      '--border': '220 10% 18%',
      '--input': '220 10% 18%',
      '--card': '220 22% 8%',
      '--card-foreground': '0 0% 95%',
      '--primary': '183 75% 45%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '220 15% 18%',
      '--secondary-foreground': '0 0% 95%',
      '--destructive': '0 60% 45%',
      '--destructive-foreground': '0 0% 98%',
      '--ring': '183 75% 45%',
    },
  },
}

// TYPES

export type ColorKey =
  | '--background'
  | '--foreground'
  | '--muted'
  | '--muted-foreground'
  | '--popover'
  | '--popover-foreground'
  | '--input'
  | '--border'
  | '--card'
  | '--card-foreground'
  | '--primary'
  | '--primary-foreground'
  | '--secondary'
  | '--secondary-foreground'
  | '--accent'
  | '--accent-foreground'
  | '--destructive'
  | '--destructive-foreground'
  | '--ring'
