pipeline {
    environment {
        registryCredential = 'docker-hub-credentials'
        appImg = "nebulaesoftware/belair-2.0"
        app = ''
        S3_BUCKET = 'belair-builds'
        S3_REGION = 'eu-central-1'
        SLACK_CHANNEL = '#belair'
        KEYSTORE_NAME = 'irceline2018.keystore'
    }

   agent any

    stages {
        stage('Configure environment') {
            steps {
                withCredentials([
                    file(credentialsId: 'google-services.json', variable: 'GSERVICE_JSON'),
                    file(credentialsId: 'KEYSTORE_FILE', variable: 'KEYSTORE_FILE')
                ]) {
                    sh "cp \$GSERVICE_JSON google-services.json"
                    sh "chmod 600 google-services.json"
                    sh "cp \$KEYSTORE_FILE ."
                }

                script {
                    // Replace package name
                    def text = readFile file: "config.xml"
                    text = text.replaceAll("be.irceline.aqmobile_v2", "be.irceline.aqmobile")
                    writeFile file: "config.xml", text: text
                }
            }
        }

        stage('Prepare app') {
            steps {
                script {
                    app = docker.build(appImg, "-f ./docker/release-android/Dockerfile .")
                }
            }
        }

        stage('Copy apk') {
            steps {
                script {
                    app.inside { 
                        sh 'cp /app/platforms/android/app/build/outputs/apk/debug/app-debug.apk \$WORKSPACE/app-debug-latest.apk'
                    }
                }
            }
        }

        stage('Play Store release') {
            steps {
                withCredentials([
                    file(credentialsId: 'KEYSTORE_ALIAS', variable: 'KEYSTORE_ALIAS'),
                    file(credentialsId: 'KEYSTORE_PASSWORD', variable: 'KEYSTORE_PASSWORD')
                ]) {
                script {
                    app.inside { 
                        sh 'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore \$KEYSTORE_NAME platforms/android/app/build/outputs/bundle/release/app-release.aab \$KEYSTORE_ALIAS -storepass \$KEYSTORE_PASSWORD'
                        sh 'cp /app/platforms/android/app/build/outputs/bundle/release/app-release.aab \$WORKSPACE/app-release.aab'
                    }
                }
            }
        }

        stage('Remove all containers') {
            steps {
                sh 'docker container prune'
            }
        }

        stage('Remove all dangling images') {
            steps {
                sh 'docker image prune -f'
            }
        }

        stage('Archive artifact to s3') {
            steps {
                archiveArtifacts artifacts: 'app-debug-latest.apk', fingerprint: true
                archiveArtifacts artifacts: 'app-release.aab', fingerprint: true
            }
        }

        stage('Run Device Farm Test') {
            steps {
                devicefarm (
                    projectName: 'AcopicTest',
                    devicePoolName: 'Top Devices',
                    // testSpecName: 'nebulae.yml',
                    testSpecName: '',
                    // environmentToRun: 'CustomEnvironment',
                    environmentToRun: '',
                    appArtifact:'app-debug-latest.apk',
                    runName: "Belair-build-${BUILD_ID}",
                    // testToRun: 'APPIUM_JAVA_TESTNG',
                    testToRun: 'BUILTIN_FUZZ',
                    storeResults: '',
                    isRunUnmetered: '',
                    eventCount: '',
                    eventThrottle: '',
                    seed: '',
                    username: '',
                    password: '',
                    appiumJavaJUnitTest: '',
                    appiumJavaTestNGTest: 'test.zip',
                    appiumPythonTest: '',
                    appiumRubyTest: '',
                    appiumNodeTest: '',
                    calabashFeatures: '',
                    calabashTags: '',
                    calabashProfile: '',
                    junitArtifact: '',
                    junitFilter: '',
                    uiautomatorArtifact: '',
                    uiautomatorFilter: '',
                    uiautomationArtifact: '',
                    xctestArtifact: '',
                    xctestFilter: '',
                    xctestUiArtifact: '',
                    xctestUiFilter: '',
                    appiumVersionJunit: '',
                    appiumVersionPython: '',
                    appiumVersionTestng: '',
                    ifWebApp: false,
                    extraData: false,
                    extraDataArtifact: '',
                    deviceLocation: false,
                    deviceLatitude: 0,
                    deviceLongitude: 0,
                    radioDetails: true,
                    ifBluetooth: true,
                    ifWifi: true,
                    ifGPS: true,
                    ifNfc: false,
                    jobTimeoutMinutes: 10,
                    ifVideoRecording: true,
                    ifAppPerformanceMonitoring: false,
                    ignoreRunError: false,
                    ifVpce: false,
                    ifSkipAppResigning: false,
                    vpceServiceName: '',
                )
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
            cleanWs()
        }
    }
}


