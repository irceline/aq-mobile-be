pipeline {
  agent any

   stages {

   stage('Build') {
      steps {
         sh 'npm i -f'
         sh 'npm i -D -E @angular/cli'
      }
   }

   stage('Android Build') {
   steps {
      sh 'ionic cordova build android --release'
   }
  }
 }
}
