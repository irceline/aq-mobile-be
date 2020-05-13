pipeline {
   agent any
   environment {
            HOME = '.'
   }
   stages {
      stage('Build docker image') {
      agent {
              dockerfile {
                 filename 'Dockerfile'
                 args "-t belair-2.0"
              }
             }
     steps {
          sh 'docker run --name belair -p 8100:8100 -it belair-2.0 ash'
          sh 'ionic cordova platform add android'
          sh 'ionic cordova build android android'
     }
    }
   }
}


