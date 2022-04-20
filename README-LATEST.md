## Requirements
1. NodeJs
2. Java JDK
3. Cordova CLI
4. Ionic CLI
5. Android SDK / Android studio
6. Xcode (for iOS)
7. for iOS make sure you have cocoapods installed
8. `native-run` package (optional)

## Setup
Make sure you have installed all requirement needed on your machine

in order cordova to work with android (build/run) we need to setup system env variable inside `.zshrc` (if youre using zsh like me :p) or `.bashrc`, heres my variable (macOS)

```
# JAVA
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_321.jdk/Contents/Home
export PATH=${JAVA_HOME}/bin:$PATH
# Set Android_HOME
export ANDROID_HOME=~/Library/Android/sdk
export ANDROID_SDK_ROOT=~/Library/Android/sdk
# Add the Android SDK to the ANDROID_HOME variable
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_SDK_ROOT/platform-tools:$PATH
export PATH=$ANDROID_SDK_ROOT/tools:$PATH
#Set GRADLE_HOME
export GRADLE_HOME=/usr/local/Cellar/gradle/7.4
export PATH=$PATH:$GRADLE_HOME/bin
#GEM
export GEM_HOME=~/.gem
export PATH=$GEM_HOME/bin:$PATH
```

for some reason gradle (built it from android studio) cannot read it by cordova-cli, so in that case we need to install them separately, for my case i used brew to install gradle
`brew install gradle`

and add the gradle path to system variable (see example above)


## Verify you machine
ionic-cli
```
ionic -v
6.18.1
```
cordova-cli
```
cordova -v
11.0.0
```

## THE REAL DEAL

1. nvm use
2. npm install (do not use yarn)
3. ionic cordova prepare
4. try build android `ionic cordova build android`
5. try build ios `ionic cordova build ios`
6. if theres no error when build you're good to go

## Issues
1. `Installed Build Tools revision 33.0.0-rc2 is corrupted`

    navigate to android sdk build tool dir, for my case
    cd `Library/Android/sdk/build-tools/33.0.0-rc2`
    `cp d8 dx`
    cd `lib`
    `cp d8.jar dx.jar`