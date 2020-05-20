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
            }
        }
      }

      stage('Copy apk') {
        steps {
            sh 'docker run -v /var/lib/jenkins/workspace/Belair-2.0_V2/builds:/app/builds mbursac/belair-2.0 sh -c "cp /app/platforms/android/app/build/outputs/apk/debug/app-debug.apk /app/builds/app-debug-latest.apk"'
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

      stage('Stop all docker containers') {
        steps {
            sh 'docker stop $(docker ps -aq)'
        }
      }

      stage('Remove all docker containers') {
        steps {
            sh 'docker rm $(docker ps -aq)'
        }
      }

      stage('Slack apk link') {
        steps {
            slackSend channel: '#belair',
            message: "New apk file available at: http://belair.nebulae.be:8080/job/Belair-2.0/job/V2/${env.BUILD_NUMBER}/execution/node/3/ws/builds/"
        }
      }
   }
}


