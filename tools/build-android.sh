rm -rf platforms

# cd /opt/android-sdk/build-tools/31.0.0 && mv d8 dx && cd lib && mv d8.jar dx.jar

docker run -it --rm \
  -v $PWD:/project \
  -v belair_gradle:/tmp/.gradle:rw -v belair_node_modules:/project/node_modules:rw \
  -e CI=true \
  igez/ionic-android-build-box \
  bash -c "export PATH=/root/.jenv/shims:\$PATH && jenv local 1.8 && JAVA_HOME=\$HOME/.jenv/versions/1.8 && echo \$JAVA_HOME && java -version && cd /project && npm i && ionic cordova platform add android && cd /opt/android-sdk/build-tools/31.0.0 && mv d8 dx && cd lib && mv d8.jar dx.jar && cd /project && ionic cordova build android --prod --release -- -- --packageType=bundle && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore irceline2018.keystore /project/platforms/android/app/build/outputs/bundle/release/app-release.aab irceline_2018_android -storepass \$KEYSTORE_PASSWORD"