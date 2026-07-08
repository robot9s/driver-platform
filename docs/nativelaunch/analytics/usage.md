---
title: "Usage"
source: https://nativelaunch.dev/docs/analytics/usage
fetched: 2026-07-07
---

# Usage

Analytics offers a wealth of Predefined Events to track user behavior. Analytics also offers folks the ability to log Custom Events. If you're already familiar with Google Analytics, this method is equivalent to using the event command in gtag.js.

### Predefined Events

To help you get started, Analytics provides a number of [event methods](https://rnfirebase.io/reference/analytics) that are common among different types of apps, including retail and e-commerce, travel, and gaming apps. To learn more about these events and when to use them, browse the [Events and properties](https://support.google.com/analytics/answer/9322688?hl=en&ref_topic=9267641) articles in the Firebase Help Center.

Below is a sample of how to use one of the predefined methods the Analytics module provides for you:

```
import react, {useEffect} from 'react'
import {View, Button} from 'react-native'
import analytics from '@react-native-firebase/analytics'

function App() {
  return (
    <View>
      <Button
        title="Press me"
        // Logs in the firebase analytics console as "select_content" event
        // only accepts the two object properties which accept strings.
        onPress={async () =>
          await analytics().logSelectContent({
            content_type: 'clothing',
            item_id: 'abcd',
          })
        }
      />
    </View>
  )
}
```

For a full reference to predefined events and expected parameters, please check out the reference API.

### Custom Events

Below is an example showing how a custom event can be logged. Please be aware that primitive data types or arrays of primitive data types are logged in your Firebase Analytics console.

```
await firebaseAnalytics.logEvent('note_created', {
  note_id: data.id,
  note_date: data.created_at,
})
```

* * *

[

### Google analytics usage

rnfirebase.io/analytics/usage



](https://rnfirebase.io/analytics/usage)
