FROM datencia/ionic-android

WORKDIR /app

RUN npm i
RUN ionic cordova platform add android
RUN ionic cordova build android
RUN cd platforms/android && ./gradlew bundle
RUN jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore irceline2018.keystore platforms/android/app/build/outputs/bundle/release/app-release.aab irceline_2018_android