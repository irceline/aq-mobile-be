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
                app = docker.build registry + ":$BUILD_NUMBER"

                app.withRun('--name belair -p 8100:8100 -it registry + ":$BUILD_NUMBER" ash') { c ->
                    sh 'ionic cordova platform add android'
                    sh 'ionic cordova build android android'
                }
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
          sh "docker rmi $registry:$BUILD_NUMBER"
        }
      }
   }
}


