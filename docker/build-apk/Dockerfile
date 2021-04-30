FROM nebulaesoftware/belair-2.0

ARG KEYSTORE_PASSWORD
ARG KEYSTORE_ALIAS
ARG KEYSTORE_NAME=irceline2018.keystore

RUN ionic cordova platform add android@^9.1.0

COPY build.gradle /app/platforms/android/build.gradle

RUN ionic cordova build android --prod --release -- --packageType=bundle

RUN jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore irceline2018.keystore /app/platforms/android/app/build/outputs/bundle/release/app-release.aab ${KEYSTORE_ALIAS} -storepass ${KEYSTORE_PASSWORD}
