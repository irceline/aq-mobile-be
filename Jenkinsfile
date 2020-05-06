pipeline {
  agent any

   stages {

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
