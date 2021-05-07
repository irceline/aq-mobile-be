FROM datencia/ionic-android

ARG VERSION_CODE=1

# RUN ln -s /opt/android-sdk-linux/build-tools/30.0.3/zipalign /usr/local/bin/zipalign
# RUN chmod +x /usr/local/bin/zipalign

COPY ././. /app

WORKDIR /app

RUN npm i
RUN node tools/bump_version.js $VERSION_CODE
RUN ionic cordova platform add android
RUN ionic cordova build android
RUN cd platforms/android && ./gradlew bundleRelease

RUN chmod -R 755 /app/platforms

USER root