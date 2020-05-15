pipeline {
   environment {
       registry = "mbursac/belair-2.0"
       registryCredential = 'docker-hub-credentials'
       app = ''
   }

   agent any

   stages {
      stage('Build docker image') {
       steps {
            script {
                app = docker.build registry
                app.inside('--name belair $(pwd)/builds:/app/builds -it registry') {
                    cp /app/platforms/android/app/build/outputs/apk/debug/app-debug.apk /app/builds/app-debug.apk
                }
                archiveArtifacts artifacts: '*.apk'
            }
       }
      }
      stage('Push image') {
        steps {
            script {
              docker.withRegistry('', registryCredential) {
                  app.push()
              }
            }
        }
      }
      stage('Remove Unused docker image') {
        steps{
          sh "docker rmi $registry"
        }
      }
   }
}


