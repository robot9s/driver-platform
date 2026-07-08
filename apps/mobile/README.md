# **Moneyra Template (Pro)**

A production-ready personal finance app template built with **React Native + Expo**, following the exact architecture and UI patterns used in the real Moneyra app.

This template is part of **NativeLaunch Pro** and gives you a complete, modern, and scalable foundation to build your own finance or budgeting application.

---

## **✨ Features**

### **Core**

* 🧮 **Offline-first architecture** (WatermelonDB)
* ☁️ **iCloud backups** (device storage + cloud restore)
* 🔐 **PIN lock screen**
* 🌓 **Light & Dark themes**
* 📍 **Multi-currency support**
* 🌍 **Localization (i18n)**

### **Finance Features**

* 💸 Add & manage **transactions**
* 📂 Categories with icons & colors
* 🏦 Accounts & balances
* 📊 Monthly statistics & charts
* 🔁 Recurring payments
* 🎯 Budgets (monthly & yearly)

### **UI / UX**

* 🪄 Smooth animations (Reanimated)
* 🍎 iOS-native look and feel
* 📱 Onboarding screens
* 🧭 Feature-Sliced Design (clean & scalable)
* 🧩 Shared UI components (dialogs, bottom sheets, charts, loaders)

---

## **🏗️ What's Included**

* Source code of the Moneyra template
* All icons, themes, charts, and animations
* Demo data & mocks
* Ready-to-use paywall
* Offline database with migrations
* Full onboarding flow
* Transaction form with validation
* Category picker with icons
* Clean navigation with expo-router

---

## 📝 Documentation

Full documentation available at:  
📖 https://nativelaunch.dev/docs

---

## **Local Setup**

### **Requirements**

* Node.js 20+
* npm
* Xcode for iOS
* Android Studio for Android

### **1. Install dependencies**

```bash
npm install
```

### **2. Firebase config**

This project uses `@react-native-firebase/app` and `@react-native-firebase/analytics`, so Firebase config files are required for native builds.

The template already includes Firebase config files for quick local startup:

* `google-services.json` for Android
* `GoogleService-Info.plist` for iOS

This is enough to run the app locally. For your actual project, it is recommended to replace these files with your own Firebase app configuration.

Setup guide:
https://nativelaunch.dev/docs/analytics/overview

### **3. Generate native projects**

```bash
npm run prebuild
```

### **4. Run the app**

Android:

```bash
npm run android
```

iOS:

```bash
npm run ios
```

### **Notes**

* If you change Expo config or native plugins, run `npm run prebuild` again.
* Replace the included Firebase config files before shipping your own production app.

---

## 🙌 Support

Having issues or questions?  
Reach out via [jonypopovv@gmail.com](mailto:jonypopovv@gmail.com)
