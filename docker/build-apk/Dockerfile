FROM nebulaesoftware/belair-2.0

RUN ionic cordova platform add android@^9.1.0
COPY build.gradle /app/platforms/android/build.gradle
RUN ionic cordova build android android
