---
title: "Scheduled Notifications"
source: https://nativelaunch.dev/docs/notifications/scheduled-notifications
fetched: 2026-07-07
---

# Scheduled Notifications

Scheduled notifications run **entirely on the device**. They are useful for reminders, daily prompts, or recurring events. We use [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) for local scheduling.

## Built-in switcher

In the template, there is already a **settings switcher** that:

-   Requests permission for push notifications
-   Automatically enables a local scheduled notification

This is the **simplest way to test push notifications** without needing any external service.

![Push notification expo react native](https://nativelaunch.dev/_next/image?url=%2Fdocs%2Fnotifications%2Fnotifications_local.webp&w=3840&q=75)

## Customization

In this template we already provide a hook `useScheduleNotification`. You can easily change:

-   **Time** → adjust `hour` and `minute`
-   **Message** → update `title` and `body`
-   **Action** → pass your own `url` or data payload

This way, you don’t need to re-implement scheduling logic — just configure it for your app’s needs.

### Example: daily reminder at 6pm

```
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

async function scheduleDailyReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily reminder',
      body: 'Time to enter your notes!',
      data: { url: '/notes/new' },
    },
    trigger: {
      hour: 18,
      minute: 0,
      repeats: true,
      channelId: Platform.OS === 'android' ? 'reminders' : undefined,
    },
  });
}
```

## Notes

-   Local notifications only work if the app is installed and permissions are granted.
-   They are **not delivered from the cloud**.
-   Good for personal reminders, not for system‑wide announcements.
