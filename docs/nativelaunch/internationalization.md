---
title: "Internationalization"
source: https://nativelaunch.dev/docs/internationalization
fetched: 2026-07-07
---

# Internationalization

Support multiple languages in your app with full internationalization (i18n) support. This guide walks you through setting up multilingual support using `react-i18next` in an Expo app.

## Step 1: Configuration

Update configuration file to support multiple languages in your app.

Update your `i18n.ts` configuration to support multiple languages:

src/shared/i18n/i18n.ts

```
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: LanguageList.EN,
    defaultNS: 'translations',
    resources: {
      en: {translations: en},
      ru: {translations: ru},
      es: {translations: es},
      pt: {translations: pt},
      de: {translations: de},
      fr: {translations: fr},
    },
    interpolation: {
      escapeValue: false,
    },
  })
```

Set the default language based on the device locale:

src/shared/i18n/LanguageProvider.tsx

```
const deviceLanguage = getLocales()[0]?.languageCode ?? LanguageList.EN
const defaultLanguage = ['en', 'ru', 'es', 'de', 'pt', 'fr'].includes(deviceLanguage)
  ? (deviceLanguage as LanguageType)
  : LanguageList.EN
```

## Step 2: Create or update Translation Files

Create translation JSON files in a locales directory (or any other directory you prefer). For example:

```
./src/shared/assets/locales/en.json
./src/shared/assets/locales/es.json
```

Example translation.json (English):

src/shared/assets/locales/en.json

```
{
  "welcome": "Welcome to our app!",
  "login": "Login"
}
```

Import the translation files in your configuration file:

![Import translations](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flocalize-2.2btmz381wlm9c.webp&w=3840&q=75)

## Step 3: Use Translations in Your Components

Use the useTranslation hook from react-i18next to access translations:

Use the `useTranslation` hook to load text dynamically:

AuthLocal.tsx

```
import { useTranslation } from '@shared/i18n'

const AuthLocal = () => {
  const { t } = useTranslation('AuthLocal);
  return <Text>{t('welcome')}</Text>;
};
```

## Step 4: Extract Translations Automatically

Use `i18next-scanner` to extract translation keys from your codebase.

i18next-scanner.config.ts

```
const i18nextScannerConfig = {
  input: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}', '!**/node_modules/**'],
  output: './',
  options: {
    removeUnusedKeys: true,
    sort: true,
    attr: false,
    func: {
      list: ['t'],
    },
    trans: false,
    lngs: ['en', 'ru', 'es', 'de', 'pt', 'fr'],
    fallbackLng: defaultLanguage,
    defaultLng: defaultLanguage,
    defaultValue: customDefaultName,
    resource: {
      loadPath: 'src/shared/assets/locales/{{lng}}.json',
      savePath: 'src/shared/assets/locales/{{lng}}.json',
    },
    keySeparator: false,
  },
  transform: customTransform,
}

module.exports = i18nextScannerConfig
```

Then run the scanner:

```
npx i18next-scanner --config i18next-scanner.config.js
```

![Scanner result](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flocalize-3.0y699wl0mibe7.webp&w=3840&q=75)

* * *

## Resources

[

### Expo Localization

https://docs.expo.dev/versions/latest/sdk/localization

](https://docs.expo.dev/versions/latest/sdk/localization/)[

### react-i18next documentation

https://react.i18next.com

](https://react.i18next.com/)
