pipeline {
    environment {
        registryCredential = 'docker-hub-credentials'
        appImg = "nebulaesoftware/belair-2.0"
        app = ''
        S3_BUCKET = 'belair-builds'
        S3_REGION = 'eu-central-1'
        SLACK_CHANNEL = '#belair'
        KEYSTORE_NAME = 'irceline2018.keystore'
        HOME = "${WORKSPACE}"
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }
    
    agent any

    stages {
        stage('Configure environment') {
            steps {
                withCredentials([
                    file(credentialsId: 'google-services.json', variable: 'GSERVICE_JSON'),
                    file(credentialsId: 'KEYSTORE_FILE', variable: 'KEYSTORE_FILE')
                ]) {
                    sh "npm i -g xml2js"
                    sh "cp \$GSERVICE_JSON google-services.json"
                    sh "chmod 600 google-services.json"
                    sh "cp \$KEYSTORE_FILE ."
                }
            }
        }

        stage('Build app bundle') {
            steps {
                script {
                    app = docker.build(appImg, "-f ./docker/release-android/Dockerfile . --build-arg VERSION_CODE=\$BUILD_NUMBER")
                }
            }
        }

        stage('Sign app bundle') {
            steps {
                withCredentials([
                    string(credentialsId: 'KEYSTORE_ALIAS', variable: 'KEYSTORE_ALIAS'),
                    string(credentialsId: 'KEYSTORE_PASSWORD', variable: 'KEYSTORE_PASSWORD')
                ]) {
                    script {
                        app.inside() {
                            sh 'cp /app/platforms/android/app/build/outputs/bundle/release/app-release.aab /tmp/app-release.aab'
                            
                            // Sign the apk
                            sh 'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore \$KEYSTORE_NAME /tmp/app-release.aab \$KEYSTORE_ALIAS -storepass \$KEYSTORE_PASSWORD'

                            // Copy out release.apk
                            sh 'cp /tmp/app-release.aab \$WORKSPACE/app-release.aab'
                            sh 'cp /app/platforms/android/app/build/outputs/apk/debug/app-debug.apk \$WORKSPACE/app-debug-latest.apk'
                            
                        }
                    }
                }
            }
        }

        stage('Archive artifact to s3') {
            steps {
                archiveArtifacts artifacts: 'app-release.aab', fingerprint: true
                archiveArtifacts artifacts: 'app-debug-latest.apk', fingerprint: true
            }
        }



        stage('Publish to playstore') {
            steps {
                environment {
                    APP_VERSION = sh("node tools/bump_version.js \$BUILD_NUMBER")
                }
                script {
                    androidApkUpload(
                        googleCredentialsId: 'belair_svc_account',
                        filesPattern: 'app-release.aab',
                        rolloutPercentage: '100',
                        trackName: 'internal',
                        releaseName: "$APP_VERSION",
                    )
                }
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
        success {
            slackSend(
                color: "good",
                channel: "${SLACK_CHANNEL}", 
                message: "New apk file available at: https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/belair-v2/${BRANCH_NAME}/${BUILD_ID}/artifacts/app-debug-latest.apk"
            )
        }

        failure {
            slackSend(
                color: "danger",
                channel: "${SLACK_CHANNEL}", 
                message: "Pipeline for ${BRANCH_NAME}#${BUILD_ID} failure"
            )
        }

        always {
            sh 'docker container prune -f'
            sh 'docker image prune -a -f'
            cleanWs()
        }
    }
}


