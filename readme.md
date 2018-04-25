# aq-mobile-be
This repository contains an [Ionic](https://ionicframework.com/getting-started) app for exploring air quality data using elements from the [Helgoland](https://github.com/52North/helgoland) viewer. [Helgoland](https://github.com/52North/helgoland) is a lightweight web application for exploring Sensor Web Data from the [52°North](https://52north.org/) SWE-suite.

Getting started:
```sh
git clone https://github.com/irceline/aq-mobile-be.git

cd aq-mobile-be
npm install
npm start
```
A local webserver should be launched on port `8100`:

* http://localhost:8100/


## build quirks

 * conflict between the plugins `cordova-plugin-mauron85-background-geolocation` and `cordova-plugin-fcm`
    * Change in platforms/android/cordova-plugin-fcm/*-FCMPlugin.gradle `com.google.gms:google-services:3.0.0` to `com.google.gms:google-services:+`
    * Build with `ionic cordova build android` and you will get a version error response.
    * Change platforms/android/project.properties with your version from above output, version must be the same:
        ```
        com.google.firebase:firebase-core:xx.xx.xx
        com.google.firebase:firebase-messaging:xx.xx.xx
        com.google.android.gms:play-services-location:xx.xx.xx
        ```
    * Build again with `ionic cordova build android`
