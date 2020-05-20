FROM mbursac/belair-2.0

RUN ionic cordova platform add android
COPY build.gradle /app/platforms/android/build.gradle
RUN ionic cordova build android android
