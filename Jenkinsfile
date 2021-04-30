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

        stage('Build apk') {
            steps {
                script {
                    buildApk = docker.build(buildApkImg, "-f ./docker/build-apk/Dockerfile .")

                    buildApk.inside {
                        sh 'cd /app && ionic cordova build android --prod --release'
                        sh 'cd /app/platforms/android && ./gradlew bundleRelease'
                        sh 'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore \$KEYSTORE_FILE /app/platforms/android/app/build/outputs/bundle/release/app-release.aab \$KEYSTORE_ALIAS -storepass \$KEYSTORE_PASSWORD'
                        sh 'cp /app/platforms/android/app/build/outputs/bundle/release/app-release.aab \$WORKSPACE/app-signed.aab'
                        sh 'cp /app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \$WORKSPACE/app-release-unsigned.apk'
                    }
                }
            }
        }

        stage('Archive artifact to s3') {
            steps {
                archiveArtifacts artifacts: 'app-release-unsigned.apk', fingerprint: true
            }
        }

        stage('Publish bundle to play store') {
            steps {
                androidApkUpload(
                    googleCredentialsId: 'belair',
                    trackName: 'internal',
                    rolloutPercentage: '0',
                    filesPattern: 'app-signed.aab'
                )
            }
        }

        // stage('Run Device Farm Test') {
        //     steps {
        //         devicefarm (
        //             projectName: 'AcopicTest',
        //             devicePoolName: 'Top Devices',
        //             // testSpecName: 'nebulae.yml',
        //             testSpecName: '',
        //             // environmentToRun: 'CustomEnvironment',
        //             environmentToRun: '',
        //             appArtifact:'app-debug-latest.apk',
        //             runName: "Belair-build-${BUILD_ID}",
        //             // testToRun: 'APPIUM_JAVA_TESTNG',
        //             testToRun: 'BUILTIN_FUZZ',
        //             storeResults: '',
        //             isRunUnmetered: '',
        //             eventCount: '',
        //             eventThrottle: '',
        //             seed: '',
        //             username: '',
        //             password: '',
        //             appiumJavaJUnitTest: '',
        //             appiumJavaTestNGTest: 'test.zip',
        //             appiumPythonTest: '',
        //             appiumRubyTest: '',
        //             appiumNodeTest: '',
        //             calabashFeatures: '',
        //             calabashTags: '',
        //             calabashProfile: '',
        //             junitArtifact: '',
        //             junitFilter: '',
        //             uiautomatorArtifact: '',
        //             uiautomatorFilter: '',
        //             uiautomationArtifact: '',
        //             xctestArtifact: '',
        //             xctestFilter: '',
        //             xctestUiArtifact: '',
        //             xctestUiFilter: '',
        //             appiumVersionJunit: '',
        //             appiumVersionPython: '',
        //             appiumVersionTestng: '',
        //             ifWebApp: false,
        //             extraData: false,
        //             extraDataArtifact: '',
        //             deviceLocation: false,
        //             deviceLatitude: 0,
        //             deviceLongitude: 0,
        //             radioDetails: true,
        //             ifBluetooth: true,
        //             ifWifi: true,
        //             ifGPS: true,
        //             ifNfc: false,
        //             jobTimeoutMinutes: 10,
        //             ifVideoRecording: true,
        //             ifAppPerformanceMonitoring: false,
        //             ignoreRunError: false,
        //             ifVpce: false,
        //             ifSkipAppResigning: false,
        //             vpceServiceName: '',
        //         )
        //     }
        // }
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
            cleanWs()
        }
    }
}


