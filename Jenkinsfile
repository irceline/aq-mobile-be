pipeline {
   environment {
       registryCredential = 'docker-hub-credentials'
       appImg = "nebulaesoftware/belair-2.0"
       app = ''
       setupEnvImg = "nebulaesoftware/android-build-environment"
       setupEnv = ''
       buildApkImg = "nebulaesoftware/build-ionic-apk"
       buildApk = ''
   }

   agent any

   stages {
      stage('Create app environment') {
       steps {
            script {
                setupEnv = docker.build(setupEnvImg, "-f ./docker/setup-environment/Dockerfile .")
            }
        }
      }

      stage('Configure environment') {
        steps {
            withCredentials([
                file(credentialsId: 'google-services.json', variable: 'GSERVICE_JSON'),
            ]) {
                sh "cp \$GSERVICE_JSON google-services.json"
            }

            // Replace package name
            def text = readFile file: "config.xml"
            text = text.replaceAll("be.irceline.aqmobile_v2", "be.irceline.aqmobile")
            writeFile file: "config.xml", text: text
          }
      }

      stage('Create app') {
        steps {
            script {
                
                
                app = docker.build(appImg, "-f ./docker/create-app/Dockerfile .")
            }
        }
      }

      stage('Build apk') {
        steps {
            script {
               buildApk = docker.build(buildApkImg, "-f ./docker/build-apk/Dockerfile .")
            }
        }
      }

      stage('Copy apk') {
        steps {
            sh 'docker run -v /var/lib/jenkins/workspace/Belair-2.0_V2/builds:/app/builds nebulaesoftware/build-ionic-apk sh -c "cp /app/platforms/android/app/build/outputs/apk/debug/app-debug.apk /app/builds/app-debug-latest.apk"'
        }
      }

      // stage('Send apk link via Slack') {
      //   steps {
      //       slackSend channel: '#belair',
      //       message: "New apk file available at: http://belair.nebulae.be:8080/job/Belair-2.0/job/V2/${env.BUILD_NUMBER}/execution/node/3/ws/builds/"
      //   }
      // }

      // stage('Push images') {
      //   steps {
      //       script {
      //           docker.withRegistry('', registryCredential) {
      //                 setupEnv.push()
      //                 app.push()
      //                 buildApk.push()
      //           }
      //       }
      //   }
      // }

      // stage('Stop all containers') {
      //   steps {
      //       sh 'docker stop $(docker ps -aq)'
      //   }
      // }

      // stage('Remove all containers') {
      //   steps {
      //       sh 'docker rm $(docker ps -aq)'
      //   }
      // }

      // stage('Send apk link via Slack') {
      //   steps {
      //       slackSend channel: '#belair',
      //       message: "New apk file available at: http://belair.nebulae.be:8080/job/Belair-2.0/job/V2/${env.BUILD_NUMBER}/execution/node/3/ws/builds/"
      //   }
      // }
   }
}


