pipeline {
  agent any

  environment {
    ACR = "myacr.azurecr.io"
    IMAGE = "nextjs-app"
    TAG = "latest"
  }

  stages {

    stage('Login to ACR') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'acr-creds',
          usernameVariable: 'ACR_USER',
          passwordVariable: 'ACR_PASS'
        )]) {
          sh 'docker login $ACR -u $ACR_USER -p $ACR_PASS'
        }
      }
    }

    stage('Pull Image') {
      steps {
        sh 'docker pull $ACR/$IMAGE:$TAG'
      }
    }

    stage('Deploy') {
      steps {
        sh '''
        docker-compose down
        docker-compose up -d
        '''
      }
    }
  }
}
