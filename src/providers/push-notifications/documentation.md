## Push-Notifications

### Configuration

 - add `google-services.json` to `root-folder`

### Send notification

 - `POST` to `https://fcm.googleapis.com/fcm/send`
 - Set the following header:
   - Content-Type: application/json
   - Authorization: key=AAAAinFTu0Axxxxxxxxxxxxxxxxxxxxxxxxx
 - body: 
  ```javascript
{
  "notification": {
    "title": "Title",
    "body": "Body",
    "sound": "default",
    "click_action": "FCM_PLUGIN_ACTIVITY",
    "icon": "fcm_push_icon",
    "subtitle": "subtitle"
  },
  "data": {
    "title": "Title",
    "body": "Body",
    "topic": "normal"
  },
  "to":"/topics/normal",
  "priority": "high",
  "restricted_package_name": ""
}
//sound: optional field if you want sound with the notification
//click_action: must be present with the specified value for Android
//icon: white icon resource name for Android >5.0
//data: put any "param":"value" and retreive them in the JavaScript notification callback
//to: device token or /topic/topicExample
//priority: must be set to "high" for delivering notifications on closed iOS apps
//restricted_package_name: optional field if you want to send only to a restricted app package (i.e: com.myapp.test)
```
 - full documentation: https://firebase.google.com/docs/cloud-messaging/http-server-ref

