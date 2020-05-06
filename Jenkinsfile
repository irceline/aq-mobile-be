pipeline {
  agent any

   stages {


   stage('Check config') {
      steps {
         sh 'export ANDROID_HOME = /etc/android'
         sh 'echo $ANDROID_HOME'
      }
   }

   stage('Build') {
      steps {
         sh 'npm i -f'
      }
   }

   stage('Android Build') {
   steps {
      sh 'ionic cordova build android --release'
   }
  }
 }
}
