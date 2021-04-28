pipeline {
    environment {
        registryCredential = 'docker-hub-credentials'
        appImg = "nebulaesoftware/belair-2.0"
        app = ''
        setupEnvImg = "nebulaesoftware/android-build-environment"
        setupEnv = ''
        buildApkImg = "nebulaesoftware/build-ionic-apk"
        buildApk = ''
        S3_BUCKET = 'belair-builds'
        S3_REGION = 'eu-central-1'
        SLACK_CHANNEL = '#belair'

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
                    sh "chmod 600 google-services.json"
                }

                script {
                    // Replace package name
                    def text = readFile file: "config.xml"
                    text = text.replaceAll("be.irceline.aqmobile_v2", "be.irceline.aqmobile")
                    writeFile file: "config.xml", text: text
                }
            }
        }

        stage('Create app') {
            steps {
                script {
                    app = docker.build(appImg, "-f ./docker/create-app/Dockerfile .")
                }
            }
        }

        stage('Parallel Test & create app') {
            parallel {
                stage('Build apk') {
                    steps {
                        script {
                            buildApk = docker.build(buildApkImg, "-f ./docker/build-apk/Dockerfile .")
                        }
                    }
                }
                stage('Test app') {
                    steps {
                        script {
                            app.inside {
                                sh 'cd /app && ng test --code-coverage'
                            }
                        }
                    }
                }
            }
        }
        

        stage('Copy apk') {
            steps {
                script {
                    buildApk.inside { 
                        sh 'cp /app/platforms/android/app/build/outputs/apk/debug/app-debug.apk \$WORKSPACE/app-debug-latest.apk'
                    }
                }
            }
        }

        stage('Archive artifact to s3') {
            steps {
                archiveArtifacts artifacts: 'app-debug-latest.apk', fingerprint: true
            }
        }
    }

    post {
        // success {
        //     slackSend(
        //         color: "good",
        //         channel: "${SLACK_CHANNEL}", 
        //         message: "New apk file available at: https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/belair-v2/${BRANCH_NAME}/${BUILD_ID}/artifacts/app-debug-latest.apk"
        //     )
        // }

        // failure {
        //     slackSend(
        //         color: "danger",
        //         channel: "${SLACK_CHANNEL}", 
        //         message: "Pipeline for ${BRANCH_NAME}#${BUILD_ID} failure"
        //     )
        // }

        always {
            sh 'docker container prune -f'
            sh 'docker image prune -f'
            sh 'docker volume prune -f'
            cleanWs()
        }
    }
}


