node {

  def dockerImage

  stage('Build image') {
    dockerImage = docker.build("mbursac/belair-2.0")
  }

  stage('Push image') {
    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
      dockerImage.push()
    }
  }

}
