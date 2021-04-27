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

        // stage('Create app') {
        //     steps {
        //         script {
        //             app = docker.build(appImg, "-f ./docker/create-app/Dockerfile .")
        //         }
        //     }
        // }

        // stage('Build apk') {
        //     steps {
        //         script {
        //             buildApk = docker.build(buildApkImg, "-f ./docker/build-apk/Dockerfile .")
        //         }
        //     }
        // }

        // stage('Copy apk') {
        //     steps {
        //         script {
        //             buildApk.inside { 
        //                 sh 'cp /app/platforms/android/app/build/outputs/apk/debug/app-debug.apk \$WORKSPACE/app-debug-latest.apk'
        //             }
        //         }
        //     }
        // }

        // stage('Remove all containers') {
        //     steps {
        //         sh 'docker container prune'
        //     }
        // }

        // stage('Remove all dangling images') {
        //     steps {
        //         sh 'docker image prune -f'
        //     }
        // }

        // stage('Archive artifact to s3') {
        //     steps {
        //         archiveArtifacts artifacts: 'app-debug-latest.apk', fingerprint: true
        //     }
        // }

        stage('Copy Test File') {
            steps {
                script {
                    sh "cp ./test/zip-with-dependencies.zip \$WORKSPACE/test.zip"
                }
            }
        }

        stage('Run Device Farm Test') {
            steps {
                devicefarm (
                    projectName: 'AcopicTest',
                    devicePoolName: 'Top Devices',
                    testSpecName: 'buds.yml',
                    environmentToRun: 'CustomEnvironment',
                    appArtifact:'app-debug-latest.apk',
                    runName: "Belair-build-${BUILD_ID}",
                    testToRun: 'APPIUM_JAVA_TESTNG',
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
                    appiumVersionTestng: '1.14.2',
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

    // post {
    //     success {
    //         slackSend(
    //             color: "good",
    //             channel: "${SLACK_CHANNEL}", 
    //             message: "New apk file available at: https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/belair-v2/${BRANCH_NAME}/${BUILD_ID}/artifacts/app-debug-latest.apk"
    //         )
    //     }

    //     failure {
    //         slackSend(
    //             color: "danger",
    //             channel: "${SLACK_CHANNEL}", 
    //             message: "Pipeline for ${BRANCH_NAME}#${BUILD_ID} failure"
    //         )
    //     }

    //     always {
    //         cleanWs()
    //     }
    // }
}


